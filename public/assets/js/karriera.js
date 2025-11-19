// ---- constants
const LS_KEY = "abissnet_jobs";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
// Replace this with the actual HR email address where applications should be sent.
// Using FormSubmit.co: the script will POST the form to FormSubmit which forwards to the email.
// To make this work you should replace the value below with the real HR email
// (and verify the email at formsubmit.co on first submit if required).
const HR_EMAIL = "b.njerezore@abissnet.al"; // set to provided HR email
const adminPanel = document.getElementById("adminPanel");
const btnAdminToggle = document.getElementById("btnAdminToggle");
const csvInput = document.getElementById("csvInput");
const btnImportCSV = document.getElementById("btnImportCSV");
const btnExportCSV = document.getElementById("btnExportCSV");
const btnClearAll = document.getElementById("btnClearAll");
const addJobForm = document.getElementById("addJobForm");
const jobsContainer = document.getElementById("jobsContainer");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const filterDepartment = document.getElementById("filterDepartment");
const filterType = document.getElementById("filterType");
const applyModal = document.getElementById("applyModal");
const applyPositionTitle = document.getElementById("applyPositionTitle");
const positionTitleHidden = document.getElementById("positionTitleHidden");
const applyForm = document.getElementById("applyForm");
const applyStatus = document.getElementById("applyStatus");
const closeModal = document.getElementById("closeModal");
const cancelModal = document.getElementById("cancelModal");
const resumeInput = document.getElementById("resumeInput");

let jobs = loadJobs();
if (!jobs.length) {
  jobs = [
    {
      id: crypto.randomUUID(),
      title: "Network Engineer",
      department: "Inxhinieri",
      location: "Tiranë",
      type: "Full-time",
      description: "Administrim rrjeti, Mikrotik, VLAN, GPON/EPON.",
      published: true,
      created_at: new Date().toISOString().slice(0, 10),
    },
    {
      id: crypto.randomUUID(),
      title: "Odoo Developer",
      department: "IT/Software",
      location: "Hybrid",
      type: "Full-time",
      description: "Odoo 17/18 CE, Python, PostgreSQL, REST, Owl.",
      published: true,
      created_at: new Date().toISOString().slice(0, 10),
    },
  ];
  saveJobs();
}

jobs = jobs.map((j) => ({
  id: j.id || crypto.randomUUID(),
  title: j.title || "",
  department: j.department || "",
  location: j.location || "",
  type: j.type || "",
  description: j.description || "",
  published: typeof j.published === "boolean" ? j.published : true,
  created_at: j.created_at || new Date().toISOString().slice(0, 10),
}));
saveJobs();

// ---- admin gate (IMPROVED: Should use backend auth in production)
(function initAdmin() {
  const urlParams = new URLSearchParams(location.search);
  if (urlParams.get("admin") === "1") {
    adminPanel.hidden = false;
  }
  btnAdminToggle?.addEventListener("click", () => {
    // Simpler, reliable demo flow: prompt for demo password and redirect
    const user = prompt("Shkruaj user admin:");
    const pass = prompt("Shkruaj fjalëkalimin admin:");
    if (!user) return;
    if (!pass) return;

    // Demo-only: accept the known demo password and open admin page
    if (user === "@b1ssn3t" && pass === "abissnet-admin") {
      try { sessionStorage.setItem('abiss_hr_auth', '1'); } catch (e) {}
      // go to the admin page
      window.location.href = 'admin.html';
      return;
    }

    // Otherwise show a clear message — no silent failures
    alert('Kredenciale të pasakta.');
  });
})();

// ---- storage
function loadJobs() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to load jobs:", err);
    return [];
  }
}

function saveJobs() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(jobs));
    render();
  } catch (err) {
    console.error("Failed to save jobs:", err);
    showToast("Gabim në ruajtjen e të dhënave.", "error");
  }
}

