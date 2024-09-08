const { spawn, exec } = require("child_process");
const axios = require("axios");
const express = require('express');
const path = require('path');
const logger = require("./utils/log");

const app = express();
const port = process.env.PORT || 8080;

const validApiKey = 'pubghate'; 

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint to download data.sqlite file with API key check
app.get('/sqlite', function(req, res) {
  const apiKey = req.query.apikey;

  if (apiKey !== validApiKey) {
    return res.status(403).send('Forbidden: Invalid API key');
  }

  const filePath = path.join(__dirname, 'includes/data.sqlite');
  res.download(filePath, 'data.sqlite', (err) => {
    if (err) {
      console.error("File download error:", err);
      res.status(500).send("Error downloading file.");
    }
  });
});

app.listen(port);
logger("Opened server site...", "[ Starting ]");
function startBot(message) {
    if (message) logger(message, "[ Starting ]");

    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "Priyansh.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    child.on("close", (codeExit) => {
        if (codeExit !== 0 || (global.countRestart && global.countRestart < 5)) {
            startBot("Restarting...");
            global.countRestart += 1;
        }
    });

    child.on("error", function (error) {
        logger("An error occurred: " + JSON.stringify(error), "[ Starting ]");
    });
}

startBot();
