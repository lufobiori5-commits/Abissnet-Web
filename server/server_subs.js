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
app.use(cors());
app.use(express.json());

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
  if (!tokenOK(req)) return res.status(401).json({ error: "unauthorized" });
  next();
}

// ============ API ROUTES ============

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (email === "demo@abissnet.al" && password === "demo123") {
    return res.json({ token: "demo-token" });
  }
  res.status(401).json({ error: "invalid" });
});

app.get("/api/overview", requireAuth, async (req, res) => {
  const s = await readState();
  res.json(s.overview);
});

app.get("/api/devices", requireAuth, async (req, res) => {
  const s = await readState();
  res.json({ devices: s.devices });
});

app.post("/api/line-test", requireAuth, async (req, res) => {
  res.json({ ok: true, note: "S'ka probleme të detektuara." });
});

app.post("/api/restart-cpe", requireAuth, async (req, res) => {
  res.json({ ok: true });
});

app.get("/api/invoices", requireAuth, async (req, res) => {
  const s = await readState();
  res.json({ invoices: s.invoices });
});

app.post("/api/pay", requireAuth, async (req, res) => {
  res.json({ url: "https://example.com/pay/checkout?ref=ABISS-DEMO" });
});

app.post("/api/upgrade", requireAuth, async (req, res) => {
  const { plan } = req.body || {};
  if (!plan) return res.status(400).json({ error: "missing plan" });
  const s = await readState();
  s.overview.plan.name = plan;
  s.overview.plan.desc = plan + " Mbps, kontratë 12M, IP dinamike";
  await writeState(s);
  res.json({ ok: true });
});

app.post("/api/add-tv", requireAuth, async (req, res) => {
  res.json({ ok: true });
});

app.post("/api/speedtest", requireAuth, async (req, res) => {
  const down = 270 + Math.floor(Math.random() * 30);
  const up = 270 + Math.floor(Math.random() * 30);
  res.json({ down, up });
});

app.get("/api/tickets", requireAuth, async (req, res) => {
  const s = await readState();
  res.json({ tickets: s.tickets });
});

app.post("/api/tickets", requireAuth, async (req, res) => {
  const { subject, category, message } = req.body || {};
  if (!subject || !category || !message) {
    return res.status(400).json({ error: "missing fields" });
  }
  const s = await readState();
  const id = String((s.tickets.at(-1)?.id || 1000) + 1);
  s.tickets.push({
    id,
    subject,
    category,
    message,
    status: "open",
    created_at: new Date().toISOString(),
  });
  await writeState(s);
  res.json({ ok: true, id });
});

app.get("/api/public-ip", requireAuth, async (req, res) => {
  res.json({ ip: "185.99.99.99" });
});

// ============ START SERVER ============

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log("");
  console.log("✅ Abissnet Backend Started!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`🌐 Frontend:  http://localhost:${port}`);
  console.log(`📊 API:       http://localhost:${port}/api/*`);
  console.log(`📁 Data:      ${DATA}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📌 Login credentials:");
  console.log("   Email:    demo@abissnet.al");
  console.log("   Password: demo123");
  console.log("");
});

// ============ HELPER FUNCTIONS ============

async function ensureData() {
  // Create data directory if missing
  const dataDir = path.dirname(DATA);
  if (!fs.existsSync(dataDir)) {
    await fsp.mkdir(dataDir, { recursive: true });
  }

  // Create initial data file if missing
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
      ],
      tickets: [],
    };
    await fsp.writeFile(DATA, JSON.stringify(init, null, 2), "utf-8");
    console.log("✅ Created initial data file");
  }
}

async function readState() {
  const raw = await fsp.readFile(DATA, "utf-8");
  return JSON.parse(raw);
}

async function writeState(s) {
  await fsp.writeFile(DATA, JSON.stringify(s, null, 2), "utf-8");
}
