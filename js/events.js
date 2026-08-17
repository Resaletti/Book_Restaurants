// ---------- form ----------
function setupEvents(){
document.getElementById('addToggle').addEventListener('click', ()=>{
  resetForm();
  document.getElementById('panelTitle').textContent = 'Novo lugar';
  panel.classList.add('open');
  document.getElementById('fName').focus();
});
document.getElementById('cancelBtn').addEventListener('click', closePanel);

document.getElementById('catRow').addEventListener('click', e=>{
  const b = e.target.closest('.pill'); if(!b) return;
  formState.cat = formState.cat===b.dataset.cat ? null : b.dataset.cat;
  refreshPillStates();
});
document.getElementById('priceRow').addEventListener('click', e=>{
  const b = e.target.closest('.pill'); if(!b) return;
  const v = Number(b.dataset.price);
  formState.price = formState.price===v ? 0 : v;
  refreshPillStates();
});
document.getElementById('statusRow').addEventListener('click', e=>{
  const b = e.target.closest('.pill'); if(!b) return;
  formState.status = formState.status===b.dataset.status ? null : b.dataset.status;
  refreshPillStates();
});
document.getElementById('starRow').addEventListener('click', e=>{
  const s = e.target.closest('.star'); if(!s) return;
  const v = Number(s.dataset.star);
  formState.stars = formState.stars===v ? 0 : v;
  refreshPillStates();
});

document.getElementById('saveBtn').addEventListener('click', async ()=>{
  const name = document.getElementById('fName').value.trim();
  if(!name){ showToast('Dá um nome pro lugar :)'); return; }
  if(!formState.cat){ showToast('Escolhe uma categoria'); return; }

  const url = document.getElementById('fUrl').value.trim();
  const desc = document.getElementById('fDesc').value.trim();

  const payload = {
    name, url, description: desc,
    category: formState.cat,
    price: formState.price,
    stars: formState.stars,
    status: formState.status
  };

  let error;
  if(editingId){
    ({ error } = await supabaseClient.from('places').update(payload).eq('id', editingId));
  }else{
    payload.added_by = userName || 'Alguém da família';
    ({ error } = await supabaseClient.from('places').insert(payload));
  }

  if(error){ showToast('Erro ao salvar. Tente de novo.'); console.error(error); return; }

  closePanel();
  showToast('Salvo!');
  loadPlaces();
});

// ---------- rendering ----------
grid.addEventListener('click', async (e)=>{
  const btn = e.target.closest('.icon-btn');
  if(!btn) return;
  const card = e.target.closest('.ticket');
  const id = card.dataset.id;
  const p = places.find(x=>x.id===id);
  if(!p) return;
  const action = btn.dataset.action;

  if(action==='delete'){
    if(confirm(`Remover "${p.name}"?`)){
      const { error } = await supabaseClient.from('places').delete().eq('id', id);
      if(error){ showToast('Erro ao remover.'); return; }
      showToast('Removido.');
      loadPlaces();
    }
  }else if(action==='edit'){
    editingId = id;
    document.getElementById('panelTitle').textContent = 'Editar lugar';
    document.getElementById('fName').value = p.name;
    document.getElementById('fUrl').value = p.url || '';
    document.getElementById('fDesc').value = p.description || '';
    formState = { cat:p.category, price:p.price||0, stars:p.stars||0, status:p.status||null };
    refreshPillStates();
    panel.classList.add('open');
    panel.scrollIntoView({behavior:'smooth', block:'start'});
  }else if(action==='share'){
    const st = statusInfo(p.status);
    const price = priceLabel(p.price);
    let text = `📍 ${p.name} (${catLabel(p.category)})\n`;
    if(price) text += `💰 ${price}\n`;
    if(p.stars) text += `⭐ ${p.stars}/5\n`;
    text += `🔁 Voltaríamos: ${st.label}\n`;
    if(p.description) text += `📝 ${p.description}\n`;
    if(p.url) text += `🔗 ${p.url}\n`;
    text += `— via Caderno de Lugares da família`;

    if(navigator.share){
      try{ await navigator.share({title:p.name, text}); }catch(e){}
    }else{
      try{
        await navigator.clipboard.writeText(text);
        showToast('Copiado! Cole numa conversa para compartilhar.');
      }catch(e){
        showToast('Não foi possível copiar automaticamente.');
      }
    }
  }
});

// ---------- filters ----------
document.getElementById('filters').addEventListener('click', e=>{
  const b = e.target.closest('.pill'); if(!b) return;
  currentFilter = b.dataset.filter;
  document.querySelectorAll('#filters .pill').forEach(x=>x.classList.toggle('active', x===b));
  render();
});

// ---------- name modal ----------
document.getElementById('nameSaveBtn').addEventListener('click', ()=>{
  const v = document.getElementById('nameInput').value.trim();
  if(!v){ return; }
  saveName(v);
});
document.getElementById('nameInput').addEventListener('keydown', e=>{
  if(e.key==='Enter') document.getElementById('nameSaveBtn').click();
});
document.getElementById('changeNameBtn').addEventListener('click', ()=>{
  document.getElementById('nameInput').value = userName;
  document.getElementById('nameModalBg').classList.add('show');
});
}
