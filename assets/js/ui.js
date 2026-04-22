// ui.js
function updateUIFromState() {
  const user = window.gameState.user;
  document.getElementById('username').innerText = user.username;
  document.getElementById('level').innerText = user.level;
  const xpPercent = (user.xp / user.xpForNext) * 100;
  document.getElementById('xpBar').style.width = `${xpPercent}%`;
  document.getElementById('xpText').innerText = `${user.xp} / ${user.xpForNext} XP`;
  document.getElementById('streak').innerText = user.dailyStreak;
  document.getElementById('dailyPoints').innerText = user.dailyPoints;
  renderCatalog();
  renderUserPlants();
  renderAchievements();
}

function renderCatalog() {
  const container = document.getElementById('plantCatalog');
  if (!container) return;
  container.innerHTML = '';
  window.gameState.plantsCatalog.forEach(plant => {
    const card = document.createElement('div');
    card.className = 'plant-card';
    card.innerHTML = `
      <div class="plant-icon">${plant.icon}</div>
      <div class="plant-name">${plant.name}</div>
      <div class="difficulty">${plant.difficulty} · ${plant.light}</div>
      ${plant.unlocked ? `<button class="buy-btn" data-id="${plant.id}">Comprar</button>` : '<span style="color:gray">🔒 Nivel ' + plant.unlockLevel + '</span>'}
    `;
    if (plant.unlocked) {
      const btn = card.querySelector('.buy-btn');
      btn.addEventListener('click', () => buyPlant(plant));
    }
    container.appendChild(card);
  });
}

async function buyPlant(plant) {
  const userPlants = window.gameState.db.plants || [];
  if (userPlants.some(p => p.id === plant.id)) {
    showTemporaryMessage('Ya tienes esta planta.', '#c97e5a');
    return;
  }
  const newPlant = {
    id: plant.id,
    name: plant.name,
    type: plant.difficulty.toLowerCase(),
    health: 80,
    water: 60,
    lastWatered: Date.now(),
    lastFertilized: 0,
    state: 'normal'
  };
  window.gameState.db.plants.push(newPlant);
  saveGame();
  showTemporaryMessage(`¡${plant.name} añadida a tu casa!`, '#6a9e6a');
  renderUserPlants();
  // Cambiar al panel de casa automáticamente
  document.getElementById('navCasa').click();
}

function renderUserPlants() {
  const grid = document.getElementById('plantsGrid');
  if (!grid) return;
  const plants = window.gameState.db.plants || [];
  if (plants.length === 0) {
    grid.innerHTML = '<p>No tienes plantas. Ve al vivero y compra algunas.</p>';
    return;
  }
  grid.innerHTML = '';
  plants.forEach(plant => {
    const plantDiv = document.createElement('div');
    plantDiv.className = 'plant-card';
    plantDiv.setAttribute('data-id', plant.id);
    let healthColor = plant.health > 70 ? '#8bc34a' : (plant.health > 30 ? '#ffb74d' : '#e57373');
    plantDiv.innerHTML = `
      <div class="plant-icon">${plant.state === 'decayed' ? '🥀' : (plant.state === 'yellowing' ? '🌻' : '🌿')}</div>
      <div class="plant-name">${plant.name}</div>
      <div>❤️ Salud: <progress value="${plant.health}" max="100"></progress></div>
      <div>💧 Humedad: <progress value="${plant.water}" max="100"></progress></div>
      <button class="select-plant-btn" data-id="${plant.id}">Cuidar</button>
    `;
    const selectBtn = plantDiv.querySelector('.select-plant-btn');
    selectBtn.addEventListener('click', () => {
      window.gameState.activePlantId = plant.id;
      document.getElementById('selectedPlantName').innerText = plant.name;
      document.getElementById('plantActions').style.display = 'block';
    });
    grid.appendChild(plantDiv);
  });
}

function renderAchievements() {
  const container = document.getElementById('achievementsList');
  if (container) {
    container.innerHTML = (window.gameState.user.achievements || []).map(ach => `<div class="achievement">🏅 ${ach}</div>`).join('');
  }
}