// ---------- supabase setup ----------
function initSupabase(){

    const notConfigured =
        !window.SUPABASE_URL ||
        !window.SUPABASE_ANON_KEY;

    if(notConfigured){
        document.getElementById("configWarning").style.display = "block";
        document.getElementById("addToggle").disabled = true;
        return false;
    }

    // window.supabase aqui é o SDK carregado pelo <script> do CDN.
    // Guardamos a conexão numa variável com outro nome (supabaseClient)
    // para não sobrescrever/colidir com o SDK.
    supabaseClient = window.supabase.createClient(
        window.SUPABASE_URL,
        window.SUPABASE_ANON_KEY
    );

    return true;
}

async function loadPlaces(){
  const { data, error } = await supabaseClient.from('places').select('*').order('created_at', { ascending:false });
  if(error){ showToast('Erro ao carregar dados.'); console.error(error); return; }
  places = data || [];
  render();
}

function subscribeRealtime(){
  supabaseClient.channel('places-changes')
    .on('postgres_changes', { event:'*', schema:'public', table:'places' }, () => {
      loadPlaces();
    })
    .subscribe((status)=>{
      document.getElementById('syncDot').classList.toggle('live', status === 'SUBSCRIBED');
    });
}
