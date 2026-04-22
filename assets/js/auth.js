async function register(username, email, password) {
  const db = window.gameDB;
  const exists = db.usuarios.some(u => u.correo === email);
  if (exists) throw new Error("El correo ya está registrado");
  const newId = db.usuarios.length > 0 ? Math.max(...db.usuarios.map(u => u.id_usuario)) + 1 : 1;
  const newUser = {
    id_usuario: newId,
    nombre_usuario: username,
    correo: email,
    contraseña: password,
    nivel: 1,
    experiencia: 0,
    puntos_diarios: 0,
    fecha_ultimo_reinicio: new Date().toISOString().slice(0,10),
    racha_dias: 0
  };
  db.usuarios.push(newUser);
  // Inicializar estadísticas vacías para este usuario
  db.estadisticas.push({
    id_estadistica: Date.now(),
    id_usuario: newId,
    acciones_totales: 0,
    errores_riego: 0,
    plantas_muertas: 0,
    tiempo_recuperacion: 0
  });
  await saveDB();
  return newUser;
}

async function login(email, password) {
  const db = window.gameDB;
  const user = db.usuarios.find(u => u.correo === email && u.contraseña === password);
  if (user) {
    window.currentUser = user;
    // Cargar datos relacionados
    user.misPlantas = db.planta_usuario.filter(p => p.id_usuario === user.id_usuario);
    user.misEstadisticas = db.estadisticas.find(e => e.id_usuario === user.id_usuario);
    user.misLogros = db.logros.filter(l => l.id_usuario === user.id_usuario);
    return user;
  }
  return null;
}

function logout() {
  window.currentUser = null;
  document.getElementById('authScreen').classList.remove('hidden');
  document.getElementById('gameScreen').classList.add('hidden');
}