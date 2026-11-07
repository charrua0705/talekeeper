/* =========================================================
   TALE KEEPER - LOGIN + BIBLIOTECA PESSOAL (SUPABASE)
   Antes de publicar, preencha supabase-config.js.
========================================================= */

const SUPABASE_URL = window.TALEKEEPER_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = window.TALEKEEPER_SUPABASE_ANON_KEY || "";

const hasSupabaseConfig =
  SUPABASE_URL.startsWith("https://") &&
  SUPABASE_ANON_KEY.length > 20 &&
  window.supabase;

const db = hasSupabaseConfig
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

const $ = (id) => document.getElementById(id);

const searchInput = $("searchInput");
const searchButton = $("searchButton");
const emptyMessage = $("emptyMessage");
const myBooksGrid = $("myBooksGrid");
const myBooksEmpty = $("myBooksEmpty");
const libraryHint = $("libraryHint");

const prevSlide = $("prevSlide");
const nextSlide = $("nextSlide");
const dots = document.querySelectorAll(".dot");
const mobileMenu = $("mobileMenu");

const modal = $("bookModal");
const modalClose = $("modalClose");
const modalTitle = $("modalTitle");
const modalAuthor = $("modalAuthor");
const modalCover = $("modalCover");
const modalDescription = $("modalDescription");

const authModal = $("authModal");
const addBookModal = $("addBookModal");
const authForm = $("authForm");
const addBookForm = $("addBookForm");

let currentUser = null;
let authMode = "login";
let personalBooks = [];
let selectedFeatured = {
  title: "A Sombra do Tempo",
  author: "Ana Pererna",
  category: "Fantasia",
  description: "Uma jornada fantástica entre mundos esquecidos, segredos antigos e destinos que desafiam o tempo.",
  cover_url: ""
};

/* ---------------- CONFIG / STATUS ---------------- */

function showMessage(elementId, message, isError = false) {
  const element = $(elementId);
  if (!element) return;
  element.textContent = message;
  element.classList.toggle("error", isError);
}

function requireConfiguration() {
  if (db) return true;
  alert("O banco de dados ainda não foi conectado. Siga o guia INSTRUCOES.txt para configurar o Supabase.");
  return false;
}

/* ---------------- SEARCH ---------------- */

function searchBooks() {
  const query = (searchInput?.value || "").toLowerCase().trim();
  let found = 0;

  document.querySelectorAll("#booksGrid .book-card").forEach((card) => {
    const title = (card.dataset.title || "").toLowerCase();
    const author = (card.dataset.author || "").toLowerCase();
    const visible = title.includes(query) || author.includes(query);
    card.style.display = visible ? "flex" : "none";
    if (visible) found++;
  });

  if (emptyMessage) emptyMessage.style.display = found === 0 ? "block" : "none";

  document.querySelectorAll("#myBooksGrid .book-card").forEach((card) => {
    const title = (card.dataset.title || "").toLowerCase();
    const author = (card.dataset.author || "").toLowerCase();
    card.style.display = title.includes(query) || author.includes(query) ? "flex" : "none";
  });
}

searchInput?.addEventListener("input", searchBooks);
searchButton?.addEventListener("click", searchBooks);

/* ---------------- HERO SLIDER ---------------- */

const slides = [
  { label: "LIVRO DO MÊS", title: "A SOMBRA<br>DO TEMPO", description: "Uma jornada entre o passado e o destino." },
  { label: "AVENTURA", title: "A CIDADE<br>PERDIDA", description: "Entre ruínas antigas existe um segredo." },
  { label: "MISTÉRIO", title: "ESTRELA<br>OCULTA", description: "Alguns segredos deveriam permanecer escondidos." },
  { label: "FANTASIA", title: "O ÚLTIMO<br>REINO", description: "Quando um reino cai, uma nova lenda nasce." }
];
let currentSlide = 0;

function updateSlide() {
  const slide = slides[currentSlide];
  document.querySelector(".hero-label").textContent = slide.label;
  document.querySelector(".hero h1").innerHTML = slide.title;
  document.querySelector(".hero-text p").textContent = slide.description;
  dots.forEach((dot, index) => dot.classList.toggle("active", index === currentSlide));
}
function next() { currentSlide = (currentSlide + 1) % slides.length; updateSlide(); }
function previous() { currentSlide = (currentSlide - 1 + slides.length) % slides.length; updateSlide(); }

