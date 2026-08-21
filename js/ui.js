// DOM elements
const grid = document.getElementById('grid');
const toastEl = document.getElementById('toast');
const panel = document.getElementById('panel');
const categorySelect = document.getElementById('categorySelect');
const filtersBar = document.getElementById('filtersBar');
const cuisineFilterRow = document.getElementById('cuisineFilterRow');
const activeCatLabel = document.getElementById('activeCatLabel');

function showToast(msg){
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  setTimeout(()=>toastEl.classList.remove('show'), 2500);
}

function closePanel(){
    panel.classList.remove('open');
    editingId = null;
}

function resetForm(){
  document.getElementById('fName').value='';
  document.getElementById('fUrl').value='';
  document.getElementById('fDesc').value='';
  formState = { cat:null, price:0, stars:0, status:null, cuisine:null };
  refreshPillStates();
}

function refreshPillStates(){
  document.querySelectorAll('#catRow .pill').forEach(b=>{
    b.classList.toggle('active', b.dataset.cat===formState.cat);
    b.classList.toggle('cat-'+b.dataset.cat, b.dataset.cat===formState.cat);
  });
  document.querySelectorAll('#priceRow .pill').forEach(b=>{
    b.classList.toggle('active', Number(b.dataset.price)===formState.price);
  });
  document.querySelectorAll('#statusRow .pill').forEach(b=>{
    b.classList.toggle('active', b.dataset.status===formState.status);
    b.classList.toggle('status-'+b.dataset.status, b.dataset.status===formState.status);
  });
  document.querySelectorAll('#starRow .star').forEach(s=>{
    s.classList.toggle('filled', Number(s.dataset.star)<=formState.stars);
  });

  // campo de cozinha só aparece quando a categoria escolhida é Restaurante
  const cuisineField = document.getElementById('cuisineField');
  cuisineField.style.display = formState.cat === 'restaurante' ? 'block' : 'none';
  document.querySelectorAll('#cuisineRow .pill').forEach(b=>{
    b.classList.toggle('active', b.dataset.cuisine===formState.cuisine);
  });
}

// ---------- navegação por categoria (tela inicial) ----------
function selectCategory(cat){
  currentFilter = cat;
  currentCuisine = 'todas';
  categorySelect.style.display = 'none';
  filtersBar.style.display = 'block';
  activeCatLabel.textContent = catLabel(cat);
  cuisineFilterRow.style.display = cat === 'restaurante' ? 'flex' : 'none';
  document.querySelectorAll('#cuisineFilterRow .pill').forEach(b=>{
    b.classList.toggle('active', b.dataset.cuisine === 'todas');
  });
  render();
}

function backToCategories(){
  currentFilter = null;
  currentCuisine = 'todas';
  categorySelect.style.display = 'block';
  filtersBar.style.display = 'none';
  closePanel();
  render();
}

function render(){
  if(!currentFilter){
    grid.style.display = 'none';
    grid.innerHTML = '';
    return;
  }
  grid.style.display = 'flex';

  let filtered = places.filter(p => p.category === currentFilter);
  if(currentFilter === 'restaurante' && currentCuisine && currentCuisine !== 'todas'){
    filtered = filtered.filter(p => (p.cuisine || 'outros') === currentCuisine);
  }

  document.getElementById('countLabel').textContent = filtered.length + (filtered.length===1?' lugar':' lugares');

  if(filtered.length===0){
    grid.innerHTML = '<div class="empty"><div class="big">Ainda não tem nada aqui</div>Adicione o primeiro lugar dessa categoria.</div>';
    return;
  }

  grid.innerHTML = filtered.map(p=>{
    const st = statusInfo(p.status);
    const price = priceLabel(p.price);
    const stars = p.stars>0 ? '★'.repeat(p.stars)+'☆'.repeat(5-p.stars) : '';
    const date = p.created_at ? new Date(p.created_at).toLocaleDateString('pt-BR',{day:'2-digit',month:'short'}) : '';
    const cuisineBadge = (p.category==='restaurante' && p.cuisine) ? `<span class="ticket-cuisine">${cuisineLabel(p.cuisine)}</span>` : '';
    return `
    <div class="ticket cat-${p.category}" data-id="${p.id}">
      <div class="ticket-main">
        <span class="ticket-cat">${catLabel(p.category)}</span>${cuisineBadge}
        <div class="ticket-name">${p.url ? `<a href="${escapeAttr(p.url)}" target="_blank" rel="noopener">${escapeHtml(p.name)}</a>` : escapeHtml(p.name)}</div>
        ${p.description ? `<div class="ticket-desc">${escapeHtml(p.description)}</div>` : ''}
        ${stars ? `<div class="ticket-stars">${stars}</div>` : ''}
        <div class="ticket-meta">adicionado por ${escapeHtml(p.added_by||'?')} · ${date}</div>
      </div>
      <div class="perforation"></div>
      <div class="ticket-side">
        <div class="price-tag ${price?'':'unset'}">${price || 'sem preço'}</div>
        <div class="stamp ${st.cls}">${st.label}</div>
        <div class="icon-row">
          <button class="icon-btn" title="Editar" data-action="edit">✎</button>
          <button class="icon-btn" title="Compartilhar" data-action="share">↗</button>
          <button class="icon-btn" title="Remover" data-action="delete">✕</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function escapeHtml(s){
  return String(s||'').replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

function escapeAttr(s){
    return escapeHtml(s);
}

function catLabel(c){
    return {restaurante:'Restaurante', bar:'Bar', atracao:'Atração'}[c] || c;
}

function cuisineLabel(c){
    return {
      japonesa:'Japonesa', italiana:'Italiana', brasileira:'Brasileira',
      hamburgueria:'Hamburgueria', pizzaria:'Pizzaria', outros:'Outros'
    }[c] || c;
}

function priceLabel(p){
    return p>0 ? '$'.repeat(p) : null;
}

function statusInfo(s){
  return {
    certeza:{cls:'certeza', label:'Com certeza'},
    talvez:{cls:'talvez', label:'Talvez'},
    nao:{cls:'nao', label:'Não'}
  }[s] || {cls:'none', label:'Ainda não decidimos'};
}
