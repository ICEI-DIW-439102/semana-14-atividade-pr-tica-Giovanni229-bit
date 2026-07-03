

const API_URL_C = "http://localhost:3000";
const COLECAO_C = "pessoasHistoricas";

let contadorFotos = 0;

function criarEntradaFoto() {
  contadorFotos++;
  const n   = contadorFotos;
  const div = document.createElement("div");
  div.className = "foto-entrada";
  div.id        = `foto-entrada-${n}`;
  div.innerHTML = `
    <div>
      <label for="foto-url-${n}">URL da foto ${n}</label>
      <input type="url" id="foto-url-${n}" name="foto-url-${n}"
             placeholder="https://…" />
    </div>
    <div>
      <label for="foto-titulo-${n}">Legenda</label>
      <input type="text" id="foto-titulo-${n}" name="foto-titulo-${n}"
             placeholder="Ex.: Em batalha" />
    </div>`;
  return div;
}
function coletarFotos() {
  const fotos = [];
  for (let i = 1; i <= contadorFotos; i++) {
    const urlEl    = document.getElementById(`foto-url-${i}`);
    const tituloEl = document.getElementById(`foto-titulo-${i}`);
    if (!urlEl) continue;
    const url    = urlEl.value.trim();
    const titulo = tituloEl ? tituloEl.value.trim() : "";
    if (url) fotos.push({ url, titulo: titulo || `Foto ${i}` });
  }
  return fotos;
}

function mostrarFeedback(msg, tipo) {
  const el = document.getElementById("feedbackMsg");
  el.textContent = msg;
  el.className   = `feedback ${tipo}`;
  el.classList.remove("d-none");
  el.scrollIntoView({ behavior: "smooth", block: "center" });
}

async function enviarFormulario(e) {
  e.preventDefault();

  const camposObrigatorios = ["nome", "subtitulo", "descricao", "descricaoCompleta", "imagem", "nacionalidade", "areaDeAtuacao"];
  for (const campo of camposObrigatorios) {
    const el = document.getElementById(campo);
    if (!el.value.trim()) {
      mostrarFeedback(`Preencha o campo obrigatório: "${el.previousElementSibling.textContent.replace(" *", "").trim()}"`, "erro");
      el.focus();
      return;
    }
  }

  const btnSalvar = document.getElementById("btnSalvar");
  btnSalvar.disabled    = true;
  btnSalvar.textContent = "Salvando…";

  const novaPessoa = {
    nome:              document.getElementById("nome").value.trim(),
    subtitulo:         document.getElementById("subtitulo").value.trim(),
    descricao:         document.getElementById("descricao").value.trim(),
    descricaoCompleta: document.getElementById("descricaoCompleta").value.trim(),
    imagem:            document.getElementById("imagem").value.trim(),
    nacionalidade:     document.getElementById("nacionalidade").value.trim(),
    areaDeAtuacao:     document.getElementById("areaDeAtuacao").value.trim(),
    nascimento:        document.getElementById("nascimento").value.trim() || "Desconhecido",
    falecimento:       document.getElementById("falecimento").value.trim() || "Desconhecido",
    legado:            document.getElementById("legado").value.trim() || "",
    destaque:          document.getElementById("destaque").checked,
    fotos:             coletarFotos()
  };

  try {
    const response = await fetch(`${API_URL_C}/${COLECAO_C}`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(novaPessoa)
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const pessoaSalva = await response.json();

    mostrarFeedback(
      `✔ "${pessoaSalva.nome}" cadastrada com sucesso! (id: ${pessoaSalva.id})`,
      "sucesso"
    );

    document.getElementById("formCadastro").reset();
    document.getElementById("fotosContainer").innerHTML = "";
    contadorFotos = 0;
    document.getElementById("fotosContainer").appendChild(criarEntradaFoto());

    setTimeout(() => {
      window.location.href = `detalhes.html?id=${pessoaSalva.id}`;
    }, 2500);

  } catch (err) {
    mostrarFeedback(
      "Erro ao salvar. Verifique se o JSON Server está rodando na porta 3000.",
      "erro"
    );
    console.error("Erro no cadastro:", err);
  } finally {
    btnSalvar.disabled    = false;
    btnSalvar.innerHTML   = '<i class="bi bi-floppy-fill me-1"></i>Salvar pessoa';
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("fotosContainer");
  container.appendChild(criarEntradaFoto());

  document.getElementById("btnAddFoto").addEventListener("click", () => {
    if (contadorFotos >= 6) {
      mostrarFeedback("Máximo de 6 fotos por pessoa.", "erro");
      return;
    }
    container.appendChild(criarEntradaFoto());
  });
  
  document.getElementById("formCadastro").addEventListener("submit", enviarFormulario);
});