nextSlide?.addEventListener("click", next);
prevSlide?.addEventListener("click", previous);
dots.forEach((dot, index) => dot.addEventListener("click", () => { currentSlide = index; updateSlide(); }));

let sliderInterval = setInterval(next, 6000);
const hero = document.querySelector(".hero");
hero?.addEventListener("mouseenter", () => clearInterval(sliderInterval));
hero?.addEventListener("mouseleave", () => { sliderInterval = setInterval(next, 6000); });

/* ---------------- BOOK DETAILS ---------------- */

function openBookDetails(book) {
  selectedFeatured = {
    title: book.title,
    author: book.author || "Autor não informado",
    category: book.category || "",
    description: book.description || "Adicione este título à sua biblioteca pessoal.",
    cover_url: book.cover_url || ""
  };
  modalTitle.textContent = selectedFeatured.title;
  modalAuthor.textContent = selectedFeatured.author;
  modalDescription.textContent = selectedFeatured.description;
  modalCover.style.backgroundImage = selectedFeatured.cover_url
    ? `linear-gradient(#0002,#0002), url("${selectedFeatured.cover_url}")`
    : "";
  modalCover.style.backgroundSize = "cover";
  modalCover.style.backgroundPosition = "center";
  modal.classList.add("show");
}

document.querySelectorAll("#booksGrid .book-card").forEach((card) => {
  card.addEventListener("click", () => {
    const cover = card.querySelector(".cover");
    openBookDetails({
      title: card.dataset.title,
      author: card.dataset.author,
      description: `Conheça ${card.dataset.title}, de ${card.dataset.author}.`,
      category: "Literatura",
      cover_url: cover?.dataset.cover || ""
    });
  });
});

$("featuredDetails")?.addEventListener("click", () => openBookDetails({
  title: "A Sombra do Tempo",
  author: "Ana Pererna",
  category: "Fantasia",
  description: selectedFeatured.description
}));

function closeModal() { modal.classList.remove("show"); }
modalClose?.addEventListener("click", closeModal);
modal?.addEventListener("click", (event) => { if (event.target === modal) closeModal(); });

/* ---------------- AUTH MODAL ---------------- */

function openAuth(mode = "login") {
  authMode = mode;
  $("authTitle").textContent = mode === "signup" ? "Criar sua conta" : "Entrar na sua conta";
  $("authSubmit").textContent = mode === "signup" ? "CADASTRAR" : "ENTRAR";
  $("switchAuthMode").textContent = mode === "signup"
    ? "Já tem uma conta? Entrar"
    : "Ainda não tem conta? Cadastre-se";
  $("authPassword").autocomplete = mode === "signup" ? "new-password" : "current-password";
  showMessage("authMessage", "");
  authModal.classList.add("show");
}

$("loginButton")?.addEventListener("click", () => openAuth("login"));
$("registerButton")?.addEventListener("click", () => openAuth("signup"));
$("authClose")?.addEventListener("click", () => authModal.classList.remove("show"));
authModal?.addEventListener("click", (event) => { if (event.target === authModal) authModal.classList.remove("show"); });

$("switchAuthMode")?.addEventListener("click", () => {
  openAuth(authMode === "login" ? "signup" : "login");
});

authForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!requireConfiguration()) return;

  const email = $("authEmail").value.trim();
  const password = $("authPassword").value;
  const submit = $("authSubmit");
  submit.disabled = true;
  showMessage("authMessage", "Aguarde...");

  try {
    if (authMode === "signup") {
      const { data, error } = await db.auth.signUp({ email, password });
      if (error) throw error;
      if (data.session) {
        showMessage("authMessage", "Conta criada! Você já está conectado.");
      } else {
        showMessage("authMessage", "Cadastro iniciado! Confira seu e-mail para confirmar a conta antes de entrar.");
      }
    } else {
      const { error } = await db.auth.signInWithPassword({ email, password });
      if (error) throw error;
      authModal.classList.remove("show");
      authForm.reset();
    }
  } catch (error) {
    showMessage("authMessage", translateAuthError(error.message), true);
  } finally {
    submit.disabled = false;
  }
});

