async function cargarMisPlantas() {
  const db = window.gameDB;
  const misPlantas = db.planta_usuario.filter(p => p.id_usuario === window.currentUser.id_usuario);
  const container = document.getElementById('plantsGrid');
  container.innerHTML = '';
  for (let registro of misPlantas) {
    const plantaInfo = db.plantas.find(p => p.id_planta === registro.id_planta);
    const div = document.createElement('div');
    div.className = 'plant-card';
    div.innerHTML = `
      <div><strong>${plantaInfo.nombre_planta}</strong></div>
      <div>📍 ${registro.ubicacion}</div>
      <div>❤️ Salud: ${registro.salud}%</div>
      <div>💧 Humedad: ${registro.humedad}%</div>
      <button class="select-plant" data-id="${registro.id_registro}">Cuidar</button>
      <button class="move-plant" data-id="${registro.id_registro}">Mover</button>
    `;
    container.appendChild(div);
  }
  // Eventos de selección
  document.querySelectorAll('.select-plant').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idReg = parseInt(btn.dataset.id);
      window.selectedPlantId = idReg;
      const planta = window.gameDB.planta_usuario.find(p => p.id_registro === idReg);
      const nombre = window.gameDB.plantas.find(p => p.id_planta === planta.id_planta).nombre_planta;
      document.getElementById('selectedPlantName').innerText = nombre;
      document.getElementById('plantActions').style.display = 'block';
    });
  });
  // Eventos mover
  document.querySelectorAll('.move-plant').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const idReg = parseInt(btn.dataset.id);
      const nuevaUbic = prompt("¿Dónde quieres ponerla? (sala, cocina, jardin)");
      if (nuevaUbic && ["sala","cocina","jardin"].includes(nuevaUbic)) {
        const db = window.gameDB;
        const registro = db.planta_usuario.find(p => p.id_registro === idReg);
        registro.ubicacion = nuevaUbic;
        // Efecto de luz según RF-11
        if (nuevaUbic === "jardin") registro.salud = Math.min(100, registro.salud + 10);
        else if (nuevaUbic === "sala") registro.salud += 5;
        else if (nuevaUbic === "cocina") registro.salud = Math.max(0, registro.salud - 10);
        await saveDB();
        cargarMisPlantas();
        mostrarMensaje(`Planta movida a ${nuevaUbic}`, "#8bc34a");
      }
    });
  });
}