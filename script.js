/* =========================================================
   TALE KEEPER - MVP
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

const booksGrid = document.getElementById("booksGrid");
const books = document.querySelectorAll(".book-card");
const emptyMessage = document.getElementById("emptyMessage");

const prevSlide = document.getElementById("prevSlide");
const nextSlide = document.getElementById("nextSlide");

const dots = document.querySelectorAll(".dot");

const mobileMenu = document.getElementById("mobileMenu");

const modal = document.getElementById("bookModal");
const modalClose = document.getElementById("modalClose");

const modalTitle = document.getElementById("modalTitle");
const modalAuthor = document.getElementById("modalAuthor");
const modalCover = document.getElementById("modalCover");


/* =========================================================
   SEARCH
========================================================= */

function searchBooks() {

  const query = searchInput.value
    .toLowerCase()
    .trim();

  let found = 0;

  books.forEach(book => {

    const title = book.dataset.title.toLowerCase();
    const author = book.dataset.author.toLowerCase();

    const match =
      title.includes(query) ||
      author.includes(query);

    if (match) {
      book.style.display = "flex";
      found++;
    } else {
      book.style.display = "none";
    }

  });

  emptyMessage.style.display =
    found === 0 ? "block" : "none";
}


searchInput.addEventListener(
  "input",
  searchBooks
);

searchButton.addEventListener(
  "click",
  searchBooks
);


/* =========================================================
   HERO SLIDER
========================================================= */

const slides = [

  {
    label: "LIVRO DO MÊS",
    title: "A SOMBRA<br>DO TEMPO",
    description:
      "Uma jornada entre o passado e o destino."
  },

  {
    label: "AVENTURA",
    title: "A CIDADE<br>PERDIDA",
    description:
      "Entre ruínas antigas existe um segredo."
  },

  {
    label: "MISTÉRIO",
    title: "ESTRELA<br>OCULTA",
    description:
      "Alguns segredos deveriam permanecer escondidos."
  },

  {
    label: "FANTASIA",
    title: "O ÚLTIMO<br>REINO",
    description:
      "Quando um reino cai, uma nova lenda nasce."
  }

];

let currentSlide = 0;


function updateSlide() {

  const slide = slides[currentSlide];

  document.querySelector(".hero-label").textContent =
    slide.label;

  document.querySelector(".hero h1").innerHTML =
    slide.title;

  document.querySelector(".hero p").textContent =
    slide.description;

  dots.forEach((dot, index) => {

    dot.classList.toggle(
      "active",
      index === currentSlide
    );

  });

}


function next() {

  currentSlide++;

  if (currentSlide >= slides.length) {
    currentSlide = 0;
  }

  updateSlide();
}


function previous() {

  currentSlide--;

  if (currentSlide < 0) {
    currentSlide = slides.length - 1;
  }

  updateSlide();
}


nextSlide.addEventListener(
  "click",
  next
);

prevSlide.addEventListener(
  "click",
  previous
);


dots.forEach((dot, index) => {

  dot.addEventListener("click", () => {

    currentSlide = index;

    updateSlide();

  });

});


/* Auto slider */

let sliderInterval = setInterval(
  next,
  6000
);


/* Pause on hover */

const hero = document.querySelector(".hero");

hero.addEventListener("mouseenter", () => {
  clearInterval(sliderInterval);
});

hero.addEventListener("mouseleave", () => {

  sliderInterval = setInterval(
    next,
    6000
  );

});


/* =========================================================
   BOOK MODAL
========================================================= */

books.forEach(book => {

  book.addEventListener("click", () => {

    const title =
      book.dataset.title;

    const author =
      book.dataset.author;

    modalTitle.textContent =
      title;

    modalAuthor.textContent =
      author;

    modal.classList.add("show");

  });

});


function closeModal() {

  modal.classList.remove("show");

}


modalClose.addEventListener(
  "click",
  closeModal
);


modal.addEventListener(
  "click",
  event => {

    if (
      event.target === modal
    ) {
      closeModal();
    }

  }
);


document.addEventListener(
  "keydown",
  event => {

    if (event.key === "Escape") {
      closeModal();
    }

  }
);


/* =========================================================
   MOBILE MENU
========================================================= */

mobileMenu.addEventListener(
  "click",
  () => {

    const navigation =
      document.querySelector(".navigation");

    const isVisible =
      navigation.style.display === "flex";

    navigation.style.display =
      isVisible ? "none" : "flex";

    if (!isVisible) {

      navigation.style.position =
        "absolute";

      navigation.style.top =
        "72px";

      navigation.style.left =
        "0";

      navigation.style.right =
        "0";

      navigation.style.padding =
        "20px";

      navigation.style.background =
        "#101213";

      navigation.style.flexDirection =
        "column";

      navigation.style.borderBottom =
        "1px solid rgba(213,166,60,.3)";

    }

  }
);


/* =========================================================
   BUTTONS
========================================================= */

document.querySelectorAll(
  ".primary-button"
).forEach(button => {

  button.addEventListener(
    "click",
    () => {

      if (
        button.textContent.includes(
          "ADICIONAR"
        )
      ) {

        button.textContent =
          "✓ ADICIONADO";

        button.style.background =
          "linear-gradient(135deg,#597b4d,#30492a)";

        button.style.color =
          "#fff";

      }

    }
  );

});


document.querySelector(
  ".login-button"
).addEventListener(
  "click",
  () => {

    alert(
      "Área de login — disponível na próxima versão do MVP."
    );

  }
);


document.querySelector(
  ".register-button"
).addEventListener(
  "click",
  () => {

    alert(
      "Área de cadastro — disponível na próxima versão do MVP."
    );

  }
);