// ---- CSV helpers (IMPROVED: Better parsing)
function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  const out = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || (i === 0 && /title\s*,\s*department/i.test(line))) continue;

    // Simple CSV parsing (for production, use Papa Parse library)
    const parts = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
    const cleanParts = parts.map((p) => p.replace(/^"|"$/g, "").trim());

    if (!cleanParts[0]) continue;

    out.push({
      id: crypto.randomUUID(),
      title: cleanParts[0] || "",
      department: cleanParts[1] || "",
      location: cleanParts[2] || "",
      type: cleanParts[3] || "",
      description: cleanParts[4] || "",
      published: String(cleanParts[5] || "true").toLowerCase() !== "false",
      created_at: cleanParts[6] || new Date().toISOString().slice(0, 10),
    });
  }
  return out;
}

function toCSV(items) {
  const header =
    "title,department,location,type,description,published,created_at";
  const rows = items.map((j) => {
    const escape = (str) => `"${String(str || "").replace(/"/g, '""')}"`;
    return [
      escape(j.title),
      escape(j.department),
      escape(j.location),
      escape(j.type),
      escape((j.description || "").replace(/\n/g, " ")),
      j.published ? "true" : "false",
      j.created_at || "",
    ].join(",");
  });
  return [header, ...rows].join("\n");
}

// ---- admin actions
btnImportCSV?.addEventListener("click", async () => {
  const file = csvInput.files?.[0];
  if (!file) return showToast("Zgjidh një CSV.", "warning");

  try {
    const text = await file.text();
    const parsed = parseCSV(text);
    if (!parsed.length) return showToast("CSV bosh ose invalid.", "error");

    jobs = [...jobs, ...parsed];
    saveJobs();
    csvInput.value = "";
    showToast(`${parsed.length} pozicione u importuan.`, "success");
  } catch (err) {
    console.error("CSV import error:", err);
    showToast("Gabim në importimin e CSV.", "error");
  }
});

