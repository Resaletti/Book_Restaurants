// ---------- name (kept per-device, in localStorage of the real site) ----------
function loadName(){
  userName = localStorage.getItem('user-name') || '';
  if(!userName){
    document.getElementById('nameModalBg').classList.add('show');
  }else{
    document.getElementById('whoLabel').textContent = userName;
  }
}
function saveName(name){
  userName = name;
  localStorage.setItem('user-name', name);
  document.getElementById('whoLabel').textContent = userName;
  document.getElementById('nameModalBg').classList.remove('show');
}
