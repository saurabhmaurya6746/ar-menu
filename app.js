/***********************
 * Data (GLB-only)
 ***********************/
const dishes = [
  {
    id: 'burger',
    emoji: '🍔',
    title: 'Classic Cheeseburger',
    price: 199,
    desc: 'Juicy beef patty, melted cheese, fresh lettuce & tomato on a toasted bun.',
    glb: 'assets/burger_tripo.glb',
    category: 'Burgers',
    rating: 4.6
  },
  {
  id: 'pasta',
  emoji: '🍝',
  title: 'Creamy Alfredo Pasta',
  price: 249,
  desc: 'Rich and creamy Alfredo sauce tossed with perfectly cooked pasta, garnished with parmesan & fresh herbs.',
  glb: 'assets/pasta.glb',
  category: 'Pasta',
  rating: 4.7
},
  {
    id: 'pizza',
    emoji: '🍕',
    title: 'Margherita Pizza',
    price: 299,
    desc: 'Wood-fired base with basil and mozzarella.',
    glb: 'assets/pizza.glb',
    category: 'Pizza',
    rating: 4.4
  },
  {
    id: 'cola',
    emoji: '🥤',
    title: 'Cold Cola',
    price: 79,
    desc: 'Chilled & bubbly — perfect with meals.',
    glb: 'assets/coca_cola.glb',
    category: 'Drinks',
    rating: 4.0
  },
  {
    id: 'fries',
    emoji: '🍟',
    title: 'Crispy Fries',
    price: 129,
    desc: 'Golden, crispy fries with house seasoning.',
    glb: 'assets/french_fries.glb',
    category: 'Sides',
    rating: 4.3
  },
  {
    id: 'chowmein',
    emoji: '🍜',
    title: 'Veg Chowmein',
    price: 149,
    desc: 'Stir-fried noodles with fresh vegetables and special sauce.',
    glb: 'assets/chaumin.glb',
    category: 'Noodles',
    rating: 4.2
  }
];
// guidelines pop 
document.addEventListener("DOMContentLoaded", () => {
  const guidelinesModal = document.getElementById("guidelinesModal");
  const closeGuidelines = document.getElementById("closeGuidelines");
  const gotItBtn = document.getElementById("gotItBtn");

  // Show modal on page load
  guidelinesModal.classList.remove("hidden");

  // Close functions
  function closeModal() {
    guidelinesModal.classList.add("hidden");
  }

  closeGuidelines.addEventListener("click", closeModal);
  gotItBtn.addEventListener("click", closeModal);
});

/***********************
 * Elements
 ***********************/
const listEl = document.getElementById('dishList');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const darkToggle = document.getElementById('darkToggle');
const cartBtn = document.getElementById('cartBtn');
const cartCountEl = document.getElementById('cartCount');

/* 3D modal */
const modal = document.getElementById('modal');
const mv = document.getElementById('mv');
const mTitle = document.getElementById('mTitle');
const mDesc  = document.getElementById('mDesc');
const mPrice = document.getElementById('mPrice');
const mRating = document.getElementById('mRating');
const closeBtn = document.getElementById('closeModal');
const rotateBtn = document.getElementById('rotateBtn');
const resetViewBtn = document.getElementById('resetViewBtn');
const arBtn = document.getElementById('arBtn');
const addBtn = document.getElementById('addBtn');

/* Cart modal */
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItemsEl = document.getElementById('cartItems');
const cartEmptyEl = document.getElementById('cartEmpty');
const cartSubtotalEl = document.getElementById('cartSubtotal');
const clearCartBtn = document.getElementById('clearCart');
const checkoutBtn = document.getElementById('checkoutBtn');

/***********************
 * State
 ***********************/
let rotating = true;
let currentDish = null;
let searchTerm = '';
let activeCategory = 'all';
let cart = [];

init();

/***********************
 * Init
 ***********************/
function init(){
  // Dark mode from storage
  const dm = localStorage.getItem('ar_menu_dark') === '1';
  document.body.classList.toggle('dark', dm);

  // Cart from storage
  cart = loadCart();
  updateCartBadge();

  // Fill categories
  const cats = [...new Set(dishes.map(d => d.category))];
  cats.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    categoryFilter.appendChild(opt);
  });

  // Render list
  renderList();

  // Listeners
  searchInput.addEventListener('input', (e)=>{
    searchTerm = e.target.value.trim().toLowerCase();
    renderList();
  });
  categoryFilter.addEventListener('change', (e)=>{
    activeCategory = e.target.value;
    renderList();
  });

  darkToggle.addEventListener('click', ()=>{
    document.body.classList.toggle('dark');
    localStorage.setItem('ar_menu_dark', document.body.classList.contains('dark') ? '1' : '0');
  });

  cartBtn.addEventListener('click', openCart);
  closeCart.addEventListener('click', closeCartModal);
  document.querySelectorAll('.modal-backdrop').forEach(b => {
    b.addEventListener('click', (e)=>{
      if(e.target.closest('#cartModal')) closeCartModal();
      if(e.target.closest('#modal')) close3DModal();
    });
  });

  closeBtn.addEventListener('click', close3DModal);
  window.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape'){
      if(!modal.classList.contains('hidden')) close3DModal();
      if(!cartModal.classList.contains('hidden')) closeCartModal();
    }
  });

  // Lighting chips
  document.querySelectorAll('.chip[data-light]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const mode = btn.dataset.light;
      applyLightingPreset(mode);
    });
  });

  rotateBtn.addEventListener('click', toggleRotate);
  resetViewBtn.addEventListener('click', resetView);
  arBtn.addEventListener('click', tryEnterAR);
  addBtn.addEventListener('click', addCurrentToCart);

 const clearCartBtn = document.getElementById('clearCart');
