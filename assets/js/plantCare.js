// plantCare.js
function waterPlant(plant) {
  const now = Date.now();
  const hoursSinceWater = (now - (plant.lastWatered || 0)) / (1000 * 3600);
  let xpGain = 0;
  let message = '';
  if (plant.water < 30) {
    plant.water = Math.min(100, plant.water + 40);
    xpGain = 15;
    message = '💧 La planta estaba sedienta, reaccionó muy bien. +15 XP';
  } else if (plant.water > 80) {
    plant.water = Math.min(100, plant.water + 20);
    xpGain = 5;
    message = '⚠️ Riego excesivo, puede dañar la planta. +5 XP';
  } else {
    plant.water = Math.min(100, plant.water + 30);
    xpGain = 10;
    message = '✅ Riego adecuado. +10 XP';
  }
  plant.lastWatered = now;
  addXP(xpGain);
  updatePlantHealthFromWater(plant);
  saveGame();
  showTemporaryMessage(message, '#8fc98f');
  renderUserPlants(); // refrescar vista
}

function fertilizePlant(plant) {
  if (plant.lastFertilized && (Date.now() - plant.lastFertilized) < 2 * 24 * 3600 * 1000) {
    showTemporaryMessage('🌱 Ya abonaste esta planta recientemente, espera 2 días.', '#e0a800');
    return;
  }
  plant.health = Math.min(100, plant.health + 25);
  plant.lastFertilized = Date.now();
  addXP(20);
  showTemporaryMessage('🌿 Abono aplicado, la planta luce más fuerte. +20 XP', '#6fbf4c');
  saveGame();
  renderUserPlants();
}

function prunePlant(plant) {
  if (window.startPruningMinigame) {
    window.startPruningMinigame(plant);
  } else {
    showTemporaryMessage('Minijuego de poda no disponible aún', 'red');
  }
}

function repotPlant(plant) {
  plant.health = Math.min(100, plant.health + 10);
  addXP(15);
  showTemporaryMessage('🪴 Maceta cambiada, más espacio para crecer. +15 XP', '#8bc34a');
  saveGame();
  renderUserPlants();
}

function updatePlantHealthFromWater(plant) {
  // Si la humedad es muy baja o muy alta, afecta la salud
  if (plant.water < 20) plant.health = Math.max(0, plant.health - 10);
  else if (plant.water > 90) plant.health = Math.max(0, plant.health - 5);
  else plant.health = Math.min(100, plant.health + 5);
}