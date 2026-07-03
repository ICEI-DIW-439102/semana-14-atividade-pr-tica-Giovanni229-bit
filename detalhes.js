
const API_URL_D = "http://localhost:3000";
const COLECAO_D = "pessoasHistoricas";

async function fetchItem(id) {
  const response = await fetch(`${API_URL_D}/${COLECAO_D}/${id}`);
  if (response.status === 404) throw new Error("not_found");
  if (!response.ok)            throw new Error(`server_error_${response.status}`);
  return response.json();
}


function mostrarErro(mensagem) {
  document.getElementById("loadingDetalhe").classList.add("d-none");
  document.getElementById("erroDetalheMsg").textContent = mensagem;
  document.getElementById("erroDetalhe").classList.remove("d-none");
}

function renderDetalhe(pessoa) {
  document.title = `${pessoa.nome} | Absolutamente Histórico`;
  
  document.getElementById("detalhe-conteudo").innerHTML = `
    <h2 class="titulo-secao sepia mt-4">
      <i class="bi bi-person-lines-fill me-2"></i>INFORMAÇÕES GERAIS
    </h2>
    <div class="detalhe-card">
      <div class="detalhe-img-col">
        <img
          src="${pessoa.imagem}"
          alt="${pessoa.nome}"
          class="detalhe-foto"
          onerror="this.src='https://via.placeholder.com/400x500/8d6e63/ffffff?text=${encodeURIComponent(pessoa.nome)}'"
        >
        <span class="detalhe-badge">${pessoa.subtitulo}</span>
      </div>
      <div class="detalhe-info-col">
        <h2 class="detalhe-nome">${pessoa.nome}</h2>
        <p class="detalhe-descricao">${pessoa.descricaoCompleta}</p>
        <div class="detalhe-itens">
          <div class="detalhe-item">
            <span class="detalhe-label"><i class="bi bi-globe2 me-1"></i>Nacionalidade</span>
            <span class="detalhe-valor">${pessoa.nacionalidade}</span>
          </div>
          <div class="detalhe-item">
            <span class="detalhe-label"><i class="bi bi-calendar-heart me-1"></i>Nascimento</span>
            <span class="detalhe-valor">${pessoa.nascimento}</span>
          </div>
          <div class="detalhe-item">
            <span class="detalhe-label"><i class="bi bi-calendar-x me-1"></i>Falecimento</span>
            <span class="detalhe-valor">${pessoa.falecimento}</span>
          </div>
          <div class="detalhe-item">
            <span class="detalhe-label"><i class="bi bi-briefcase-fill me-1"></i>Área de Atuação</span>
            <span class="detalhe-valor">${pessoa.areaDeAtuacao}</span>
          </div>
          <div class="detalhe-item detalhe-item-full">
            <span class="detalhe-label"><i class="bi bi-trophy-fill me-1"></i>Legado</span>
            <span class="detalhe-valor">${pessoa.legado}</span>
          </div>
        </div>
      </div>
    </div>`;

  const fotosGrid = document.getElementById("fotos-grid");
  fotosGrid.innerHTML = "";
  (pessoa.fotos || []).forEach((foto) => {
    const div = document.createElement("div");
    div.className = "foto-item";
    div.innerHTML = `
      <img
        src="${foto.url}"
        alt="${foto.titulo}"
        onerror="this.src='https://via.placeholder.com/300x200/8d6e63/ffffff?text=Foto'"
      >
      <div class="foto-overlay"><span>${foto.titulo}</span></div>`;
    fotosGrid.appendChild(div);
  });

  document.getElementById("loadingDetalhe").classList.add("d-none");
  document.getElementById("detalhe-conteudo").classList.remove("d-none");
  document.getElementById("secao-fotos").classList.remove("d-none");
}

async function iniciarDetalhes() {
  const params = new URLSearchParams(window.location.search);
  const id     = params.get("id");

  if (!id) {
    mostrarErro("Nenhuma pessoa selecionada. Acesse esta página a partir do catálogo.");
    return;
  }

  try {
    const pessoa = await fetchItem(id);

    renderDetalhe(pessoa);

  } catch (err) {
    if (err.message === "not_found") {
      mostrarErro(`Pessoa com id "${id}" não encontrada. Pode ter sido removida do catálogo.`);
    } else {
      mostrarErro("Não foi possível conectar ao servidor. Verifique se o JSON Server está rodando na porta 3000.");
    }
    console.error("Erro ao buscar pessoa:", err);
  }
}
