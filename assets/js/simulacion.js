// simulacion.js - Simulación lenta + botón acelerar
let intervaloSimulacion = null;

// Actualiza el estado de una planta según humedad y salud
function actualizarPlanta(planta, horasTranscurridas) {
  const perdida = Math.floor(horasTranscurridas / 12) * 5;
  if (perdida > 0) {
    planta.water = Math.max(0, planta.water - perdida);
  }
  if (planta.water < 20) {
    planta.health = Math.max(0, planta.health - 2 * Math.floor(horasTranscurridas / 12));
  } else if (planta.water > 90) {
    planta.health = Math.max(0, planta.health - 1 * Math.floor(horasTranscurridas / 12));
  }
  if (planta.health < 30) planta.state = 'decayed';
  else if (planta.health < 70) planta.state = 'yellowing';
  else planta.state = 'normal';
}

function iniciarSimulacionLenta() {
  if (intervaloSimulacion) clearInterval(intervaloSimulacion);
  intervaloSimulacion = setInterval(() => {
    if (!window.gameState?.db?.plants) return;
    let cambios = false;
    for (let p of window.gameState.db.plants) {
      const antes = p.water + p.health;
      actualizarPlanta(p, 2);
      if (antes !== p.water + p.health) cambios = true;
    }
    if (cambios) {
      saveGame();
      renderUserPlants();
      showTemporaryMessage('🌿 El tiempo pasa lentamente... tus plantas han cambiado', '#aac9a0');
    }
  }, 120000);
}

// Función GLOBAL para acelerar tiempo
window.avanzarTiempo = function(horas) {
  console.log(`Acelerando tiempo: ${horas} horas`);
  if (!window.gameState?.db?.plants) return;
  let cambios = false;
  for (let p of window.gameState.db.plants) {
    const antes = p.water + p.health;
    actualizarPlanta(p, horas);
    if (antes !== p.water + p.health) cambios = true;
  }
  if (cambios) {
    saveGame();
    renderUserPlants();
    showTemporaryMessage(`⏩ ¡Aceleraste el tiempo! Pasaron ${horas} horas.`, '#ffaa66');
  } else {
    showTemporaryMessage(`⏩ No hubo cambios en ${horas} horas.`, '#cccc99');

    // Después de los cambios, generar posible evento
    if (window.generarEventoAleatorio) window.generarEventoAleatorio();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => iniciarSimulacionLenta(), 2000);
});