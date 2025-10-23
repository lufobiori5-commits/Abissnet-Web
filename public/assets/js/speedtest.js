// ========================================
// SPEED TEST CONFIGURATION
// ========================================
const CONFIG = {
  downloadSizes: [1, 5, 10, 25], // MB
  uploadSize: 5, // MB
  pingAttempts: 5,
  testTimeout: 30000, // 30 seconds
};

// ========================================
// STATE MANAGEMENT
// ========================================
let testHistory = [];
let currentTest = null;
let testAborted = false;

// ========================================
// DOM ELEMENTS
// ========================================
const elements = {
  downMbps: document.getElementById("downMbps"),
  upMbps: document.getElementById("upMbps"),
  pingSpeed: document.getElementById("pingSpeed"),
  downloadMetric: document.getElementById("downloadMetric"),
  uploadMetric: document.getElementById("uploadMetric"),
  pingMetric: document.getElementById("pingMetric"),
  btnSpeedTest: document.getElementById("btnSpeedTest"),
  progressContainer: document.getElementById("progressContainer"),
  progressFill: document.getElementById("progressFill"),
  progressText: document.getElementById("progressText"),
  additionalStats: document.getElementById("additionalStats"),
  jitterValue: document.getElementById("jitterValue"),
  packetLoss: document.getElementById("packetLoss"),
  testDuration: document.getElementById("testDuration"),
  connectionInfo: document.getElementById("connectionInfo"),
  ipAddress: document.getElementById("ipAddress"),
  isp: document.getElementById("isp"),
  location: document.getElementById("location"),
  connectionType: document.getElementById("connectionType"),
  historySection: document.getElementById("historySection"),
  historyList: document.getElementById("historyList"),
};

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener("DOMContentLoaded", () => {
  elements.btnSpeedTest.addEventListener("click", startSpeedTest);
  detectConnectionInfo();
});

// ========================================
// SPEED TEST LOGIC
// ========================================
async function startSpeedTest() {
  if (currentTest) {
    testAborted = true;
    return;
  }

  testAborted = false;
  resetUI();
  showProgress();
  disableButton(true);

  const startTime = Date.now();
  currentTest = {
    download: 0,
    upload: 0,
    ping: 0,
    jitter: 0,
    packetLoss: 0,
    startTime: new Date().toISOString(),
  };

  try {
    // Step 1: Measure Ping & Jitter
    updateProgress(10, "Duke matur ping-un...");
    const pingResults = await measurePing();
    currentTest.ping = pingResults.avg;
    currentTest.jitter = pingResults.jitter;
    currentTest.packetLoss = pingResults.packetLoss;
    elements.pingSpeed.textContent = currentTest.ping.toFixed(0);
    elements.pingMetric.classList.add("active");

    if (testAborted) throw new Error("Test u ndërpre");

    // Step 2: Measure Download Speed
    updateProgress(40, "Duke matur shpejtësinë e shkarkimit...");
    currentTest.download = await measureDownload();
    elements.downMbps.textContent = currentTest.download.toFixed(1);
    elements.downloadMetric.classList.add("active");
    elements.pingMetric.classList.remove("active");

    if (testAborted) throw new Error("Test u ndërpre");

    // Step 3: Measure Upload Speed
    updateProgress(70, "Duke matur shpejtësinë e ngarkimit...");
    currentTest.upload = await measureUpload();
    elements.upMbps.textContent = currentTest.upload.toFixed(1);
    elements.uploadMetric.classList.add("active");
    elements.downloadMetric.classList.remove("active");

    // Step 4: Complete
    updateProgress(100, "Testi u përfundua!");

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    currentTest.duration = duration;

    // Update stats
    elements.additionalStats.style.display = "block";
    elements.jitterValue.textContent = currentTest.jitter.toFixed(1) + " ms";
    elements.packetLoss.textContent = currentTest.packetLoss.toFixed(1) + "%";
    elements.testDuration.textContent = duration + "s";

    // Show connection info
    elements.connectionInfo.style.display = "block";

    // Add to history
    addToHistory(currentTest);

    // Show success message using toast if available
    if (typeof showToast === "function") {
      showToast("✓ Testi u përfundua me sukses!", "success");
    }

    setTimeout(() => {
      hideProgress();
      elements.uploadMetric.classList.remove("active");
    }, 1000);
  } catch (error) {
    console.error("Speed test error:", error);
    if (typeof showToast === "function") {
      showToast(
        error.message || "✗ Testi dështoi. Ju lutem provoni përsëri.",
        "error"
      );
    }
    hideProgress();
  } finally {
    currentTest = null;
    disableButton(false);
  }
}

// ========================================
// PING MEASUREMENT
// ========================================
async function measurePing() {
  const pings = [];
  const startUrl = "https://www.cloudflare.com/cdn-cgi/trace";

  for (let i = 0; i < CONFIG.pingAttempts; i++) {
    try {
      const start = performance.now();
      await fetch(startUrl, {
        method: "HEAD",
        cache: "no-cache",
        mode: "no-cors",
      });
      const end = performance.now();
      pings.push(end - start);
    } catch (e) {
      // Packet lost
    }

    if (testAborted) break;
    await sleep(100);
  }

  const avgPing =
    pings.length > 0 ? pings.reduce((a, b) => a + b, 0) / pings.length : 0;

  const jitter = pings.length > 1 ? calculateStdDev(pings) : 0;

  const packetLoss =
    ((CONFIG.pingAttempts - pings.length) / CONFIG.pingAttempts) * 100;

  return {
    avg: avgPing,
    jitter: jitter,
    packetLoss: packetLoss,
  };
}

