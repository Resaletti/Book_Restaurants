let supabaseClient = null;
let places = [];
let userName = '';
let editingId = null;
let currentFilter = null;      // null = nenhuma categoria escolhida ainda (tela inicial)
let currentCuisine = 'todas';  // subcategoria ativa quando currentFilter === 'restaurante'
let formState = { cat:null, price:0, stars:0, status:null, cuisine:null };