$("forgotPassword")?.addEventListener("click", async () => {
  if (!requireConfiguration()) return;
  const email = $("authEmail").value.trim();
  if (!email) {
    showMessage("authMessage", "Digite seu e-mail acima para receber o link de recuperação.", true);
    return;
  }
  try {
    const { error } = await db.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin
    });
    if (error) throw error;
    showMessage("authMessage", "Se o e-mail estiver cadastrado, você receberá um link de recuperação.");
  } catch (error) {
    showMessage("authMessage", translateAuthError(error.message), true);
  }
});

function translateAuthError(message = "") {
  if (/Invalid login credentials/i.test(message)) return "E-mail ou senha incorretos.";
  if (/already registered/i.test(message)) return "Este e-mail já possui cadastro. Tente entrar.";
  if (/Password should be at least/i.test(message)) return "A senha precisa ter pelo menos 6 caracteres.";
  if (/Email not confirmed/i.test(message)) return "Confirme seu e-mail antes de entrar.";
  return message;
}

/* ---------------- USER SESSION ---------------- */

async function refreshSession(session) {
  currentUser = session?.user || null;
  $("loginButton").hidden = !!currentUser;
  $("registerButton").hidden = !!currentUser;
  $("userArea").hidden = !currentUser;
  $("userEmail").textContent = currentUser?.email || "";
  libraryHint.textContent = currentUser
    ? "Seus livros ficam salvos na sua conta e só você pode acessá-los."
    : "Entre na sua conta para acessar e guardar seus livros.";

  if (currentUser) {
    await loadPersonalBooks();
  } else {
    personalBooks = [];
    renderPersonalBooks();
  }
}

$("logoutButton")?.addEventListener("click", async () => {
  if (!db) return;
  const { error } = await db.auth.signOut();
  if (error) alert(error.message);
});

if (db) {
  db.auth.getSession().then(({ data }) => refreshSession(data.session));
  db.auth.onAuthStateChange((_event, session) => {
    // Evita bloquear o callback de autenticação enquanto consulta os livros.
    setTimeout(() => refreshSession(session), 0);
  });
} else {
  libraryHint.textContent = "O banco ainda não foi configurado. Consulte o arquivo INSTRUCOES.txt.";
  $("loginButton").addEventListener("click", () => openAuth("login"));
}

/* ---------------- PERSONAL BOOKS ---------------- */

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

function renderPersonalBooks() {
  myBooksGrid.innerHTML = "";
  if (!currentUser) {
    myBooksEmpty.style.display = "none";
    return;
  }
  myBooksEmpty.style.display = personalBooks.length ? "none" : "block";

  personalBooks.forEach((book) => {
    const card = document.createElement("article");
    card.className = "book-card personal-book-card";
    card.dataset.title = book.title || "";
    card.dataset.author = book.author || "";
    const cover = document.createElement("div");
    cover.className = "cover personal-cover";
    if (book.cover_url) {
      cover.style.backgroundImage = `linear-gradient(#0005,#0005), url("${book.cover_url}")`;
      cover.style.backgroundSize = "cover";
      cover.style.backgroundPosition = "center";
    } else {
      cover.innerHTML = `<strong>${escapeHtml(book.title)}</strong><small>${escapeHtml(book.author || "")}</small><div class="cover-symbol">♧</div>`;
    }
    const info = document.createElement("div");
    info.className = "book-info";
    info.innerHTML = `<h3>${escapeHtml(book.title)}</h3><p>${escapeHtml(book.author || "Autor não informado")}</p><p class="book-category">${escapeHtml(book.category || "Sem categoria")}</p>`;
    const actions = document.createElement("div");
    actions.className = "book-actions";
    const details = document.createElement("button");
    details.className = "small-action";
    details.textContent = "Detalhes";
    details.addEventListener("click", () => openBookDetails(book));
    const remove = document.createElement("button");
    remove.className = "small-action delete-action";
    remove.textContent = "Excluir";
    remove.addEventListener("click", () => deletePersonalBook(book.id));
    actions.append(details, remove);
    info.append(actions);
    card.append(cover, info);
    myBooksGrid.append(card);
  });
  searchBooks();
}

