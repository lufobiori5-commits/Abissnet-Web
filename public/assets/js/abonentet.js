// ========================================
// SUBSCRIBER PORTAL JAVASCRIPT
// ========================================
// DEPENDENCIES: Requires toast.js to be loaded first
// Uses: showToast(), isValidEmail()
// ========================================

// Configuration
const API = (path) => {
  const base = window.API_BASE || "";
  return base + path;
};
const tokenKey = "subs_token";
const qs = (sel) => document.querySelector(sel);
const qsa = (sel) => document.querySelectorAll(sel);

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  wireUI();
  autoLoginInfo();
  if (getToken()) {
    enableUI();
    refreshAll();
  }
});

// Wire up all event listeners
function wireUI() {
  qs("#btnLogin")?.addEventListener("click", loginFlow);
  qs("#btnPay")?.addEventListener("click", () => payNow());
  qs("#btnPayHeader")?.addEventListener("click", () => payNow());
  qs("#btnContactHeader")?.addEventListener("click", showContactModal);

  qs("#btnLineTest")?.addEventListener("click", lineTest);
  qs("#btnRestartCPE")?.addEventListener("click", restartCPE);

  qs("#btnPayNow")?.addEventListener("click", payNow);
  qs("#btnInvoices")?.addEventListener("click", openInvoices);

  qs("#btnUpgrade")?.addEventListener("click", upgradePlan);
  qs("#btnAddTV")?.addEventListener("click", addTV);

  qs("#btnSpeedTest")?.addEventListener("click", speedTest);

  qs("#btnMyTickets")?.addEventListener("click", () => listTickets(true));
  qs("#ticketForm")?.addEventListener("submit", submitTicket);

  qs("#btnChangeWifi")?.addEventListener("click", changeWifi);
  qs("#btnPublicIP")?.addEventListener("click", showPublicIP);
}

// ========================================
// AUTHENTICATION
// ========================================
function autoLoginInfo() {
  const t = getToken();
  const info = qs("#loginInfo");
  const btn = qs("#btnLogin");

  if (t) {
    info.textContent = "I identifikuar (demo)";
    if (btn) btn.textContent = "Dil";
  } else {
    info.textContent = "Nuk jeni i identifikuar.";
    if (btn) btn.textContent = "Hyr / Regjistrohu";
  }
}

function getToken() {
  return localStorage.getItem(tokenKey) || "";
}

function setToken(t) {
  localStorage.setItem(tokenKey, t);
  autoLoginInfo();
}

function clearToken() {
  localStorage.removeItem(tokenKey);
  autoLoginInfo();
}

async function loginFlow() {
  // If already logged in, log out
  if (getToken()) {
    if (confirm("Dëshironi të dilni nga llogaria?")) {
      clearToken();
      disableUI();
      clearOverview();
      showToast("U shkëputët me sukses", "success");
    }
    return;
  }

  // Show login form (better than prompt)
  const email = prompt("Email (demo: demo@abissnet.al)");
  if (!email) return;

  const pass = prompt("Fjalëkalimi (demo: demo123)");
  if (!pass) return;

  // Show loading state
  const btn = qs("#btnLogin");
  const originalText = btn?.textContent;
  if (btn) {
    btn.disabled = true;
    btn.classList.add("loading");
    btn.textContent = "Duke u lidhur...";
  }

  try {
    const res = await fetch(API("/api/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: pass }),
    });

    if (!res.ok) {
      throw new Error("Kredenciale të pasakta");
    }

    const data = await res.json();
    setToken(data.token);
    enableUI();
    await refreshAll();
    showToast("U identifikuat me sukses!", "success");
  } catch (e) {
    console.error("Login error:", e);
    showToast(
      e.message || "Nuk u lidh me serverin. Kontrolloni lidhjen.",
      "error"
    );
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.classList.remove("loading");
      btn.textContent = originalText;
    }
  }
}

function authHeaders() {
  const t = getToken();
  return t ? { Authorization: "Bearer " + t } : {};
}

// ========================================
// UI STATE MANAGEMENT
// ========================================
const disableableSelectors = [
  "#btnLineTest",
  "#btnRestartCPE",
  "#btnPayNow",
  "#btnInvoices",
  "#btnUpgrade",
  "#btnAddTV",
  "#btnSpeedTest",
  "#btnMyTickets",
  "#ticketForm input",
  "#ticketForm select",
  "#ticketForm textarea",
  "#ticketForm button",
  "#btnChangeWifi",
  "#btnPublicIP",
];

