async function sumarXP(usuarioId, cantidad) {
  const db = window.gameDB;
  const user = db.usuarios.find(u => u.id_usuario === usuarioId);
  if (!user) return;

  // Verificar límite diario
  const hoy = new Date().toISOString().slice(0,10);
  if (user.fecha_ultimo_reinicio !== hoy) {
    user.puntos_diarios = 0;
    user.fecha_ultimo_reinicio = hoy;
  }
  let gananciaReal = Math.min(cantidad, 50 - user.puntos_diarios);
  if (gananciaReal <= 0) {
    mostrarMensaje("Límite diario de 50 XP alcanzado", "#c97e5a");
    return;
  }
  user.experiencia += gananciaReal;
  user.puntos_diarios += gananciaReal;

  // Subir de nivel
  let xpNecesaria = 100 * user.nivel;
  while (user.experiencia >= xpNecesaria) {
    user.experiencia -= xpNecesaria;
    user.nivel++;
    xpNecesaria = 100 * user.nivel;
    mostrarMensaje(`🎉 ¡Subiste al nivel ${user.nivel}!`, "#6a9e6a");
    // Desbloquear plantas (se maneja en vivero.js al cargar)
  }
  await saveDB();
  actualizarUI();
}

async function restarXP(usuarioId, cantidad) {
  const db = window.gameDB;
  const user = db.usuarios.find(u => u.id_usuario === usuarioId);
  if (user) {
    user.experiencia = Math.max(0, user.experiencia - cantidad);
    await saveDB();
    actualizarUI();
    mostrarMensaje(`❌ Has perdido ${cantidad} XP`, "#c97e5a");
  }
}

async function verificarLogros(usuarioId) {
  const db = window.gameDB;
  const user = db.usuarios.find(u => u.id_usuario === usuarioId);
  const misPlantas = db.planta_usuario.filter(p => p.id_usuario === usuarioId);
  const logrosObtenidos = db.logros.filter(l => l.id_usuario === usuarioId).map(l => l.nombre_logro);
  
  if (misPlantas.length >= 3 && !logrosObtenidos.includes("Coleccionista")) {
    db.logros.push({
      id_logro: Date.now(),
      id_usuario: usuarioId,
      nombre_logro: "Coleccionista",
      descripcion_logro: "Tener 3 plantas",
      fecha_obtencion: new Date().toISOString().slice(0,10)
    });
    mostrarMensaje("🏅 Logro desbloqueado: Coleccionista", "#ffd966");
  }
  if (user.nivel >= 5 && !logrosObtenidos.includes("Principiante Avanzado")) {
    db.logros.push({
      id_logro: Date.now(),
      id_usuario: usuarioId,
      nombre_logro: "Principiante Avanzado",
      descripcion_logro: "Alcanzar nivel 5",
      fecha_obtencion: new Date().toISOString().slice(0,10)
    });
    mostrarMensaje("🏅 Logro desbloqueado: Principiante Avanzado", "#ffd966");
  }
  await saveDB();
}