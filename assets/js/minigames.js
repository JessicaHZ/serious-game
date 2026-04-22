// minigames.js
window.startPruningMinigame = function(plant) {
  const area = document.getElementById('minigameArea');
  area.innerHTML = `
    <div style="text-align:center">
      <h3>✂️ Poda de ${plant.name}</h3>
      <p>Corta solo las hojas secas (marrón). Tienes 3 vidas.</p>
      <div style="display:flex; gap:15px; justify-content:center; margin:20px">
        <div class="leaf-good" style="cursor:pointer; font-size:40px;">🍃</div>
        <div class="leaf-bad" style="cursor:pointer; font-size:40px;">🍂</div>
        <div class="leaf-good" style="cursor:pointer; font-size:40px;">🍃</div>
      </div>
      <p>Vidas: ❤️ <span id="lives">3</span></p>
      <button id="finishPruneBtn">Terminar poda</button>
    </div>
  `;
  let lives = 3;
  const badLeaf = document.querySelector('.leaf-bad');
  const goodLeaves = document.querySelectorAll('.leaf-good');
  
  function checkLives() {
    if (lives <= 0) {
      subtractXP(20);
      showTemporaryMessage('❌ Poda fallida, la planta se debilita. -20 XP', '#d9534f');
      area.innerHTML = '<p>Minijuego terminado. Vuelve a la casa para seguir cuidando.</p>';
    }
  }
  
  badLeaf.addEventListener('click', () => {
    lives--;
    document.getElementById('lives').innerText = lives;
    badLeaf.remove();
    showTemporaryMessage('Cortaste una hoja sana. Pierdes una vida.', '#d9534f');
    checkLives();
  });
  goodLeaves.forEach(leaf => {
    leaf.addEventListener('click', () => {
      leaf.remove();
      addXP(5);
      showTemporaryMessage('✅ Hoja seca podada correctamente. +5 XP', '#5cb85c');
    });
  });
  document.getElementById('finishPruneBtn').addEventListener('click', () => {
    if (lives > 0) {
      plant.health = Math.min(100, plant.health + 15);
      addXP(25);
      showTemporaryMessage('Poda exitosa. La planta recuperó salud.', '#5cb85c');
      saveGame();
      renderUserPlants();
    }
    area.innerHTML = '<p>Minijuego finalizado. Selecciona otro.</p>';
  });
};

function startPestsMinigame() {
  const area = document.getElementById('minigameArea');
  area.innerHTML = `
    <div>
      <h3>🐛 Detecta la plaga</h3>
      <p>¿Qué plaga deja manchas amarillas y telarañas?</p>
      <button class="pestOpt" data-correct="false">Pulgones</button>
      <button class="pestOpt" data-correct="true">Ácaros (araña roja)</button>
      <button class="pestOpt" data-correct="false">Cochinilla</button>
      <div id="pestFeedback"></div>
    </div>
  `;
  document.querySelectorAll('.pestOpt').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const isCorrect = btn.dataset.correct === 'true';
      if (isCorrect) {
        addXP(30);
        document.getElementById('pestFeedback').innerHTML = '✅ Correcto! Los ácaros se combaten con jabón potásico. +30 XP';
      } else {
        subtractXP(10);
        document.getElementById('pestFeedback').innerHTML = '❌ Incorrecto. La respuesta era Ácaros. -10 XP';
      }
      setTimeout(() => {
        document.getElementById('minigameArea').innerHTML = '<p>Selecciona otro minijuego.</p>';
      }, 2000);
    });
  });
}

function startQuizMinigame() {
  const area = document.getElementById('minigameArea');
  area.innerHTML = `
    <div>
      <h3>❓ Quiz: Riego adecuado</h3>
      <p>¿Cada cuánto regar una suculenta en interior?</p>
      <button class="quizOpt" data-correct="false">Cada día</button>
      <button class="quizOpt" data-correct="true">Cuando el sustrato esté seco</button>
      <button class="quizOpt" data-correct="false">Cada semana fija</button>
      <div id="quizFeedback"></div>
    </div>
  `;
  document.querySelectorAll('.quizOpt').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const isCorrect = btn.dataset.correct === 'true';
      if (isCorrect) {
        addXP(15);
        document.getElementById('quizFeedback').innerHTML = '✅ ¡Excelente! Las suculentas almacenan agua. +15 XP';
      } else {
        document.getElementById('quizFeedback').innerHTML = '❌ No es correcto. Riégala solo cuando la tierra esté seca.';
      }
      setTimeout(() => {
        document.getElementById('minigameArea').innerHTML = '<p>Elige otro juego para seguir aprendiendo.</p>';
      }, 2000);
    });
  });
}