import "dotenv/config";
import express from "express";
import cors from "cors";
import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
import { odooExecute } from "./odooClient.js";
app.use(cors());
app.use(express.json());

// ============ LOGGING MIDDLEWARE ============

// Color codes for console
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  red: "\x1b[31m",
};

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toLocaleString("sq-AL", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Log request
  console.log(
    `${colors.dim}[${timestamp}]${colors.reset} ${colors.cyan}${req.method}${colors.reset} ${req.path}`
  );

  // Log request body for POST/PUT/PATCH
  if (
    ["POST", "PUT", "PATCH"].includes(req.method) &&
    Object.keys(req.body || {}).length > 0
  ) {
    console.log(
      `${colors.dim}   Body:${colors.reset}`,
      JSON.stringify(req.body, null, 2)
    );
  }

  // Capture response
  const originalSend = res.send;
  res.send = function (data) {
    const duration = Date.now() - start;
    const statusColor =
      res.statusCode >= 500
        ? colors.red
        : res.statusCode >= 400
        ? colors.yellow
        : colors.green;

    console.log(
      `${colors.dim}   →${colors.reset} ${statusColor}${res.statusCode}${colors.reset} ${colors.dim}(${duration}ms)${colors.reset}`
    );

    // Log response body for errors
    if (res.statusCode >= 400) {
      try {
        const parsed = JSON.parse(data);
        console.log(`${colors.red}   Error:${colors.reset}`, parsed);
      } catch (e) {
        // Not JSON, skip
      }
    }

    console.log(""); // Empty line for readability
    return originalSend.call(this, data);
  };

  next();
});

// Serve static files from public/ folder
app.use(express.static(path.join(__dirname, "../public")));

// Data file in server/data/
const DATA = path.join(__dirname, "data", "subscribers.json");
await ensureData();

function tokenOK(req) {
  const h = req.headers["authorization"] || "";
  const tok = h.startsWith("Bearer ") ? h.slice(7) : "";
  return tok === "demo-token";
}

function requireAuth(req, res, next) {
  if (!tokenOK(req)) {
    console.log(`${colors.red}❌ Unauthorized access attempt${colors.reset}`);
    return res.status(401).json({ error: "unauthorized" });
  }
  next();
}

// ============ API ROUTES ============
app.post("/api/contact", async (req, res) => {
  const payload = req.body; // name, email, phone, city, subject, client_status, message

  try {
    const leadId = await odooExecute("crm.lead", "create_from_api", [payload]);
    res.json({ success: true, lead_id: leadId });
  } catch (err) {
    console.error("ODDO ERROR:", err);
    res.status(500).json({ success: false, error: err.toString() });
  }
});