async function loadPersonalBooks() {
  if (!db || !currentUser) return;
  myBooksEmpty.textContent = "Carregando seus livros...";
  myBooksEmpty.style.display = "block";

  const { data, error } = await db
    .from("books")
    .select("id, title, author, category, description, cover_url, created_at")
    .eq("user_id", currentUser.id)
    .order("created_at", { ascending: false });

  if (error) {
    myBooksEmpty.textContent = "Não foi possível carregar seus livros. Confira a configuração do banco.";
    console.error(error);
    return;
  }
  personalBooks = data || [];
  renderPersonalBooks();
}

$("openAddBook")?.addEventListener("click", () => {
  if (!currentUser) {
    openAuth("login");
    showMessage("authMessage", "Entre ou cadastre-se para criar sua biblioteca.");
    return;
  }
  showMessage("bookMessage", "");
  addBookModal.classList.add("show");
});

$("addBookClose")?.addEventListener("click", () => addBookModal.classList.remove("show"));
addBookModal?.addEventListener("click", (event) => {
  if (event.target === addBookModal) addBookModal.classList.remove("show");
});

addBookForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!db || !currentUser) {
    showMessage("bookMessage", "Entre na sua conta antes de salvar um livro.", true);
    return;
  }

  const book = {
    user_id: currentUser.id,
    title: $("bookTitleInput").value.trim(),
    author: $("bookAuthorInput").value.trim(),
    category: $("bookCategoryInput").value.trim(),
    cover_url: $("bookCoverInput").value.trim(),
    description: $("bookDescriptionInput").value.trim()
  };

  const submit = addBookForm.querySelector('button[type="submit"]');
  submit.disabled = true;
  showMessage("bookMessage", "Salvando livro...");

  try {
    const { error } = await db.from("books").insert(book);
    if (error) throw error;
    addBookForm.reset();
    addBookModal.classList.remove("show");
    await loadPersonalBooks();
  } catch (error) {
    showMessage("bookMessage", error.message || "Não foi possível salvar o livro.", true);
  } finally {
    submit.disabled = false;
  }
});

async function deletePersonalBook(id) {
  if (!db || !currentUser) return;
  if (!confirm("Tem certeza de que deseja excluir este livro da sua biblioteca?")) return;
  const { error } = await db.from("books").delete().eq("id", id).eq("user_id", currentUser.id);
  if (error) {
    alert("Não foi possível excluir o livro: " + error.message);
    return;
  }
  await loadPersonalBooks();
}

/* ---------------- MOBILE MENU / KEYBOARD ---------------- */

mobileMenu?.addEventListener("click", () => {
  const navigation = document.querySelector(".navigation");
  const visible = navigation.style.display === "flex";
  navigation.style.display = visible ? "none" : "flex";
  if (!visible) {
    Object.assign(navigation.style, {
      position: "absolute", top: "72px", left: "0", right: "0",
      padding: "20px", background: "#101213", flexDirection: "column",
      borderBottom: "1px solid rgba(213,166,60,.3)"
    });
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    modal?.classList.remove("show");
    authModal?.classList.remove("show");
    addBookModal?.classList.remove("show");
  }
});

$("saveFeaturedBook")?.addEventListener("click", async () => {
  if (!currentUser) {
    closeModal();
    openAuth("login");
    showMessage("authMessage", "Entre na sua conta para salvar este livro.");
    return;
  }
  const { error } = await db.from("books").insert({
    user_id: currentUser.id,
    title: selectedFeatured.title,
    author: selectedFeatured.author,
    category: selectedFeatured.category,
    description: selectedFeatured.description,
    cover_url: selectedFeatured.cover_url
  });
  if (error) {
    alert("Não foi possível adicionar o livro: " + error.message);
    return;
  }
  closeModal();
  await loadPersonalBooks();
  alert("Livro adicionado à sua biblioteca!");
});
