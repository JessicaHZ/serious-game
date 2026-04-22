// gameState.js
window.gameState = {
  user: null,
  plantsCatalog: [],
  activePlantId: null,
  db: null  // guardaremos la base de datos completa aquí
};

// Cargar datos desde el archivo JSON (usando la API de Electron)
async function loadGame() {
  const data = await window.electronAPI.loadGameData();
  if (data) {
    window.gameState.user = data.user;
    window.gameState.plantsCatalog = data.catalog;
    window.gameState.db = data;
    updateUIFromState();
    notifyListeners();
    return true;
  } else {
    // Crear datos por defecto si no existen
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
      plants: []  // plantas del usuario
    };
    await window.electronAPI.saveGameData(defaultData);
    window.gameState.user = defaultData.user;
    window.gameState.plantsCatalog = defaultData.catalog;
    window.gameState.db = defaultData;
    updateUIFromState();
    return true;
  }
}

function saveGame() {
  if (window.gameState.db) {
    window.electronAPI.saveGameData(window.gameState.db);
  }
}

function addXP(amount) {
  let user = window.gameState.user;
  let today = new Date().toDateString();
  if (user.lastDailyReset !== today) {
    user.dailyPoints = 0;
    user.lastDailyReset = today;
  }
  let possibleGain = Math.min(amount, 50 - user.dailyPoints);
  if (possibleGain <= 0) {
    showTemporaryMessage('Límite diario de 50 XP alcanzado', '#c97e5a');
    return;
  }
  user.xp += possibleGain;
  user.dailyPoints += possibleGain;
  while (user.xp >= user.xpForNext) {
    user.xp -= user.xpForNext;
    user.level++;
    user.xpForNext = Math.floor(user.xpForNext * 1.2);
    showTemporaryMessage(`🎉 ¡Subiste a nivel ${user.level}!`, '#6a9e6a');
    // Desbloquear plantas
    window.gameState.plantsCatalog.forEach(plant => {
      if (!plant.unlocked && plant.unlockLevel && user.level >= plant.unlockLevel) {
        plant.unlocked = true;
        showTemporaryMessage(`🌱 Nueva planta disponible: ${plant.name}`, '#88b388');
      }
    });
  }
  saveGame();
  updateUIFromState();
  notifyListeners();
}

function subtractXP(amount) {
  let user = window.gameState.user;
  user.xp = Math.max(0, user.xp - amount);
  saveGame();
  updateUIFromState();
  notifyListeners();
  showTemporaryMessage(`❌ Has perdido ${amount} XP`, '#c97e5a');
}

function showTemporaryMessage(msg, bgColor) {
  const activePanel = document.querySelector('.game-panel:not(.hidden) .message-area');
  if (activePanel) {
    activePanel.innerHTML = `<span style="background:${bgColor}; padding:5px; display:inline-block;">${msg}</span>`;
    setTimeout(() => activePanel.innerHTML = '', 3000);
  }
}

function notifyListeners() {
  // Para actualizar UI si hay listeners
}