btnExportCSV?.addEventListener("click", () => {
  try {
    const blob = new Blob([toCSV(jobs)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `abissnet-jobs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("CSV u eksportua me sukses.", "success");
  } catch (err) {
    console.error("CSV export error:", err);
    showToast("Gabim në eksportimin e CSV.", "error");
  }
});

btnClearAll?.addEventListener("click", () => {
  if (!confirm("Je i sigurt? Do fshihen të gjitha pozicionet.")) return;
  jobs = [];
  saveJobs();
  showToast("Të gjitha pozicionet u fshinë.", "success");
});

addJobForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(addJobForm);

  const newJob = {
    id: crypto.randomUUID(),
    title: fd.get("title")?.toString().trim(),
    department: fd.get("department")?.toString().trim(),
    location: fd.get("location")?.toString().trim(),
    type: fd.get("type")?.toString().trim(),
    description: fd.get("description")?.toString().trim(),
    published: !!fd.get("published"),
    created_at: new Date().toISOString().slice(0, 10),
  };

  // Validation
  if (!newJob.title) {
    return showToast("Titulli është i detyrueshëm.", "error");
  }
  if (newJob.title.length > 100) {
    return showToast(
      "Titulli është shumë i gjatë (max 100 karaktere).",
      "error"
    );
  }

  jobs.push(newJob);
  saveJobs();
  addJobForm.reset();
  showToast("Pozicioni u shtua me sukses.", "success");
});

// ---- filters
searchInput?.addEventListener("input", debounce(render, 300));
filterDepartment?.addEventListener("change", render);
filterType?.addEventListener("change", render);

// ---- render
function render() {
  const depts = Array.from(
    new Set(jobs.map((j) => j.department).filter(Boolean))
  ).sort();
  const types = Array.from(
    new Set(jobs.map((j) => j.type).filter(Boolean))
  ).sort();
  fillSelect(filterDepartment, depts, "Departamentet");
  fillSelect(filterType, types, "Tipi");

  const q = (searchInput?.value || "").toLowerCase();
  const fd = filterDepartment?.value || "";
  const ft = filterType?.value || "";

  const filtered = jobs
    .filter((j) => j.published)
    .filter((j) => {
      if (fd && j.department !== fd) return false;
      if (ft && j.type !== ft) return false;
      if (q) {
        const hay = [j.title, j.department, j.location, j.type, j.description]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

  jobsContainer.innerHTML = "";

  if (!filtered.length) {
    emptyState.hidden = false;
    emptyState.setAttribute("role", "status");
    emptyState.setAttribute("aria-live", "polite");
    return;
  }

  emptyState.hidden = true;

  for (const j of filtered) {
    const el = document.createElement("article");
    el.className = "job-card";
    el.setAttribute("role", "article");
    el.setAttribute("aria-label", `Pozicioni: ${j.title}`);

    el.innerHTML = `
      <div class="job-header">
        ${
          j.department
            ? `<div class="job-dept">${escapeHTML(j.department)}</div>`
            : ""
        }
        <div class="job-title">${escapeHTML(j.title)}</div>
      </div>
      <div class="job-meta">
        ${
          j.location ? `<span class="tag">${escapeHTML(j.location)}</span>` : ""
        }
        ${j.type ? `<span class="tag">${escapeHTML(j.type)}</span>` : ""}
        ${
          j.created_at
            ? `<span class="tag">${escapeHTML(j.created_at)}</span>`
            : ""
        }
      </div>
      ${
        j.description
          ? `<p class="job-desc">${escapeHTML(j.description)}</p>`
          : ""
      }
      <div class="job-actions">
        <button class="btn primary" data-apply="${
          j.id
        }" aria-label="Apliko për ${escapeHTML(j.title)}">Apliko</button>
        ${
          !adminPanel.hidden
            ? `<button class="btn ghost" data-del="${
                j.id
              }" aria-label="Fshij ${escapeHTML(j.title)}">Fshij</button>`
            : ""
        }
      </div>
    `;
    jobsContainer.appendChild(el);
  }

  // Announce results to screen readers
  announceResults(filtered.length);
}

function fillSelect(select, items, placeholder) {
  if (!select) return;
  const current = select.value;
  select.innerHTML =
    `<option value="">${placeholder}</option>` +
    items
      .map((i) => `<option value="${escapeAttr(i)}">${escapeHTML(i)}</option>`)
      .join("");
  if ([...select.options].some((o) => o.value === current)) {
    select.value = current;
  }
}

function escapeHTML(s = "") {
  return String(s).replace(
    /[&<>"']/g,
    (m) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[
        m
      ])
  );
}

function escapeAttr(s = "") {
  return escapeHTML(s).replace(/"/g, "&quot;");
}

// ---- click handlers
jobsContainer?.addEventListener("click", (e) => {
  const t = e.target;
  if (!(t instanceof HTMLElement)) return;

  const applyId = t.getAttribute("data-apply");
  const delId = t.getAttribute("data-del");

  if (applyId) {
    const job = jobs.find((x) => x.id === applyId);
    if (!job) return;
    applyPositionTitle.textContent = job.title;
    positionTitleHidden.value = job.title;
    applyStatus.textContent = "";
    applyStatus.className = "status";
    applyModal.showModal();
  }

  if (delId && !adminPanel.hidden) {
    if (
      confirm(`Fshij pozicionin: ${jobs.find((j) => j.id === delId)?.title}?`)
    ) {
      jobs = jobs.filter((j) => j.id !== delId);
      saveJobs();
      showToast("Pozicioni u fshi.", "success");
    }
  }
});

closeModal?.addEventListener("click", () => applyModal.close());
cancelModal?.addEventListener("click", () => applyModal.close());

// ---- file validation
resumeInput?.addEventListener("change", (e) => {
  const file = e.target.files?.[0];
  const fileNameDisplay = document.getElementById("fileName");
  
  if (!file) {
    if (fileNameDisplay) fileNameDisplay.textContent = "";
    return;
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    showToast("Skedari është shumë i madh (max 5MB).", "error");
    resumeInput.value = "";
    if (fileNameDisplay) fileNameDisplay.textContent = "";
    return;
  }

  // Check file type
  const validTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (!validTypes.includes(file.type)) {
    showToast("Format i pasaktë. Përdor PDF, DOC, ose DOCX.", "error");
    resumeInput.value = "";
    if (fileNameDisplay) fileNameDisplay.textContent = "";
    return;
  }

  // Display selected file name
  if (fileNameDisplay) {
    fileNameDisplay.textContent = file.name;
  }
});

// ---- utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function announceResults(count) {
  const announcement =
    count === 1
      ? "1 pozicion u gjet"
      : count === 0
      ? "Nuk ka pozicione"
      : `${count} pozicione u gjetën`;

  // Create temporary live region for screen readers
  const liveRegion = document.createElement("div");
  liveRegion.setAttribute("role", "status");
  liveRegion.setAttribute("aria-live", "polite");
  liveRegion.className = "sr-only";
  liveRegion.textContent = announcement;
  document.body.appendChild(liveRegion);
  setTimeout(() => liveRegion.remove(), 1000);
}

function showToast(message, type = "info") {
  // Simple toast notification (you can replace with a better toast library)
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    padding: 1rem 1.5rem;
    background: ${
      type === "success"
        ? "#10b981"
        : type === "error"
        ? "#ef4444"
        : type === "warning"
        ? "#f59e0b"
        : "#3b82f6"
    };
    color: white;
    border-radius: 12px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 9999;
    animation: slideIn 0.3s ease;
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = "slideOut 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Add CSS for toast animations
const style = document.createElement("style");
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
`;
document.head.appendChild(style);

// initial render
render();

// Listen for storage changes (updates from admin page in other tabs)
window.addEventListener('storage', (e) => {
  if (!e.key) return;
  if (e.key === 'abissnet_jobs') {
    try {
      const updated = JSON.parse(e.newValue || '[]');
      jobs = updated;
      render();
    } catch (err) {
      console.warn('Failed to parse updated jobs from storage event', err);
    }
  }
});

// ---- Optional test helper (opt-in)
// Opens when you visit karriera.html?testmail=1 and shows a small floating button
// that attempts a FormSubmit POST and reports the result. This helps detect
// whether the browser can reach FormSubmit and whether a CORS/network error occurs.
async function testEmailSend() {
  const endpoint = `https://formsubmit.co/${encodeURIComponent(HR_EMAIL)}`;
  showToast('Duke dërguar testin...', 'info');
  try {
    const fd = new FormData();
    fd.append('position_title', 'TEST - formsend');
    fd.append('full_name', 'Test User');
    fd.append('email', 'test@example.com');
    fd.append('_subject', 'TEST Aplikim - Karriera');
    fd.append('_captcha', 'false');

    const res = await fetch(endpoint, { method: 'POST', body: fd });
    if (res.ok || res.status === 302) {
      showToast('Testi u dërgua (status ok). Kontrollo inbox-in HR.', 'success');
      console.info('FormSubmit test response:', res);
      return { ok: true, status: res.status };
    }
    const text = await res.text().catch(() => '');
    showToast('Test dështoi: server lajmëroi gabim.', 'error');
    console.error('FormSubmit test non-ok:', res.status, text);
    return { ok: false, status: res.status, body: text };
  } catch (err) {
    // Network errors (including CORS) will land here and are usually TypeError
    showToast('Test dështoi: gabim rrjeti/CORS. Shiko console.', 'error');
    console.error('FormSubmit test error (likely CORS/network):', err);
    return { ok: false, error: String(err) };
  }
}

// If ?testmail=1 is present, add a small floating button to trigger the test helper
try {
  const params = new URLSearchParams(location.search);
  if (params.get('testmail') === '1') {
    const btn = document.createElement('button');
    btn.textContent = 'Send test email';
    btn.style.cssText = 'position:fixed;right:1rem;bottom:4.5rem;z-index:99999;background:#111;color:#fff;border-radius:8px;padding:0.6rem 0.9rem;border:none;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,0.2)';
    btn.addEventListener('click', () => testEmailSend());
    document.body.appendChild(btn);
  }
} catch (e) {
  /* ignore in non-browser environments */
}
