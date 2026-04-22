// db.js
let globalDB = null;

async function loadDB() {
  const data = await window.electronAPI.loadDB();
  globalDB = data;
  return data;
}

async function saveDB() {
  if (globalDB) {
    await window.electronAPI.saveDB(globalDB);
    return true;
  }
  return false;
}

function getDB() {
  return globalDB;
}