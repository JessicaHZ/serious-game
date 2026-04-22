async function cargarCatalogo() {
  const db = window.gameDB;
  const plantas = db.plantas;
  const container = document.getElementById('plantCatalog');
  container.innerHTML = '';
  for (let planta of plantas) {
    const desbloqueada = window.currentUser.nivel >= (planta.nivel_dificultad === "Media" ? 3 : 1);
    const card = document.createElement('div');
    card.className = 'plant-card';
    card.innerHTML = `
      <div><strong>${planta.nombre_planta}</strong></div>
      <div>Luz: ${planta.tipo_luz}</div>
      <div>Dificultad: ${planta.nivel_dificultad}</div>
      <div>${planta.descripcion.substring(0, 50)}...</div>
      ${desbloqueada ? `<button data-id="${planta.id_planta}">Comprar</button>` : '<span>🔒 Nivel 3+</span>'}
    `;
    if (desbloqueada) {
      card.querySelector('button').addEventListener('click', () => comprarPlanta(planta.id_planta));
    }
    container.appendChild(card);
  }
}

async function comprarPlanta(id_planta) {
  const db = window.gameDB;
  const yaTiene = db.planta_usuario.some(p => p.id_usuario === window.currentUser.id_usuario && p.id_planta === id_planta);
  if (yaTiene) {
    mostrarMensaje("Ya tienes esta planta", "#c97e5a");
    return;
  }
  const nuevoRegistro = {
    id_registro: Date.now(),
    id_usuario: window.currentUser.id_usuario,
    id_planta: id_planta,
    estado_planta: "sana",
    ubicacion: "sala",
    humedad: 60,
    salud: 80,
    tamaño_maceta: 1,
    tipo_sustrato: "universal",
    ultimo_riego: Date.now(),
    ultimo_abono: 0,
    ultima_actualizacion: Date.now()
  };
  db.planta_usuario.push(nuevoRegistro);
  await saveDB();
  mostrarMensaje("Planta comprada con éxito", "#6a9e6a");
  // Actualizar la lista de plantas del usuario
  if (window.currentUser) {
    window.currentUser.misPlantas = db.planta_usuario.filter(p => p.id_usuario === window.currentUser.id_usuario);
  }
  cargarCatalogo(); // para actualizar estado
  if (document.getElementById('casaPanel') && !document.getElementById('casaPanel').classList.contains('hidden')) {
    cargarMisPlantas();
  }
}