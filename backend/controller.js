const { ipcMain } = require("electron");
const fs = require("fs");
const path = require('path')

let allSpells = [];

ipcMain.on("get-spells", (event, arg) => {
  fs.readFile(path.join(__dirname, '..', 'data', 'spells.json'), (err, data) => {
    if (err) {
      console.error(err);
    } else {
        allSpells = JSON.parse(data)
    }
    event.reply('get-spells-reply', allSpells)
  });
});