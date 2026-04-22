// admin.js
async function cargarAdminPanel() {
  const db = getDB();
  // Estadísticas RF-38
  const statsHtml = `
    <h3>Estadísticas de jugadores</h3>
    <table border="1">
      <tr><th>Usuario</th><th>Nivel</th><th>Errores riego</th><th>Plantas muertas</th></tr>
      ${db.usuarios.map(u => {
        const est = db.estadisticas.find(e => e.id_usuario === u.id_usuario) || { errores_riego: 0, plantas_muertas: 0 };
        return `<tr><td>${u.nombre_usuario}</td><td>${u.nivel}</td><td>${est.errores_riego || 0}</td><td>${est.plantas_muertas || 0}</td></tr>`;
      }).join('')}
    </table>
    <h3>Editar catálogo</h3>
    <div id="catalogEditor"></div>
  `;
  document.getElementById('adminStats').innerHTML = statsHtml;
  // Editor de catálogo (RF-39)
  const editorDiv = document.getElementById('catalogEditor');
  editorDiv.innerHTML = '';
  for (let planta of db.plantas) {
    const div = document.createElement('div');
    div.innerHTML = `
      <input value="${planta.nombre_planta}" id="nombre_${planta.id_planta}">
      <input value="${planta.tipo_luz}" id="luz_${planta.id_planta}">
      <select id="dificultad_${planta.id_planta}">
        <option ${planta.nivel_dificultad === 'Baja' ? 'selected' : ''}>Baja</option>
        <option ${planta.nivel_dificultad === 'Media' ? 'selected' : ''}>Media</option>
        <option ${planta.nivel_dificultad === 'Alta' ? 'selected' : ''}>Alta</option>
      </select>
      <button class="save-plant" data-id="${planta.id_planta}">Guardar</button>
    `;
    editorDiv.appendChild(div);
  }
  document.querySelectorAll('.save-plant').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = parseInt(btn.dataset.id);
      const nuevaNombre = document.getElementById(`nombre_${id}`).value;
      const nuevaLuz = document.getElementById(`luz_${id}`).value;
      const nuevaDificultad = document.getElementById(`dificultad_${id}`).value;
      const db2 = getDB();
      const planta = db2.plantas.find(p => p.id_planta === id);
      if (planta) {
        planta.nombre_planta = nuevaNombre;
        planta.tipo_luz = nuevaLuz;
        planta.nivel_dificultad = nuevaDificultad;
        await saveDB();
        mostrarMensaje('Catálogo actualizado', 'success');
      }
    });
  });
}