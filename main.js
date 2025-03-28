const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // Permette di usare Node.js nel renderer
      contextIsolation: false,
    },
  });

  mainWindow.loadFile("index.html");
});

// Selezione file JSON
ipcMain.handle("select-file", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openFile"],
    filters: [{ name: "JSON", extensions: ["json"] }],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

// Legge e processa il file JSON e i parent
ipcMain.handle("load-json", async (event, filePath) => {
  if (!filePath) return null;

  const folderPath = path.dirname(filePath);
  return loadHierarchy(filePath, folderPath);
});

function loadHierarchy(filePath, folderPath, parentData = []) {
  if (!fs.existsSync(filePath)) return parentData;

  const rawData = fs.readFileSync(filePath);
  const jsonData = JSON.parse(rawData);

  if (jsonData.parent) {
    const parentPath = path.join(folderPath, jsonData.parent);
    return loadHierarchy(parentPath, folderPath, [jsonData, ...parentData]);
  }

  return [jsonData, ...parentData];
}
