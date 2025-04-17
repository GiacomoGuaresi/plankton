const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  openJsonFile: () => ipcRenderer.invoke('open-json-file'),
  loadConfigChain: (filePath) => ipcRenderer.invoke('load-config-chain', filePath),
});