if (clearCartBtn) {
  clearCartBtn.addEventListener('click', () => {
    if (confirm('Clear all items from cart?')) {
      cart = [];
      saveCart();
      renderCart();
    }
  });
}


checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    return alert('Cart is empty.');
  }

  const name = prompt("Enter your name:");
  if (!name) return alert("Name is required!");

  const tableNumber = prompt("Enter your table number:");
  if (!tableNumber) return alert("Table number is required!");

  let orderDetails = "";
  let total = 0;

cart.forEach(item => {
  const dish = dishes.find(d => d.id === item.id);
  if (dish) {
    const quantity = item.qty || 1; // FIXED: qty ka use
    const price = Number(dish.price);
    const itemTotal = price * quantity;

    orderDetails += `• ${dish.title} (x${quantity}) — ₹${itemTotal}\n`;
    total += itemTotal;
  }
});


  const phoneNumber = "919369739349"; // apna WhatsApp number
  const message =
`🧾 *New Order Received*
👤 Name: ${name}
🍽️ Table: ${tableNumber}

${orderDetails}
💰 *Total*: ₹${total}

Please confirm the order ✅`;

  // Mobile pe direct app open kare, desktop pe web
  const mobileURL = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
  const webURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    window.location.href = mobileURL;
  } else {
    window.open(webURL, "_blank");
  }

  // Optional: clear cart
  cart.length = 0;
  renderCart();
});


}

/***********************
 * Rendering: list
 ***********************/
function renderList(){
  listEl.innerHTML = '';
  const filtered = dishes.filter(d => {
    const matchText = d.title.toLowerCase().includes(searchTerm) || d.desc.toLowerCase().includes(searchTerm);
    const matchCat = activeCategory === 'all' || d.category === activeCategory;
    return matchText && matchCat;
  });

  filtered.forEach(d => {
    const row = document.createElement('div');
    row.className = 'list-row';
    row.innerHTML = `
      <div class="row-left">
        <div class="row-title">
          <span class="emoji">${d.emoji}</span>
          <span>${d.title}</span>
        </div>
        <div class="row-meta">
          <div class="row-price">₹${d.price}</div>
          <div class="rating" aria-label="Rating">${stars(d.rating)} <span class="muted">(${d.rating.toFixed(1)})</span></div>
          <div class="muted">• ${d.category}</div>
        </div>
        <div class="row-desc">${d.desc}</div>
      </div>
      <div class="preview-card" role="button" tabindex="0" aria-label="Open ${d.title} in AR viewer">
        <model-viewer
          src="${d.glb}"
          alt="${d.title}"
          camera-controls
          auto-rotate
          disable-zoom
          environment-image="neutral"
          exposure="1"
          shadow-intensity="1"
        ></model-viewer>
      </div>
    `;

    // open modal
    row.addEventListener('click', (e) => {
      const isButton = e.target.closest('.preview-card') || e.currentTarget;
      if (isButton) open3DModal(d);
    });
    row.querySelector('.preview-card').addEventListener('keypress', (e)=>{
      if(e.key === 'Enter' || e.key === ' ') open3DModal(d);
    });

    listEl.appendChild(row);
  });

  if(filtered.length === 0){
    const empty = document.createElement('div');
    empty.className = 'muted';
    empty.style.padding = '16px';
    empty.textContent = 'No dishes match your search/filters.';
    listEl.appendChild(empty);
  }
}

function stars(r){
  const full = Math.floor(r);
  const half = r - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '☆' : '') + '✩'.repeat(empty);
}

/***********************
 * 3D Modal
 ***********************/
function open3DModal(dish){
  currentDish = dish;
  mv.pause();
  mv.src = dish.glb;
  mv.alt = dish.title;

  mTitle.textContent = dish.title;
  mDesc.textContent  = dish.desc;
  mPrice.textContent = '₹' + dish.price;
  mRating.innerHTML = `<span class="rating">${stars(dish.rating)} <span class="muted">(${dish.rating.toFixed(1)})</span></span>`;

  rotating = true;
  rotateBtn.textContent = 'Stop';
  mv.setAttribute('auto-rotate','');
  applyLightingPreset('neutral');

  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden','false');

  requestAnimationFrame(()=> mv.play());
}

