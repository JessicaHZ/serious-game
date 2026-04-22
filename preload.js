const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  loadGameData: () => ipcRenderer.invoke('load-game-data'),
  saveGameData: (data) => ipcRenderer.invoke('save-game-data', data),
  sendNotification: (titulo, cuerpo, silent) => ipcRenderer.invoke('send-notification', titulo, cuerpo, silent)
});