app.post("/api/careers/apply", async (req, res) => {
  const data = req.body; // position_title, full_name, email, phone, message, resume_name

  try {
    // Prepare payload for Odoo - 'name' is required field for crm.lead
    const payload = {
      name: `Aplikim: ${data.position_title || 'Pozicion i paspecifikuar'} - ${data.full_name || 'N/A'}`,
      contact_name: data.full_name || "",
      email_from: data.email || "",
      phone: data.phone || "",
      description: data.message || "",
      position_title: data.position_title || "",
      resume_name: data.resume_name || "",
    };

    // Create lead in Odoo - Odoo will handle email sending to b.njerezore@abissnet.al
    const leadId = await odooExecute("crm.lead", "create_from_api_job", [payload]);
    
    console.log(`${colors.green}✅ Job application submitted - Lead #${leadId} created${colors.reset}`);
    console.log(`${colors.cyan}   Applicant: ${data.full_name}${colors.reset}`);
    console.log(`${colors.cyan}   Position: ${data.position_title}${colors.reset}`);
    console.log(`${colors.cyan}   Email will be sent to: b.njerezore@abissnet.al${colors.reset}`);
    
    res.json({ success: true, lead_id: leadId });
  } catch (err) {
    console.error(`${colors.red}❌ Job application error:${colors.reset}`, err);
    res.status(500).json({ 
      success: false, 
      error: "Gabim në dërgimin e aplikimit. Ju lutem provoni përsëri ose kontaktoni support." 
    });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (email === "demo@abissnet.al" && password === "demo123") {
    console.log(`${colors.green}✅ Login successful: ${email}${colors.reset}`);
    return res.json({ token: "demo-token" });
  }
  console.log(`${colors.red}❌ Login failed: ${email}${colors.reset}`);
  res.status(401).json({ error: "invalid" });
});

app.get("/api/overview", requireAuth, async (req, res) => {
  try {
    const s = await readState();
    console.log(`${colors.blue}📊 Fetched overview data${colors.reset}`);
    res.json(s.overview);
  } catch (error) {
    console.error(
      `${colors.red}❌ Error fetching overview:${colors.reset}`,
      error
    );
    res.status(500).json({ error: "Failed to fetch overview" });
  }
});

app.get("/api/devices", requireAuth, async (req, res) => {
  try {
    const s = await readState();
    console.log(
      `${colors.blue}📱 Fetched ${s.devices.length} devices${colors.reset}`
    );
    res.json({ devices: s.devices });
  } catch (error) {
    console.error(
      `${colors.red}❌ Error fetching devices:${colors.reset}`,
      error
    );
    res.status(500).json({ error: "Failed to fetch devices" });
  }
});

app.post("/api/line-test", requireAuth, async (req, res) => {
  console.log(`${colors.magenta}🔍 Running line test...${colors.reset}`);
  setTimeout(() => {
    console.log(`${colors.green}✅ Line test completed${colors.reset}`);
    res.json({ ok: true, note: "S'ka probleme të detektuara." });
  }, 1000);
});

app.post("/api/restart-cpe", requireAuth, async (req, res) => {
  console.log(`${colors.magenta}🔄 Restarting CPE...${colors.reset}`);
  setTimeout(() => {
    console.log(`${colors.green}✅ CPE restart completed${colors.reset}`);
    res.json({ ok: true, message: "CPE është restartuar me sukses" });
  }, 2000);
});

app.get("/api/invoices", requireAuth, async (req, res) => {
  try {
    const s = await readState();
    console.log(
      `${colors.blue}🧾 Fetched ${s.invoices.length} invoices${colors.reset}`
    );
    res.json({ invoices: s.invoices });
  } catch (error) {
    console.error(
      `${colors.red}❌ Error fetching invoices:${colors.reset}`,
      error
    );
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
});

app.post("/api/pay", requireAuth, async (req, res) => {
  const { invoiceId } = req.body || {};
  console.log(
    `${colors.green}💳 Payment initiated for invoice: ${invoiceId || "DEMO"}${
      colors.reset
    }`
  );
  res.json({
    url: `https://pay.abissnet.al/checkout?ref=ABISS-${invoiceId || "DEMO"}`,
    invoiceId,
  });
});

app.post("/api/upgrade", requireAuth, async (req, res) => {
  try {
    const { plan } = req.body || {};
    if (!plan) return res.status(400).json({ error: "missing plan" });

    const s = await readState();
    const oldPlan = s.overview.plan.name;
    s.overview.plan.name = plan;
    s.overview.plan.desc = `${plan} Mbps, kontratë 12M, IP dinamike`;
    await writeState(s);

    console.log(
      `${colors.green}⬆️  Plan upgraded: ${oldPlan} → ${plan}${colors.reset}`
    );
    res.json({ ok: true, message: "Plani u ndryshua me sukses" });
  } catch (error) {
    console.error(
      `${colors.red}❌ Error upgrading plan:${colors.reset}`,
      error
    );
    res.status(500).json({ error: "Failed to upgrade plan" });
  }
});

app.post("/api/add-tv", requireAuth, async (req, res) => {
  const { packageName } = req.body || {};
  console.log(
    `${colors.green}📺 TV package added: ${packageName || "Basic"}${
      colors.reset
    }`
  );
  res.json({
    ok: true,
    message: `Paketa TV "${packageName || "Basic"}" u shtua me sukses`,
  });
});

app.post("/api/speedtest", requireAuth, async (req, res) => {
  console.log(`${colors.magenta}⚡ Running speed test...${colors.reset}`);
  setTimeout(() => {
    const down = 270 + Math.floor(Math.random() * 30);
    const up = 270 + Math.floor(Math.random() * 30);
    const ping = 5 + Math.floor(Math.random() * 10);
    const jitter = 1 + Math.floor(Math.random() * 3);

    console.log(
      `${colors.green}✅ Speed test completed: ↓${down} Mbps ↑${up} Mbps (${ping}ms)${colors.reset}`
    );

    res.json({
      down,
      up,
      ping,
      jitter,
      timestamp: new Date().toISOString(),
    });
  }, 3000);
});

app.get("/api/tickets", requireAuth, async (req, res) => {
  try {
    const s = await readState();
    console.log(
      `${colors.blue}🎫 Fetched ${s.tickets.length} tickets${colors.reset}`
    );
    res.json({ tickets: s.tickets });
  } catch (error) {
    console.error(
      `${colors.red}❌ Error fetching tickets:${colors.reset}`,
      error
    );
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
});

app.post("/api/tickets", requireAuth, async (req, res) => {
  try {
    const { subject, category, message } = req.body || {};
    if (!subject || !category || !message) {
      return res.status(400).json({ error: "missing fields" });
    }

    const s = await readState();
    const id = String((s.tickets.at(-1)?.id || 1000) + 1);
    const ticket = {
      id,
      subject,
      category,
      message,
      status: "open",
      created_at: new Date().toISOString(),
    };

    s.tickets.push(ticket);
    await writeState(s);

    console.log(
      `${colors.green}✅ New ticket created: #${id} - ${subject} [${category}]${colors.reset}`
    );
    res.json({ ok: true, id, ticket });
  } catch (error) {
    console.error(
      `${colors.red}❌ Error creating ticket:${colors.reset}`,
      error
    );
    res.status(500).json({ error: "Failed to create ticket" });
  }
});

app.get("/api/public-ip", requireAuth, async (req, res) => {
  console.log(`${colors.blue}🌐 Public IP requested${colors.reset}`);
  res.json({
    ip: "185.99.99.99",
    isp: "Abissnet",
    location: "Tirana, Albania",
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 404 handler for API routes
app.use("/api/*", (req, res) => {
  console.log(
    `${colors.yellow}⚠️  Unknown API endpoint: ${req.path}${colors.reset}`
  );
  res.status(404).json({ error: "endpoint not found" });
});

// Fallback to index.html for client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

// ============ START SERVER ============

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log("");
  console.log(
    `${colors.bright}${colors.green}✅ Abissnet Backend Started!${colors.reset}`
  );
  console.log(
    `${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`
  );
  console.log(
    `${colors.bright}🌐 Frontend:${colors.reset}  http://localhost:${port}`
  );
  console.log(
    `${colors.bright}📊 API:${colors.reset}       http://localhost:${port}/api/*`
  );
  console.log(`${colors.bright}📁 Data:${colors.reset}      ${DATA}`);
  console.log(
    `${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`
  );
  console.log(`${colors.bright}📌 Login credentials:${colors.reset}`);
  console.log(`   ${colors.dim}Email:${colors.reset}    demo@abissnet.al`);
  console.log(`   ${colors.dim}Password:${colors.reset} demo123`);
  console.log(
    `${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`
  );
  console.log(`${colors.bright}💡 API Endpoints:${colors.reset}`);
  console.log(`   ${colors.green}POST${colors.reset} /api/login`);
  console.log(`   ${colors.blue}GET${colors.reset}  /api/overview`);
  console.log(`   ${colors.blue}GET${colors.reset}  /api/devices`);
  console.log(`   ${colors.blue}GET${colors.reset}  /api/invoices`);
  console.log(`   ${colors.blue}GET${colors.reset}  /api/tickets`);
  console.log(`   ${colors.green}POST${colors.reset} /api/speedtest`);
  console.log(`   ${colors.green}POST${colors.reset} /api/upgrade`);
  console.log(`   ${colors.blue}GET${colors.reset}  /api/health`);
  console.log(
    `${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`
  );
  console.log(
    `${colors.dim}Server ready and listening for requests...${colors.reset}`
  );
  console.log("");
});

// ============ HELPER FUNCTIONS ============

async function ensureData() {
  const dataDir = path.dirname(DATA);
  if (!fs.existsSync(dataDir)) {
    await fsp.mkdir(dataDir, { recursive: true });
    console.log(`${colors.green}✅ Created data directory${colors.reset}`);
  }

  if (!fs.existsSync(DATA)) {
    const init = {
      overview: {
        service: {
          status: "active",
          note: "Shërbimi aktiv pa alarme.",
        },
        billing: {
          cycle: "Mujor",
          last_invoice: "3,200 ALL",
          due_date: "10/11/2025",
          balance: "0 ALL",
        },
        plan: {
          name: "Fiber 300",
          desc: "300/300 Mbps, kontratë 12M, IP dinamike",
        },
      },
      devices: [
        {
          title: "ONT/Modem",
          model: "ZTE F660",
          mac: "AC:12:34:56:78:9A",
          ip: "192.168.1.1",
          status: "Online",
        },
        {
          title: "STB",
          model: "MAG 520",
          mac: "B0:AA:BC:DE:F0:11",
          ip: "192.168.1.50",
          status: "Online",
        },
        {
          title: "Mesh AP",
          model: "TP-Link X20",
          mac: "10:22:33:44:55:66",
          ip: "192.168.1.3",
          status: "Offline",
        },
      ],
      invoices: [
        { date: "10/10/2025", amount: "3,200", status: "Paguar" },
        { date: "10/09/2025", amount: "3,200", status: "Paguar" },
        { date: "10/08/2025", amount: "3,200", status: "Paguar" },
      ],
      tickets: [],
    };
    await fsp.writeFile(DATA, JSON.stringify(init, null, 2), "utf-8");
    console.log(`${colors.green}✅ Created initial data file${colors.reset}`);
  }
}

async function readState() {
  const raw = await fsp.readFile(DATA, "utf-8");
  return JSON.parse(raw);
}

async function writeState(s) {
  await fsp.writeFile(DATA, JSON.stringify(s, null, 2), "utf-8");
}