function enableUI() {
  disableableSelectors.forEach((sel) => {
    qsa(sel).forEach((el) => (el.disabled = false));
  });
}

function disableUI() {
  disableableSelectors.forEach((sel) => {
    qsa(sel).forEach((el) => (el.disabled = true));
  });
}

function clearOverview() {
  qs("#serviceStatus").textContent = "Jo i identifikuar";
  qs("#serviceStatus").className = "badge";
  qs("#serviceNote").textContent = "Hyni për të parë statusin.";
  qs("#billingCycle").textContent = "—";
  qs("#lastInvoice").textContent = "—";
  qs("#dueDate").textContent = "—";
  qs("#balance").textContent = "—";
  qs("#planTag").textContent = "—";
  qs("#planDesc").textContent = "—";
  qs("#devicesGrid").innerHTML = "";
  qs("#downMbps").textContent = "—";
  qs("#upMbps").textContent = "—";
}

// ========================================
// DATA FETCHING
// ========================================
async function refreshAll() {
  if (!getToken()) return;

  try {
    const [ov, devs] = await Promise.all([
      fetch(API("/api/overview"), { headers: authHeaders() }).then((r) => {
        if (!r.ok) throw new Error("Failed to fetch overview");
        return r.json();
      }),
      fetch(API("/api/devices"), { headers: authHeaders() }).then((r) => {
        if (!r.ok) throw new Error("Failed to fetch devices");
        return r.json();
      }),
    ]);

    // Update service status
    const serviceOK = ov.service?.status === "active";
    const statusBadge = qs("#serviceStatus");
    statusBadge.textContent = serviceOK ? "Aktiv" : "Problem";
    statusBadge.className = serviceOK ? "badge" : "badge inactive";
    qs("#serviceNote").textContent = ov.service?.note || "";

    // Update billing info
    qs("#billingCycle").textContent = ov.billing?.cycle || "—";
    qs("#lastInvoice").textContent = ov.billing?.last_invoice || "—";
    qs("#dueDate").textContent = ov.billing?.due_date || "—";
    qs("#balance").textContent = ov.billing?.balance || "—";

    // Update plan info
    qs("#planTag").textContent = ov.plan?.name || "—";
    qs("#planDesc").textContent = ov.plan?.desc || "—";

    // Update devices
    renderDevices(devs.devices || []);
  } catch (e) {
    console.error("Refresh error:", e);
    showToast("Gabim në ngarkimin e të dhënave", "error");
  }
}

function renderDevices(devices) {
  const wrap = qs("#devicesGrid");
  wrap.innerHTML = "";

  if (!devices.length) {
    wrap.innerHTML = '<p class="muted">Nuk ka pajisje të regjistruara.</p>';
    return;
  }

  devices.forEach((d) => {
    const el = document.createElement("div");
    el.className = "device-card";
    el.setAttribute("role", "article");
    el.innerHTML = `
      <div class="title">${escapeHTML(
        d.title
      )} <span class="muted">(${escapeHTML(d.model)})</span></div>
      <div class="meta">MAC: ${escapeHTML(d.mac)}</div>
      <div class="meta">IP: ${escapeHTML(d.ip)}</div>
      <div class="meta">Status: ${escapeHTML(d.status)}</div>
    `;
    wrap.appendChild(el);
  });
}

// ========================================
// SERVICE ACTIONS
// ========================================
async function lineTest() {
  const statusEl = qs("#serviceStatus");
  const noteEl = qs("#serviceNote");
  const originalStatus = statusEl.textContent;

  statusEl.textContent = "Duke testuar…";

  try {
    const res = await fetch(API("/api/line-test"), {
      method: "POST",
      headers: authHeaders(),
    });

    if (!res.ok) throw new Error("Test failed");

    const data = await res.json();
    statusEl.textContent = data.ok ? "Aktiv" : "Problem";
    statusEl.className = data.ok ? "badge" : "badge inactive";
    noteEl.textContent = data.note || "";

    showToast(
      data.ok ? "Linja është në rregull" : "U gjet një problem",
      data.ok ? "success" : "warning"
    );
  } catch (e) {
    console.error("Line test error:", e);
    statusEl.textContent = originalStatus;
    showToast("Testi dështoi", "error");
  }
}

