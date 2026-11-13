const fs = require("fs");
const path = require("path");

const logDir = path.join(__dirname, "..", "..", "logs");
const logFile = path.join(logDir, "requests.log");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Logs the method, endpoint and timestamp of every request to the console and a log file
function logger(req, res, next) {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${req.method} ${req.originalUrl}`;

  console.log(line);
  fs.appendFile(logFile, line + "\n", (err) => {
    if (err) console.error("Could not write to log file:", err.message);
  });

  next();
}

module.exports = logger;
