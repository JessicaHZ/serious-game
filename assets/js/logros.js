function verificarLogros() {
  const user = window.gameState.user;
  const plants = window.gameState.db.plants;
  const logrosObtenidos = user.achievements || [];
  
  if (plants.length >= 3 && !logrosObtenidos.includes('COLECCIONISTA')) {
    logrosObtenidos.push('COLECCIONISTA');
    showTemporaryMessage('🏅 ¡Logro desbloqueado: Coleccionista (3 plantas)!', '#ffd966');
  }
  if (user.level >= 3 && !logrosObtenidos.includes('PRINCIPIANTE')) {
    logrosObtenidos.push('PRINCIPIANTE');
    showTemporaryMessage('🏅 ¡Logro: Principiante superado!', '#ffd966');
  }
  user.achievements = logrosObtenidos;
  saveGame();
  renderAchievements();
}

// Llama a verificarLogros() después de comprar planta, subir nivel, etc.