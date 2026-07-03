

const API_URL = "http://localhost:3000";
const COLECAO = "pessoasHistoricas";

let todasAsPessoas = [];
let termoPesquisa  = "";
let filtroAtivo    = false;

async function fetchItems() {
  const response = await fetch(`${API_URL}/${COLECAO}`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

function createCard(p) {
  const col = document.createElement("div");
  col.className = "col";
  col.innerHTML = `
    <a href="detalhes.html?id=${p.id}" class="card-historico-link">
      <div class="card-historico">
        <div class="card-img-wrapper">
          <img
            src="${p.imagem}"
            alt="${p.nome}"
            onerror="this.src='https://via.placeholder.com/400x300/8d6e63/ffffff?text=${encodeURIComponent(p.nome)}'"
          >
          <div class="card-overlay">
            <span><i class="bi bi-eye-fill me-1"></i>Ver detalhes</span>
          </div>
        </div>
        <div class="card-body-historico">
          <span class="card-subtitulo">${p.subtitulo}</span>
          <h5 class="card-nome">${p.nome}</h5>
          <p class="card-desc">${p.descricao.substring(0, 100)}...</p>
          <div class="card-meta">
            <span><i class="bi bi-geo-alt-fill me-1"></i>${p.nacionalidade}</span>
          </div>
        </div>
      </div>
    </a>`;
  return col;
}
function renderCards(lista) {
  const grid = document.getElementById("grid-pessoas");
  grid.innerHTML = "";

  if (lista.length === 0) {
    grid.innerHTML = `
      <div class="col-12 text-center py-5">
        <p class="sem-resultados">
          <i class="bi bi-search me-2"></i>Nenhuma pessoa encontrada.
        </p>
      </div>`;
  } else {
    lista.forEach((p) => grid.appendChild(createCard(p)));
  }
}

const renderGrid = renderCards;

function renderCarousel(pessoas) {
  const destaques   = pessoas.filter((p) => p.destaque);
  const indicators  = document.getElementById("carousel-indicators");
  const inner       = document.getElementById("carousel-inner");

  indicators.innerHTML = "";
  inner.innerHTML      = "";

  destaques.forEach((p, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("data-bs-target", "#carousel-destaques");
    btn.setAttribute("data-bs-slide-to", i);
    if (i === 0) btn.classList.add("active");
    indicators.appendChild(btn);

    const item = document.createElement("div");
    item.className = "carousel-item" + (i === 0 ? " active" : "");
    item.innerHTML = `
      <div class="carousel-slide-custom">
        <div class="carousel-img-wrapper">
          <img
            src="${p.imagem}"
            alt="${p.nome}"
            onerror="this.src='https://via.placeholder.com/500x400/8d6e63/ffffff?text=${encodeURIComponent(p.nome)}'"
          >
        </div>
        <div class="carousel-caption-custom">
          <span class="carousel-badge">${p.subtitulo}</span>
          <h3>${p.nome}</h3>
          <p>${p.descricao}</p>
          <a href="detalhes.html?id=${p.id}" class="btn-ver-mais">
            Ver mais <i class="bi bi-arrow-right-circle-fill ms-1"></i>
          </a>
        </div>
      </div>`;
    inner.appendChild(item);
  });
}

function getPessoasFiltradas() {
  let lista = todasAsPessoas;
  if (termoPesquisa) {
    lista = lista.filter(
      (p) =>
        p.nome.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
        p.descricao.toLowerCase().includes(termoPesquisa.toLowerCase())
    );
  }
  return lista;
}

function filtrarPessoas() {
  termoPesquisa = document.getElementById("campoPesquisa").value;
  renderGrid(getPessoasFiltradas());
}

function mostrarTodos() {
  filtroAtivo   = false;
  termoPesquisa = "";
  document.getElementById("campoPesquisa").value = "";
  document.getElementById("btnTodos").classList.add("ativo");
  document.getElementById("btnFiltro").classList.remove("ativo");
  renderGrid(todasAsPessoas);
}

function alternarFiltro() {
  filtroAtivo = true;
  document.getElementById("btnFiltro").classList.add("ativo");
  document.getElementById("btnTodos").classList.remove("ativo");
  renderGrid(getPessoasFiltradas());
}

async function init() {
  try {
    const pessoas = await fetchItems();
    todasAsPessoas = pessoas;

    renderCarousel(pessoas);
    document.getElementById("loadingCarousel").classList.add("d-none");
    document.getElementById("carousel-destaques").classList.remove("d-none");

    renderCards(pessoas);
    document.getElementById("loadingGrid").classList.add("d-none");
    document.getElementById("grid-pessoas").classList.remove("d-none");

  } catch (err) {
    console.error("Erro ao inicializar:", err);

  
    document.getElementById("loadingCarousel").classList.add("d-none");
    document.getElementById("loadingGrid").classList.add("d-none");
    document.getElementById("erroConexao").classList.remove("d-none");
  }
}

function iniciarIndex() {
  document.getElementById("campoPesquisa").addEventListener("keydown", (e) => {
    if (e.key === "Enter") filtrarPessoas();
  });
  init();
}