async function restartCPE() {
  if (
    !confirm(
      "Jeni i sigurt që doni të rindizni modemin? Kjo do të ndërpresë shërbimin për 2-3 minuta."
    )
  ) {
    return;
  }

  const btn = qs("#btnRestartCPE");
  setLoading(btn, true);

  try {
    const res = await fetch(API("/api/restart-cpe"), {
      method: "POST",
      headers: authHeaders(),
    });

    if (!res.ok) throw new Error("Restart failed");

    const data = await res.json();

    if (data.ok) {
      showToast("Modemi po rindizohet. Prisni 2-3 minuta.", "success");
    } else {
      throw new Error("Restart rejected");
    }
  } catch (e) {
    console.error("Restart error:", e);
    showToast("Dështoi rindezja e modemit", "error");
  } finally {
    setLoading(btn, false);
  }
}

// ========================================
// BILLING ACTIONS
// ========================================
async function payNow() {
  const btn = event?.target;
  setLoading(btn, true);

  try {
    const res = await fetch(API("/api/pay"), {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ amount_hint: 3200 }),
    });

    if (!res.ok) throw new Error("Payment failed");

    const data = await res.json();

    if (data.url) {
      showToast("Duke hapur faqen e pagesës...", "info");
      setTimeout(() => {
        location.href = data.url;
      }, 1000);
    } else {
      throw new Error("No payment URL");
    }
  } catch (e) {
    console.error("Payment error:", e);
    showToast("Dështoi gjenerimi i pagesës", "error");
  } finally {
    setLoading(btn, false);
  }
}

async function openInvoices() {
  try {
    const res = await fetch(API("/api/invoices"), { headers: authHeaders() });

    if (!res.ok) throw new Error("Failed to fetch invoices");

    const data = await res.json();
    const invoices = data.invoices || [];

    if (!invoices.length) {
      showToast("Nuk ka fatura", "info");
      return;
    }

    const txt =
      "Faturat:\n\n" +
      invoices
        .map((i) => `${i.date} - ${i.amount} ALL - ${i.status}`)
        .join("\n");

    alert(txt); // TODO: Replace with modal
  } catch (e) {
    console.error("Invoices error:", e);
    showToast("Gabim në ngarkimin e faturave", "error");
  }
}

// ========================================
// PLAN MANAGEMENT
// ========================================
async function upgradePlan() {
  const plan = prompt("Zgjidhni planin e ri (p.sh. Fiber 500):");
  if (!plan) return;

  const btn = qs("#btnUpgrade");
  setLoading(btn, true);

  try {
    const res = await fetch(API("/api/upgrade"), {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });

    if (!res.ok) throw new Error("Upgrade failed");

    const data = await res.json();

    if (data.ok) {
      showToast(`Plani do të përditësohet në: ${plan}`, "success");
      await refreshAll();
    } else {
      throw new Error("Upgrade rejected");
    }
  } catch (e) {
    console.error("Upgrade error:", e);
    showToast("Dështoi përditësimi i planit", "error");
  } finally {
    setLoading(btn, false);
  }
}

async function addTV() {
  if (!confirm("Dëshironi të shtoni shërbimin e televizionit?")) {
    return;
  }

  const btn = qs("#btnAddTV");
  setLoading(btn, true);

  try {
    const res = await fetch(API("/api/add-tv"), {
      method: "POST",
      headers: authHeaders(),
    });

    if (!res.ok) throw new Error("Add TV failed");

    const data = await res.json();

    if (data.ok) {
      showToast("TV u shtua në llogarinë tuaj", "success");
      await refreshAll();
    } else {
      throw new Error("TV addition rejected");
    }
  } catch (e) {
    console.error("Add TV error:", e);
    showToast("Dështoi shtimi i TV", "error");
  } finally {
    setLoading(btn, false);
  }
}