function close3DModal(){
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden','true');
  mv.pause();
}

function toggleRotate(){
  rotating = !rotating;
  if (rotating){
    mv.setAttribute('auto-rotate','');
    rotateBtn.textContent = 'Stop';
  } else {
    mv.removeAttribute('auto-rotate');
    rotateBtn.textContent = 'Rotate';
  }
}

function resetView(){
  try{
    // Reset common camera attributes
    mv.removeAttribute('camera-orbit');
    mv.removeAttribute('camera-target');
    mv.removeAttribute('field-of-view');
    // Briefly pause/play to ensure reflow
    mv.pause();
    requestAnimationFrame(()=> mv.play());
  }catch(e){}
}

/* Lighting presets by tweaking exposure + (optional) shadow intensity */
function applyLightingPreset(mode){
  switch(mode){
    case 'bright':
      mv.setAttribute('exposure','1.3');
      mv.setAttribute('shadow-intensity','1');
      break;
    case 'warm':
      mv.setAttribute('exposure','1.05');
      mv.setAttribute('shadow-intensity','0.9');
      break;
    default: // neutral
      mv.setAttribute('exposure','1');
      mv.setAttribute('shadow-intensity','1');
  }
  mv.setAttribute('environment-image','neutral'); // built-in neutral IBL
}

async function tryEnterAR(){
  try{
    if(mv.canActivateAR){
      await mv.enterAR(); // Android: Scene Viewer / WebXR
    }else{
      alert('AR not supported on this device/browser. Use Chrome on Android.');
    }
  }catch(err){
    alert('AR not supported on this device/browser.');
  }
}

 function addCurrentToCart(){
  if (!currentDish) return;

  const qtyEl = document.getElementById("qtyInput");
  const qty = qtyEl ? parseInt(qtyEl.value) || 1 : 1; // null check added
  
  addItemToCart(currentDish.id, qty);

  addBtn.textContent = 'Added!';
  setTimeout(() => addBtn.textContent = 'Add to cart', 1200);
}


/***********************
 * Cart
 ***********************/
function loadCart(){
  try{
    return JSON.parse(localStorage.getItem('ar_menu_cart') || '[]');
  }catch(_){ return []; }
}
function saveCart(){
  localStorage.setItem('ar_menu_cart', JSON.stringify(cart));
}
function updateCartBadge(){
  const count = cart.reduce((sum, it)=> sum + it.qty, 0);
  cartCountEl.textContent = count;
}

function openCart(){
  renderCart();
  cartModal.classList.remove('hidden');
  cartModal.setAttribute('aria-hidden','false');
}
function closeCartModal(){
  cartModal.classList.add('hidden');
  cartModal.setAttribute('aria-hidden','true');
}
function renderCart() {
  cartItemsEl.innerHTML = '';

  if (cart.length === 0) {
    cartEmptyEl.style.display = 'block';
  } else {
    cartEmptyEl.style.display = 'none';

    cart.forEach(item => {
      const dish = dishes.find(d => d.id === item.id);
      if (!dish) return;

      const row = document.createElement('div');
      row.className = 'cart-row';
      row.innerHTML = `
        <div>
          <strong>${dish.title}</strong>
          <div class="muted" style="font-size:12px">${dish.category}</div>
        </div>
        <div class="muted">₹${dish.price}</div>
        <div class="qty">
          <button aria-label="Decrease">−</button>
          <span>${item.qty}</span>
          <button aria-label="Increase">+</button>
        </div>
        <button class="icon-btn" aria-label="Remove">🗑️</button>
      `;

      const qtyBtns = row.querySelectorAll('.qty button');
      const decBtn = qtyBtns[0];
      const incBtn = qtyBtns[1];
      const removeBtn = row.querySelector('.icon-btn');

      if (decBtn) decBtn.addEventListener('click', () => changeQty(item.id, -1));
      if (incBtn) incBtn.addEventListener('click', () => changeQty(item.id, +1));
      if (removeBtn) removeBtn.addEventListener('click', () => removeItem(item.id));

      cartItemsEl.appendChild(row);
    });
  }

  const subtotal = cart.reduce((sum, it) => {
    const d = dishes.find(x => x.id === it.id);
    return sum + (d ? d.price * it.qty : 0);
  }, 0);

  cartSubtotalEl.textContent = '₹' + subtotal;
  updateCartBadge();
}

function addItemToCart(id, qty = 1){
  const existing = cart.find(i=> i.id === id);
  if(existing) existing.qty += qty;
  else cart.push({ id, qty });
  saveCart();
  renderCart();
}


function changeQty(id, delta){
  const item = cart.find(i=> i.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0){
    cart = cart.filter(i=> i.id !== id);
  }
  saveCart();
  renderCart();
}

function removeItem(id){
  cart = cart.filter(i=> i.id !== id);
  saveCart();
  renderCart();
}
