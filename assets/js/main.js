// main.js del renderer
document.addEventListener('DOMContentLoaded', async () => {
  await loadGame();

  // Navegación entre paneles
  const navVivero = document.getElementById('navVivero');
  const navCasa = document.getElementById('navCasa');
  const navMinijuegos = document.getElementById('navMinijuegos');
  const navLogros = document.getElementById('navLogros');

  const viveroPanel = document.getElementById('viveroPanel');
  const casaPanel = document.getElementById('casaPanel');
  const minijuegosPanel = document.getElementById('minijuegosPanel');
  const logrosPanel = document.getElementById('logrosPanel');

  function showPanel(panel) {
    // Ocultar todos
    viveroPanel.classList.add('hidden');
    casaPanel.classList.add('hidden');
    minijuegosPanel.classList.add('hidden');
    logrosPanel.classList.add('hidden');
    //Mostrar el seleccionado
    panel.classList.remove('hidden');
    
    // Actualizar clase activa en botones
    [navVivero, navCasa, navMinijuegos, navLogros].forEach(btn => btn.classList.remove('active'));
    if (panel === viveroPanel) navVivero.classList.add('active');
    if (panel === casaPanel) navCasa.classList.add('active');
    if (panel === minijuegosPanel) navMinijuegos.classList.add('active');
    if (panel === logrosPanel) navLogros.classList.add('active');

    
    if (panel === casaPanel) renderUserPlants();
    if (panel === logrosPanel) renderAchievements();
  }

  navVivero.addEventListener('click', () => showPanel(viveroPanel));
  navCasa.addEventListener('click', () => showPanel(casaPanel));
  navMinijuegos.addEventListener('click', () => showPanel(minijuegosPanel));
  navLogros.addEventListener('click', () => showPanel(logrosPanel));

  // Acciones de cuidado (delegación de eventos)
  document.getElementById('plantActions').addEventListener('click', (e) => {
    const action = e.target.dataset.action;
    const activeId = window.gameState.activePlantId;
    const plant = window.gameState.db.plants.find(p => p.id === activeId);
    if (!plant) return;
    if (action === 'water') waterPlant(plant);
    if (action === 'fertilize') fertilizePlant(plant);
    if (action === 'prune') prunePlant(plant);
    if (action === 'repot') repotPlant(plant);
  });

  // Minijuegos
  document.getElementById('gamePrune').addEventListener('click', () => {
    const activeId = window.gameState.activePlantId;
    const plant = window.gameState.db.plants.find(p => p.id === activeId);
    if (plant) {
      window.startPruningMinigame(plant);
    } else {
      showTemporaryMessage('Selecciona una planta en Mi Casa primero', '#c97e5a');
    }
  });
  document.getElementById('gamePests').addEventListener('click', startPestsMinigame);
  document.getElementById('gameQuiz').addEventListener('click', startQuizMinigame);

  // Colocación en habitaciones (efecto de luz)
  document.querySelectorAll('.room').forEach(room => {
    room.addEventListener('click', async (e) => {
      const roomType = e.currentTarget.dataset.room;
      const activeId = window.gameState.activePlantId;
      const plant = window.gameState.db.plants.find(p => p.id === activeId);
      if (plant) {
        let lightEffect = 0;
        if (roomType === 'jardin') lightEffect = 20;
        else if (roomType === 'sala') lightEffect = 5;
        else lightEffect = -10;
        plant.health = Math.min(100, Math.max(0, plant.health + lightEffect));
        saveGame();
        showTemporaryMessage(`Planta movida a ${roomType}. Salud ${lightEffect>0 ? 'mejora' : 'empeora'}.`, '#aad6a0');
        renderUserPlants();
      } else {
        showTemporaryMessage('Selecciona una planta primero', '#c97e5a');
      }
    });
  });
  
  /*document.getElementById('acelerarBtn').addEventListener('click', () => {
    avanzarTiempo(8); // Avanza 8 horas
    }); */
    
    const acelBtn = document.getElementById('acelerarBtn');
    if (acelBtn) {
        acelBtn.addEventListener('click', () => {
            if (window.avanzarTiempo) {
                window.avanzarTiempo(8);
                acelBtn.disabled = true;
                acelBtn.style.opacity = '0.5';
                setTimeout(() => {
                    acelBtn.disabled = false;
                    acelBtn.style.opacity = '1';
                }, 30000);
            } else {
                console.warn('avanzarTiempo no está definida aún');
            }
        });
    } else {
        console.warn('Botón #acelerarBtn no encontrado en el DOM');
    }


});