// ========================================
// SPEED TEST
// ========================================
async function speedTest() {
  const downEl = qs("#downMbps");
  const upEl = qs("#upMbps");
  const btn = qs("#btnSpeedTest");

  downEl.textContent = "…";
  upEl.textContent = "…";
  setLoading(btn, true);

  try {
    const res = await fetch(API("/api/speedtest"), {
      method: "POST",
      headers: authHeaders(),
    });

    if (!res.ok) throw new Error("Speed test failed");

    const data = await res.json();
    downEl.textContent = data.down || "—";
    upEl.textContent = data.up || "—";

    showToast("Testi u përfundua", "success");
  } catch (e) {
    console.error("Speed test error:", e);
    downEl.textContent = "—";
    upEl.textContent = "—";
    showToast("Testi dështoi", "error");
  } finally {
    setLoading(btn, false);
  }
}

// ========================================
// SUPPORT TICKETS
// ========================================
async function submitTicket(e) {
  e.preventDefault();

  const form = e.target;
  const statusEl = qs("#ticketStatus");
  const submitBtn = form.querySelector('button[type="submit"]');

  const fd = new FormData(form);
  const payload = Object.fromEntries(fd.entries());

  // Validation
  if (!payload.subject || !payload.category || !payload.message) {
    statusEl.textContent = "Ju lutem plotësoni të gjitha fushat";
    statusEl.className = "status err";
    return;
  }

  setLoading(submitBtn, true);
  statusEl.textContent = "Duke dërguar...";
  statusEl.className = "status";

  try {
    const res = await fetch(API("/api/tickets"), {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Ticket submission failed");

    const data = await res.json();

    if (data.ok) {
      statusEl.textContent = `✓ Ticket u hap me sukses #${data.id}`;
      statusEl.className = "status ok";
      form.reset();
      showToast(`Ticket #${data.id} u hap`, "success");
    } else {
      throw new Error("Ticket creation rejected");
    }
  } catch (e) {
    console.error("Ticket error:", e);
    statusEl.textContent = "Dështoi hapja e ticket-it";
    statusEl.className = "status err";
  } finally {
    setLoading(submitBtn, false);
  }
}

async function listTickets(useAlert = false) {
  try {
    const res = await fetch(API("/api/tickets"), { headers: authHeaders() });

    if (!res.ok) throw new Error("Failed to fetch tickets");

    const data = await res.json();
    const tickets = data.tickets || [];

    if (!tickets.length) {
      if (useAlert) alert("Nuk ka ticket-e të hapura.");
      else showToast("Nuk ka ticket-e", "info");
      return;
    }

    const txt = tickets
      .map((t) => `#${t.id} • ${t.subject} • ${t.category} • ${t.status}`)
      .join("\n");

    if (useAlert) {
      alert("Ticket-et tuaja:\n\n" + txt);
    }
  } catch (e) {
    console.error("List tickets error:", e);
    showToast("Gabim në ngarkimin e ticket-eve", "error");
  }
}

// ========================================
// NETWORK & SETTINGS
// ========================================
function changeWifi() {
  showToast("Funksionaliteti Wi-Fi do të shtohet së shpejti", "info");
  // TODO: Open Wi-Fi settings modal
}

async function showPublicIP() {
  try {
    const res = await fetch(API("/api/public-ip"), { headers: authHeaders() });

    if (!res.ok) throw new Error("Failed to fetch IP");

    const data = await res.json();
    alert(`IP Publike: ${data.ip || "—"}`); // TODO: Replace with modal
  } catch (e) {
    console.error("Public IP error:", e);
    showToast("Gabim në marrjen e IP", "error");
  }
}

function showContactModal() {
  alert("Kontakt:\n\nTel: 0800 55 55\nEmail: support@abissnet.al"); // TODO: Replace with modal
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
function escapeHTML(s = "") {
  return String(s).replace(
    /[&<>"']/g,
    (m) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[m])
  );
}

function setLoading(btn, isLoading) {
  if (!btn) return;

  if (isLoading) {
    btn.disabled = true;
    btn.classList.add("loading");
    btn.dataset.originalText = btn.textContent;
    btn.textContent = "";
  } else {
    btn.disabled = false;
    btn.classList.remove("loading");
    if (btn.dataset.originalText) {
      btn.textContent = btn.dataset.originalText;
      delete btn.dataset.originalText;
    }
  }
}

// ========================================
// INITIALIZATION COMPLETE
// ========================================
console.log("🔐 Subscriber portal initialized!");
