// eventos.js - Sistema de eventos aleatorios (plagas, enfermedades)
let intervaloEventos = null;

// Lista de posibles problemas
const PROBLEMAS = [
  {
    id: 'pulgones',
    nombre: '🐛 Plaga de pulgones',
    sintomas: 'Hojas pegajosas y enrolladas',
    solucion: 'insecticida',
    opciones: [
      { texto: 'Aplicar jabón potásico', correcta: true, xp: 20, mensaje: '¡Bien! Los pulgones desaparecieron.' },
      { texto: 'Regar en exceso', correcta: false, xp: -10, mensaje: 'Empeoró la plaga. La planta se debilita.' },
      { texto: 'Podar todas las hojas', correcta: false, xp: -5, mensaje: 'Cortaste demasiado, la planta sufre.' }
    ]
  },
  {
    id: 'hongos',
    nombre: '🍄 Hongos en las hojas',
    sintomas: 'Manchas blancas y polvo',
    solucion: 'fungicida',
    opciones: [
      { texto: 'Aplicar fungicida natural', correcta: true, xp: 20, mensaje: 'Perfecto, los hongos se están controlando.' },
      { texto: 'Aumentar el riego', correcta: false, xp: -10, mensaje: 'La humedad empeoró los hongos.' },
      { texto: 'Mover al jardín (más sol)', correcta: false, xp: 5, mensaje: 'El sol ayuda un poco, pero no es suficiente.' }
    ]
  },
  {
    id: 'excesoSol',
    nombre: '☀️ Quemaduras por sol',
    sintomas: 'Hojas amarillas con bordes marrones',
    solucion: 'cambiar ubicación',
    opciones: [
      { texto: 'Mover a sombra parcial', correcta: true, xp: 15, mensaje: 'La planta se recupera del exceso de luz.' },
      { texto: 'Regar más seguido', correcta: false, xp: -5, mensaje: 'El agua no soluciona el problema de luz.' },
      { texto: 'Podar las hojas quemadas', correcta: false, xp: 0, mensaje: 'Solo aliviaste el síntoma, pero la causa sigue.' }
    ]
  },
  {
    id: 'faltaNutrientes',
    nombre: '🥀 Falta de nutrientes',
    sintomas: 'Crecimiento lento, hojas pálidas',
    solucion: 'abono',
    opciones: [
      { texto: 'Aplicar abono rico en nitrógeno', correcta: true, xp: 15, mensaje: 'La planta reverdece rápidamente.' },
      { texto: 'Cambiar maceta', correcta: false, xp: 5, mensaje: 'Ayuda pero no resuelve la falta de nutrientes.' },
      { texto: 'Regar con más frecuencia', correcta: false, xp: -5, mensaje: 'El exceso de agua empeora la absorción.' }
    ]
  }
];

// Función para activar un problema en una planta específica
function activarProblema(planta, problema) {
  planta.problema = problema.id;
  planta.problemaActivo = true;
  planta.problemaOpciones = problema.opciones;
  // Cambiar estado visual temporalmente
  planta.state = 'problem';
  // Mostrar alerta al jugador
  showTemporaryMessage(`⚠️ ¡${planta.name} tiene un problema! ${problema.nombre}. Síntomas: ${problema.sintomas}`, '#ff9966');
  // Actualizar la UI para mostrar el problema (botón especial)
  renderUserPlants(); // refrescará y mostrará un botón "Tratar"
}

// Función para curar la planta después de elegir opción
function tratarProblema(planta, opcionSeleccionada) {
  const problemaOriginal = PROBLEMAS.find(p => p.id === planta.problema);
  if (!problemaOriginal) return;
  
  const opcion = problemaOriginal.opciones[opcionSeleccionada];
  if (opcion.correcta) {
    planta.health = Math.min(100, planta.health + 20);
    addXP(opcion.xp);
    showTemporaryMessage(`✅ ${opcion.mensaje} +${opcion.xp} XP`, '#6fbf4c');
  } else {
    planta.health = Math.max(0, planta.health - 15);
    if (opcion.xp < 0) subtractXP(Math.abs(opcion.xp));
    showTemporaryMessage(`❌ ${opcion.mensaje}`, '#d9534f');
  }
  // Limpiar problema
  delete planta.problema;
  delete planta.problemaActivo;
  delete planta.problemaOpciones;
  if (planta.health < 30) planta.state = 'decayed';
  else if (planta.health < 70) planta.state = 'yellowing';
  else planta.state = 'normal';
  saveGame();
  renderUserPlants();
}

// Elegir una planta aleatoria del usuario que no tenga ya un problema activo
function elegirPlantaAleatoria() {
  const plantas = window.gameState?.db?.plants || [];
  const sanas = plantas.filter(p => !p.problemaActivo);
  if (sanas.length === 0) return null;
  const indice = Math.floor(Math.random() * sanas.length);
  return sanas[indice];
}

// Generar un evento aleatorio (se llama desde la simulación o desde el botón acelerar)
function generarEventoAleatorio() {
  if (!window.gameState?.db?.plants) return;
  // Probabilidad del 20% cada vez que se genera
  if (Math.random() > 0.2) return;
  
  const planta = elegirPlantaAleatoria();
  if (!planta) return;
  
  const problema = PROBLEMAS[Math.floor(Math.random() * PROBLEMAS.length)];
  activarProblema(planta, problema);
}

// Iniciar eventos periódicos (cada 2 minutos reales, igual que la simulación lenta)
function iniciarEventosPeriodicos() {
  if (intervaloEventos) clearInterval(intervaloEventos);
  intervaloEventos = setInterval(() => {
    generarEventoAleatorio();
  }, 120000); // cada 2 minutos
}

// También integrar con el botón de acelerar tiempo (cada vez que se acelera, puede ocurrir un evento)
// Para ello, modificaremos la función avanzarTiempo original para que llame a generarEventoAleatorio()
// Pero como ya tienes avanzarTiempo en simulacion.js, debes agregar una línea allí.

// Exportar funciones globales
window.generarEventoAleatorio = generarEventoAleatorio;
window.tratarProblema = tratarProblema;

// Iniciar cuando cargue la página
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => iniciarEventosPeriodicos(), 4000);
});