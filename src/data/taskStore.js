const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, 'tasks.json');

function readAll() {
  try {
    return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  } catch (err) {
    return [];
  }
}

function writeAll(tasks) {
  fs.writeFileSync(dataFile, JSON.stringify(tasks, null, 2), 'utf8');
}

module.exports = { readAll, writeAll };