// ========================================
// DOWNLOAD SPEED MEASUREMENT
// ========================================
async function measureDownload() {
  const measurements = [];

  const testSize = 10 * 1024 * 1024; // 10 MB
  const testUrl = `https://speed.cloudflare.com/__down?bytes=${testSize}`;

  for (let i = 0; i < 3; i++) {
    if (testAborted) break;

    const start = performance.now();

    try {
      const response = await fetch(testUrl, {
        cache: "no-cache",
      });

      const reader = response.body.getReader();
      let receivedLength = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        receivedLength += value.length;
      }

      const end = performance.now();
      const durationSeconds = (end - start) / 1000;
      const speedMbps = (receivedLength * 8) / (durationSeconds * 1000000);

      measurements.push(speedMbps);
    } catch (e) {
      console.error("Download measurement failed:", e);
    }
  }

  return measurements.length > 0
    ? measurements.reduce((a, b) => a + b, 0) / measurements.length
    : 0;
}

// ========================================
// UPLOAD SPEED MEASUREMENT
// ========================================
async function measureUpload() {
  const measurements = [];

  const uploadSize = 5 * 1024 * 1024; // 5 MB
  const data = new ArrayBuffer(uploadSize);
  const testUrl = "https://speed.cloudflare.com/__up";

  for (let i = 0; i < 2; i++) {
    if (testAborted) break;

    const start = performance.now();

    try {
      await fetch(testUrl, {
        method: "POST",
        body: data,
        cache: "no-cache",
      });

      const end = performance.now();
      const durationSeconds = (end - start) / 1000;
      const speedMbps = (uploadSize * 8) / (durationSeconds * 1000000);

      measurements.push(speedMbps);
    } catch (e) {
      console.error("Upload measurement failed:", e);
    }
  }

  return measurements.length > 0
    ? measurements.reduce((a, b) => a + b, 0) / measurements.length
    : 0;
}

// ========================================
// CONNECTION INFO DETECTION
// ========================================
async function detectConnectionInfo() {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();

    elements.ipAddress.textContent = data.ip || "—";
    elements.isp.textContent = data.org || "—";
    elements.location.textContent =
      `${data.city || ""}, ${data.country_name || ""}`.trim() || "—";

    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;
    if (connection) {
      elements.connectionType.textContent =
        connection.effectiveType || connection.type || "—";
    } else {
      elements.connectionType.textContent = "E panjohur";
    }
  } catch (e) {
    console.error("Failed to detect connection info:", e);
  }
}

// ========================================
// HISTORY MANAGEMENT
// ========================================
function addToHistory(test) {
  testHistory.unshift({
    ...test,
    timestamp: new Date().toLocaleString("sq-AL", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
  });

  if (testHistory.length > 5) {
    testHistory.pop();
  }

  renderHistory();
}

function renderHistory() {
  if (testHistory.length === 0) {
    elements.historySection.style.display = "none";
    return;
  }

  elements.historySection.style.display = "block";
  elements.historyList.innerHTML = testHistory
    .map(
      (test) => `
    <div class="history-item">
      <div class="history-time">${test.timestamp}</div>
      <div class="history-speeds">
        <div>
          <span style="color: #6b7280;">↓</span>
          <span class="history-speed">${test.download.toFixed(1)} Mbps</span>
        </div>
        <div>
          <span style="color: #6b7280;">↑</span>
          <span class="history-speed">${test.upload.toFixed(1)} Mbps</span>
        </div>
        <div>
          <span style="color: #6b7280;">Ping:</span>
          <span class="history-speed">${test.ping.toFixed(0)} ms</span>
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

// ========================================
// UI HELPERS
// ========================================
function resetUI() {
  elements.downMbps.textContent = "—";
  elements.upMbps.textContent = "—";
  elements.pingSpeed.textContent = "—";
  elements.downloadMetric.classList.remove("active");
  elements.uploadMetric.classList.remove("active");
  elements.pingMetric.classList.remove("active");
  elements.additionalStats.style.display = "none";
}

function showProgress() {
  elements.progressContainer.style.display = "block";
}

function hideProgress() {
  elements.progressContainer.style.display = "none";
  elements.progressFill.style.width = "0%";
}

function updateProgress(percent, text) {
  elements.progressFill.style.width = percent + "%";
  elements.progressText.textContent = text;
}

function disableButton(disabled) {
  elements.btnSpeedTest.disabled = disabled;
  if (disabled) {
    elements.btnSpeedTest.classList.add("loading");
    elements.btnSpeedTest.textContent = "Duke testuar...";
  } else {
    elements.btnSpeedTest.classList.remove("loading");
    elements.btnSpeedTest.textContent = "Fillo Testin";
  }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function calculateStdDev(values) {
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const squareDiffs = values.map((value) => Math.pow(value - avg, 2));
  const avgSquareDiff =
    squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
  return Math.sqrt(avgSquareDiff);
}

// ========================================
// INITIALIZATION COMPLETE
// ========================================
console.log("🚀 Enhanced Speed Test initialized with existing theme!");
