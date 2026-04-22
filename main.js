const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
const dataPath = path.join(__dirname, 'data', 'userProgress.json');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    backgroundColor: '#8cff8c'
  });
  mainWindow.loadFile('assets/index.html');
  mainWindow.setMenuBarVisibility(false);
}

app.whenReady().then(() => {
  createWindow();
  setupDataHandlers();
});

function setupDataHandlers() {
  if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
  }

  ipcMain.handle('load-game-data', () => {
    try {
      if (fs.existsSync(dataPath)) {
        return JSON.parse(fs.readFileSync(dataPath));
      } else {
        const defaultData = {
          user: {
            username: 'Jardinero',
            level: 1,
            xp: 0,
            xpForNext: 100,
            dailyPoints: 0,
            lastDailyReset: new Date().toDateString(),
            dailyStreak: 0,
            achievements: []
          },
          catalog: [
            { id: 1, name: 'Lirio de los Valles', light: 'Sombra parcial', difficulty: 'Baja', waterNeeds: 'Moderado', icon: '🌸', unlocked: true },
            { id: 2, name: 'Suculenta Echeveria', light: 'Luz brillante', difficulty: 'Baja', waterNeeds: 'Bajo', icon: '🌵', unlocked: true },
            { id: 3, name: 'Helecho Nido', light: 'Sombra', difficulty: 'Media', waterNeeds: 'Alto', icon: '🌿', unlocked: false, unlockLevel: 3 },
            { id: 4, name: 'Monstera', light: 'Luz indirecta', difficulty: 'Media', waterNeeds: 'Moderado', icon: '🍃', unlocked: false, unlockLevel: 3 }
          ],
          plants: []
        };
        fs.writeFileSync(dataPath, JSON.stringify(defaultData, null, 2));
        return defaultData;
      }
    } catch (err) {
      console.error(err);
      return null;
    }
  });

  ipcMain.handle('save-game-data', (event, data) => {
    try {
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  });

  ipcMain.handle('send-notification', (event, titulo, cuerpo, silent = false) => {
    if (Notification.isSupported()) {
      const notif = new Notification({
        title: titulo,
        body: cuerpo,
        icon: path.join(__dirname, 'assets/images/damaris.png'),
        silent: silent,
      });
      notif.show();
      return true;
    }
    return false;
  });
}