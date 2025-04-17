const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  win.loadURL('http://localhost:5173');
}

app.whenReady().then(createWindow);

ipcMain.handle('open-json-file', async () => {
  const result = await dialog.showOpenDialog({
    filters: [{ name: 'JSON', extensions: ['json'] }],
    properties: ['openFile'],
  });
  if (result.canceled) return null;
  return result.filePaths[0];
});

ipcMain.handle('load-config-chain', async (_event, filePath) => {
  const chain = [];
  let currentPath = filePath;

  while (currentPath) {
    const data = JSON.parse(fs.readFileSync(currentPath, 'utf-8'));
    chain.unshift({ file: path.basename(currentPath), data }); // inserisce all'inizio

    if (!data.inherits) break;

    const parentName = data.inherits + '.json';
    const parentPath = path.resolve(path.dirname(currentPath), parentName);
    if (!fs.existsSync(parentPath)) break;

    currentPath = parentPath;
  }

  return chain;
});
