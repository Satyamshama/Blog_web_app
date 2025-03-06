const fs = require("fs").promises;

async function readData(filePath) {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
}

async function writeData(filePath, data) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

module.exports = { readData, writeData }