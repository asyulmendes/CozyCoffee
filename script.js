// ====================================================================================
// COZYCOFFEE — TIMER POMODORO
// ====================================================================================
// Arquitetura: Dividido em Estado Global, Funções Puras (sem contato com HTML),
// Camada de UI (manipulação de tela) e Eventos (ações do usuário).
// Isso garante que o código seja fácil de ler, testar e expandir.
// ====================================================================================


// ====================================================================================
// 1. ESTADO GLOBAL
// ====================================================================================
// Aqui definimos a "memória central" do app. Qualquer função que precise saber
// em qual modo estamos ou quanto tempo falta, vai consultar estas variáveis.

let tempoPomodoroPadrao  = 25 * 60; // tempos em segundos
let tempoPausaCurtaPadrao = 5 * 60;
let tempoPausaLongaPadrao = 15 * 60;

let tempo        = tempoPomodoroPadrao; // contador regressivo atual
let intervalo    = null;                // ID do setInterval; null = timer parado
let modoAtual    = "pomodoro";          // "pomodoro" | "pausa-curta" | "pausa-longa"
let ciclosPomodoro = 0;                 // pomodoros completos no ciclo atual
let displayAtivo = null; // Guardará a referência do relógio (na aba ou no PiP)
let botaoStartAtivo = null; // Guardará a referência do botão (na aba ou no PiP)

// ====================================================================================
// 2. BANCO DE DADOS DE FUNDOS
// ====================================================================================
// Fonte central das imagens. Adicionar um objeto aqui atualiza a galeria na tela
// automaticamente, sem precisar tocar em nenhuma outra parte do código.


const bancoDeDadosBackgrounds = [

  //CAFE================================================================
  { titulo: "Bancada de cafe",   categoria: "cafe", arquivo: "bancada-cafe.webp",      fotografo: "99.films" , link:"https://unsplash.com/pt-br/fotografias/mesas-redondas-de-madeira-marrom-ao-lado-do-sofa-de-couro-preto-yr9l_xQPDL0?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"},
  { titulo: "cafe",              categoria: "cafe", arquivo: "cafe-cafe.webp",         fotografo: "IA" },
  { titulo: "Cafeteira",         categoria: "cafe", arquivo: "cafeteira-cafe.webp",    fotografo: "nathanmullet", link:"https://unsplash.com/pt-br/fotografias/um-copo-de-liquido-em-uma-maquina-FnPGNOOI6YU?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" },
  { titulo: "Cafeteria Cozy",    categoria: "cafe", arquivo: "cafeteria - 1.webp",     fotografo: "daanevers" , link:"https://unsplash.com/pt-br/@daanelise?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"},
  { titulo: "Cafeteria Externa", categoria: "cafe", arquivo: "cafeteria-fora.webp",    fotografo: "tonylee" , link:"https://unsplash.com/pt-br/fotografias/mesa-de-madeira-marrom-quadrada-8IKf54pc3qk?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"},
  { titulo: "Cafeteria Noturna", categoria: "cafe", arquivo: "cafeteria-noturna.webp", fotografo: "clemonojeghuo", link:"https://unsplash.com/pt-br/fotografias/pessoa-sentada-dentro-do-restaurante-zlABb6Gke24?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"},
  { titulo: "Casal no cafe",     categoria: "cafe", arquivo: "casal-cafe.webp",        fotografo: "nathandumlao", link:"https://unsplash.com/pt-br/fotografias/pessoa-sentada-dentro-do-restaurante-zlABb6Gke24?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" },
  { titulo: "Dark cafe",         categoria: "cafe", arquivo: "dark-cafe.webp",         fotografo: "sebastianschuppik", link:"https://unsplash.com/pt-br/fotografias/tables-and-chairs-inside-building-H7xTpvBjJS4?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" },
  { titulo: "Janela do cafe",    categoria: "cafe", arquivo: "janela-cafe.webp",       fotografo: "khamkéo" , link:"https://unsplash.com/pt-br/fotografias/janela-de-vidro-transparente-ciyy63hP7HA?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"},
  { titulo: "Vista da Janela",   categoria: "cafe", arquivo: "janela-fora.webp",       fotografo: "notethanun", link:"https://unsplash.com/pt-br/fotografias/um-grupo-de-pessoas-sentadas-em-uma-mesa-do-lado-de-fora-de-um-cafe-AFeiu4paBys?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" },
  { titulo: "Truck cafe",        categoria: "cafe", arquivo: "truck-cafe.webp",        fotografo: "jasonan", link:"https://unsplash.com/pt-br/fotografias/um-food-truck-estacionado-na-lateral-de-uma-rua-dC3Mrd-k02Q?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" },


  //DARK ACADEMY========================================================
  { titulo: "Biblioteca", categoria: "dark-academy", arquivo: "bibli-dark.webp", fotografo: "zachplank", link:"https://unsplash.com/pt-br/fotografias/prateleiras-de-livros-de-madeira-marrom-com-livros-o-cpCRdEgxs?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" },
  { titulo: "Biblioteca Clássica", categoria: "dark-academy", arquivo: "dark-biblioteca.webp", fotografo: "unsplash"},
  { titulo: "Estante Clássica", categoria: "dark-academy", arquivo: "dark-esta.webp", fotografo: "unsplash" },
  { titulo: "Livros Antigos", categoria: "dark-academy", arquivo: "dark-livros.webp", fotografo: "jeztimms" ,link:"https://unsplash.com/pt-br/fotografias/acendeu-a-lampada-de-mesa-ao-lado-de-uma-pilha-de-livros-8muUTAmcWU4?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" },
  { titulo: "Teto Vitoriano", categoria: "dark-academy", arquivo: "dark-teto.webp", fotografo: "johntowner" , link:"https://unsplash.com/pt-br/fotografias/fotografia-de-baixo-angulo-da-janela-de-vidro-do-edificio-pDKoVuXYKxU?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" },
  { titulo: "Escadaria", categoria: "dark-academy", arquivo: "escadaria.webp", fotografo: "claudiotesta", link:"https://unsplash.com/pt-br/fotografias/catedral-marrom-durante-o-dia-iqeG5xA96M4?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" },
  { titulo: "Leitura Noturna", categoria: "dark-academy", arquivo: "lib-dark.webp", fotografo: "patrickrobertdoyle", link:"https://unsplash.com/pt-br/fotografias/edificio-interior-OvXht_wi5Ew?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" },


  // --- FANTASIA ---
  
  { titulo: "Beco Diagonal", categoria: "fantasia", arquivo: "beco-hp.webp", fotografo: "rithikagopal", link:"https://unsplash.com/pt-br/fotografias/dragao-no-topo-do-edificio-durante-o-dia-JK0l2xvN1fY?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"},
  { titulo: "Casa do Hobbit", categoria: "fantasia", arquivo: "casa-hobbit.webp", fotografo: "tl", link:"https://unsplash.com/pt-br/fotografias/fotografia-de-casa-esmaecida-IA_BATrHzXo?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" },
  { titulo: "Castelo Escuro", categoria: "fantasia", arquivo: "castelo-dark.webp", fotografo: "cedericvandenberghe", link:"https://unsplash.com/pt-br/fotografias/foto-de-closeup-do-castelo-com-nevoa-21DP3hytVHw?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" },
  { titulo: "Estação Mágica", categoria: "fantasia", arquivo: "estacao-hp.webp", fotografo: "adityavyas", link:"https://unsplash.com/pt-br/fotografias/sinal-vermelho-e-branco-de-nao-fumar-b7MUFydsU64?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" },
  { titulo: "Guerreiro", categoria: "fantasia", arquivo: "guerreiro.webp", fotografo: "nikshuliahin", link:"https://unsplash.com/pt-br/fotografias/armadura-de-aco-inoxidavel-cinza-JOzv_pAkcMk?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" },
  { titulo: "O Condado", categoria: "fantasia", arquivo: "hobbit.webp", fotografo: "andresiga", link:"https://unsplash.com/pt-br/fotografias/casa-subterranea-coberta-com-grama-verde-e-plantas-7XKkJVw1d8c?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" },
  { titulo: "Janela do Castelo", categoria: "fantasia", arquivo: "janela-castelo.webp", fotografo: "jonathanlarson", link:"https://unsplash.com/pt-br/fotografias/pinheiros-verdes-KuXPQSfykx8?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" },
  { titulo: "Mapa Antigo", categoria: "fantasia", arquivo: "mapa.webp", fotografo: "patrickfobian", link:"https://unsplash.com/pt-br/fotografias/um-desenho-de-um-mapa-em-um-pedaco-de-papel-y7hn9WYxK3s?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" },
{ titulo: "Expresso de Hogwarts", categoria: "fantasia", arquivo: "trem-hp.webp", fotografo: "bk", link:"https://unsplash.com/pt-br/fotografias/train-on-railway-at-daytime-HAl6CKxM3xU?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" },

  // --- LANDSCAPE ---
  { titulo: "Barco na Paisagem", categoria: "landscape", arquivo: "barco-lanscape.webp", fotografo: "roxanazerni", link:"https://unsplash.com/pt-br/fotografias/uma-estrada-com-arvores-e-grama-ao-lado-lBLSMEkHbYs?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" },
  { titulo: "Casa no Campo", categoria: "landscape", arquivo: "casa-campo.webp", fotografo: "dansmedley", link:"https://unsplash.com/pt-br/fotografias/casa-ao-lado-do-lago-zmZUCjOVy_k?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" },
  { titulo: "Estrada", categoria: "landscape", arquivo: "estrada.webp", fotografo: "johntowner", link:"https://unsplash.com/pt-br/fotografias/estrada-de-concreto-vazia-coberta-cercada-por-tress-altos-com-raios-de-sol-3Kv48NS4WUU?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" },
  { titulo: "Floresta", categoria: "landscape", arquivo: "floresta.webp", fotografo: "maritakavelashvili", link:"https://unsplash.com/pt-br/fotografias/foto-aerea-de-arvores-verdes-ugnrXk1129g?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" },
  { titulo: "Vista da Paisagem", categoria: "landscape", arquivo: "land-view.webp", fotografo: "unsplash" },
  { titulo: "Natureza de Outono", categoria: "landscape", arquivo: "natureza-aun.webp", fotografo: "unsplash" },
  { titulo: "Piano na Natureza", categoria: "landscape", arquivo: "piano.webp", fotografo: "IA" },
  { titulo: "Pintura de Paisagem", categoria: "landscape", arquivo: "pintura.webp", fotografo: "unsplash" },
  { titulo: "Ponte na Floresta", categoria: "landscape", arquivo: "ponte-floresta.webp", fotografo: "timswann", link:"https://unsplash.com/pt-br/fotografias/ponte-de-aco-azul-e-marrom-eOpewngf68w?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" },
  { titulo: "Tóquio", categoria: "landscape", arquivo: "tokyo-land.webp", fotografo: "unsplash" },

  // --- LIVROS ---
  { titulo: "Bíblia e Café", categoria: "livros", arquivo: "biblia-cafe.webp", fotografo: "unsplash" },
  { titulo: "Mundo dos Livros", categoria: "livros", arquivo: "book-land.webp", fotografo: "melodyzimmerman", link:"https://unsplash.com/pt-br/fotografias/uma-sala-de-estar-com-um-sofa-marrom-e-uma-cadeira-marrom-INr3HbMSMSw?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" },
  { titulo: "Pilhas de Livros", categoria: "livros", arquivo: "books-books.webp", fotografo: "anastasiiakrutota", link:"https://unsplash.com/pt-br/fotografias/livros-marrons-e-pretos-na-prateleira-de-madeira-preta-v1QCJQoD03k?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" },
  { titulo: "Livraria Clássica", categoria: "livros", arquivo: "livraria-2.webp", fotografo: "sebastienlederout", link:"https://unsplash.com/pt-br/fotografias/pessoa-sentada-dentro-da-biblioteca-wX_zbzIxclA?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" },
  { titulo: "Livros e Café", categoria: "livros", arquivo: "livros-cafe.webp", fotografo: "elinmelaas" , link:"https://unsplash.com/pt-br/fotografias/uma-xicara-de-cafe-esta-sendo-derramada-em-uma-caneca-UsiVoLpTaqI?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"},
  { titulo: "Leitura no Mar", categoria: "livros", arquivo: "livros-mar.webp", fotografo: "reyseven", link:"https://unsplash.com/pt-br/fotografias/livros-marrons-e-pretos-na-prateleira-de-madeira-preta-v1QCJQoD03k?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" },
  { titulo: "Morning Coffee", categoria: "livros", arquivo: "morn-coffee.webp", fotografo: "anniespratt", link:"https://unsplash.com/pt-br/fotografias/lencol-branco-e-cinza-52AAiXWoVi0?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" },
  { titulo: "Orgulho e Preconceito", categoria: "livros", arquivo: "orgulho-preconceito.webp", fotografo: "elainehowlin", link:"https://unsplash.com/pt-br/fotografias/um-livro-sentado-em-cima-de-uma-mesa-ao-lado-de-uma-xicara-de-cha-eNMMw7ihJ2Y?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" },
  { titulo: "Xícara e Livro", categoria: "livros", arquivo: "xicara-livro.webp", fotografo: "sixteenmiles", link:"https://unsplash.com/pt-br/fotografias/caneca-de-ceramica-branca-no-livro-branco-GVhAezjtX-4?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" },

  // --- COZY COFFEE (Originais & Lo-Fi) ---
  { titulo: "Amor em Sinais", categoria: "cozycoffee", arquivo: "amor-sinais.jpg", fotografo: "IA" },
  { titulo: "Banco de Praça", categoria: "cozycoffee", arquivo: "banco.jpg", fotografo: "IA" },
  { titulo: "Barista na Janela", categoria: "cozycoffee", arquivo: "barista-janela.jpg", fotografo: "IA" },
  { titulo: "Pausa do Barista", categoria: "cozycoffee", arquivo: "barista-pausa.jpg", fotografo: "IA" },
  { titulo: "Bíblia", categoria: "cozycoffee", arquivo: "biblia.jpg", fotografo: "IA" },
  { titulo: "Casal Lendo", categoria: "cozycoffee", arquivo: "casal-lendo.jpg", fotografo: "IA" },
  { titulo: "Lo-Fi Night", categoria: "cozycoffee", arquivo: "cc-lo-fi-night.webp", fotografo: "IA" },
  { titulo: "Cozy Lo-Fi", categoria: "cozycoffee", arquivo: "cozy-lofi.webp", fotografo: "IA" },
  { titulo: "Mural Cozy", categoria: "cozycoffee", arquivo: "cozy-mural.webp", fotografo: "IA" },
  { titulo: "Gatinho na Janela", categoria: "cozycoffee", arquivo: "gatinho-janela.jpg", fotografo: "IA" },
  { titulo: "Gato na Xícara", categoria: "cozycoffee", arquivo: "gato-xicara.jpg", fotografo: "IA" },
  { titulo: "Sorriso", categoria: "cozycoffee", arquivo: "hp-grin.jpg", fotografo: "IA" },
  { titulo: "Janela Anime", categoria: "cozycoffee", arquivo: "janela-anime.jpg", fotografo: "IA" },
  { titulo: "Arte Landscape", categoria: "cozycoffee", arquivo: "landscape-arte.jpg", fotografo: "IA" },
  { titulo: "Janela Monocromática", categoria: "cozycoffee", arquivo: "landscape-janelamono.jpg", fotografo: "IA" },
  { titulo: "Menina na Janela", categoria: "cozycoffee", arquivo: "menina-janela.jpg", fotografo: "IA" },
  { titulo: "Namjooning", categoria: "cozycoffee", arquivo: "menina-namjooning.webp", fotografo: "IA" },
  { titulo: "Mesa de Estudos", categoria: "cozycoffee", arquivo: "mesa-estudos.jpg", fotografo: "IA" },
  { titulo: "Namjoon", categoria: "cozycoffee", arquivo: "namjoon.jpg", fotografo: "IA" },
  { titulo: "Notebook Background", categoria: "cozycoffee", arquivo: "notebook-background.jpg", fotografo: "IA" },
  { titulo: "Sofá de Casa", categoria: "cozycoffee", arquivo: "sofa-casa.jpg", fotografo: "IA" },
  { titulo: "Versículo", categoria: "cozycoffee", arquivo: "versiculo.jpg", fotografo: "IA" },
  { titulo: "Zayne Lendo", categoria: "cozycoffee", arquivo: "zayne-lendo.jpg", fotografo: "IA" },


 // --- BTS ---
  { titulo: "Álbuns", categoria: "bts", arquivo: "albuns.webp", fotografo: "IA" },
  { titulo: "Livro", categoria: "bts", arquivo: "bts-livro.webp", fotografo: "IA" },
  { titulo: "Prateleira", categoria: "bts", arquivo: "bts-prateleira.webp", fotografo: "IA" },
  { titulo: "Cafeteria", categoria: "bts", arquivo: "cafeteria-bts.webp", fotografo: "IA" },
  { titulo: "Whale Lo-Fi", categoria: "bts", arquivo: "lo-fi-whale.webp", fotografo: "IA" },
  { titulo: "Namjoon", categoria: "bts", arquivo: "namjoon.webp", fotografo: "IA" },
  { titulo: "Seven Boys", categoria: "bts", arquivo: "seven-boys.webp", fotografo: "IA" },
  { titulo: "Sunrise Whale", categoria: "bts", arquivo: "sunrise-whale.webp", fotografo: "IA" }
];


// ====================================================================================
// 3. FUNÇÕES PURAS (Lógica Matemática)
// ====================================================================================
// Funções que recebem um valor, calculam e devolvem uma resposta.
function formatarTempo(totalSegundos) {
  const pad = (n) => String(n).padStart(2, "0");

  if (totalSegundos >= 3600) {
    const h = Math.floor(totalSegundos / 3600);
    const m = Math.floor((totalSegundos % 3600) / 60);
    const s = totalSegundos % 60;
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }

  const m = Math.floor(totalSegundos / 60);
  const s = totalSegundos % 60;
  return `${pad(m)}:${pad(s)}`;
}


// ====================================================================================
// 4. CAMADA DE UI (Interface do Usuário)
// ====================================================================================
// Funções exclusivas para atualizar o visual do site. Sempre que o Estado Global
function atualizarDisplay() {
  const tempoFormatado = formatarTempo(tempo);
  // Usa o nosso GPS para achar o display, onde quer que ele esteja
  if (displayAtivo) displayAtivo.textContent = tempoFormatado;
  document.title = `☕ ${tempoFormatado} | CozyCoffee`;
}

function atualizarBolinhas() {
  document.querySelectorAll(".dot").forEach((dot, indice) => {
    dot.classList.toggle("active", indice < ciclosPomodoro);
  });
}


// ====================================================================================
// 5. CONTROLE DO TIMER (O Motor)
// ====================================================================================
// Controla o andamento do tempo, as pausas e os reinícios da contagem regressiva.

/**
 * Inicia a contagem regressiva. Possui trava para evitar múltiplos timers rodando.
 */
function alternarTimer() {
  if (intervalo) {
    // Ação de Pausar
    clearInterval(intervalo);
    intervalo = null;
    if (botaoStartAtivo) botaoStartAtivo.innerText = "INICIAR";
  } else {
    // Ação de Iniciar
    intervalo = setInterval(() => {
      if (tempo > 0) {
        tempo--;
        atualizarDisplay();
      } else {
        clearInterval(intervalo);
        intervalo = null;
        if (botaoStartAtivo) botaoStartAtivo.innerText = "INICIAR";
        
        const som = document.getElementById("sound-end-timer");
        if (som) som.play();
        
        iniciarProximoModo();
      }
    }, 1000);
    if (botaoStartAtivo) botaoStartAtivo.innerText = "PAUSAR";
  }
}

function resetarTimer() {
  clearInterval(intervalo);
  intervalo = null;
  if (botaoStartAtivo) botaoStartAtivo.innerText = "INICIAR";

  const temposPadrao = {
    "pomodoro":    tempoPomodoroPadrao,
    "pausa-curta": tempoPausaCurtaPadrao,
    "pausa-longa": tempoPausaLongaPadrao,
  };
  tempo = temposPadrao[modoAtual] ?? tempoPomodoroPadrao;

  ciclosPomodoro = 0;
  atualizarBolinhas();
  atualizarDisplay();
}

// ====================================================================================
// 6. CONTROLE DE MODO E CICLOS
// ====================================================================================

function trocarModo(botao) {
  document.querySelectorAll(".modo-botao").forEach((b) => b.classList.remove("ativo"));
  botao.classList.add("ativo");

  modoAtual = botao.id;

  const temposPadrao = {
    "pomodoro":    tempoPomodoroPadrao,
    "pausa-curta": tempoPausaCurtaPadrao,
    "pausa-longa": tempoPausaLongaPadrao,
  };
  tempo = temposPadrao[modoAtual] ?? tempoPomodoroPadrao;

  clearInterval(intervalo);
  intervalo = null;
  if (botaoStartAtivo) botaoStartAtivo.innerText = "INICIAR";

  atualizarDisplay(); 
}

function iniciarProximoModo() {
  const btnPomodoro   = document.getElementById("pomodoro");
  const btnPausaCurta = document.getElementById("pausa-curta");
  const btnPausaLonga = document.getElementById("pausa-longa");

  if (modoAtual === "pomodoro") {
    ciclosPomodoro++;
    atualizarBolinhas();
    trocarModo(ciclosPomodoro % 4 === 0 ? btnPausaLonga : btnPausaCurta);
  } else {
    if (modoAtual === "pausa-longa") {
      ciclosPomodoro = 0;
      atualizarBolinhas();
    }
    trocarModo(btnPomodoro);
  }

  setTimeout(alternarTimer, 1000);
}

// ====================================================================================
// 7. GALERIA DE FUNDOS
// ====================================================================================
// Lógica para renderizar o menu dinamicamente e aplicar o background escolhido.
function aplicarBackground(item) {
  const caminho = `assets/backgrounds/${item.categoria}/${item.arquivo}`;
  document.body.style.backgroundImage = `url('${caminho}')`;
  localStorage.setItem("fundoSalvoCozyCoffee", caminho);

  const creditos = document.getElementById("creditos-autor");
  if (creditos) {
    if (item.fotografo !== "") {
      
      const destinoDoClique = item.link ? item.link : caminho;

      creditos.innerHTML = `<a href="${destinoDoClique}" target="_blank" rel="noopener noreferrer">foto por @${item.fotografo}</a>`;
      
      
      creditos.style.pointerEvents = "auto"; 
      creditos.style.display = "block";
      
    } else {
      creditos.style.display = "none";
    }
  }
}
function renderizarGaleria() {
  const container = document.getElementById("galeria-fundos");
  if (!container) return;

  container.innerHTML = "";
  const categorias = [...new Set(bancoDeDadosBackgrounds.map((item) => item.categoria))];

  categorias.forEach((categoria) => {
    const section = document.createElement("section");
    section.className = "categoria-fundo";

    const titulo = document.createElement("h4");
    if (categoria === "cafeteria") titulo.innerText = "CAFÉ";
    else if (categoria === "dark-academy") titulo.innerText = "DARK ACADEMIA";
    else if (categoria === "fantasia") titulo.innerText = "FANTASIA";
    else if (categoria === "landscape") titulo.innerText = "LANDSCAPE";
    else if (categoria === "livros") titulo.innerText = "LIVROS";
    else if (categoria === "cozycoffee") titulo.innerText = "COZYCOFFEE ORIGINAL";
    else if (categoria === "bts") titulo.innerText = "BTS";
    else titulo.innerText = categoria;
    
    section.appendChild(titulo);

    const grid = document.createElement("div");
    grid.className = "grid-fotos";

    bancoDeDadosBackgrounds
      .filter((item) => item.categoria === categoria)
      .forEach((item) => {
        const miniatura = document.createElement("div");
        miniatura.className = "fundo-miniatura";
        miniatura.style.backgroundImage = `url('assets/backgrounds/${item.categoria}/${item.arquivo}')`;
        miniatura.addEventListener("click", () => aplicarBackground(item));
        grid.appendChild(miniatura);
      });

    section.appendChild(grid);
    container.appendChild(section);
  });
}

// ====================================================================================
// 8. INICIALIZAÇÃO E EVENTOS (O Ponto de Partida)
// ====================================================================================
// Este bloco só roda quando o HTML está 100% carregado. Ele "liga" os botões
// às suas funções e restaura os dados que o usuário salvou em visitas anteriores.

window.addEventListener("DOMContentLoaded", () => {

  // --- SELETORES DE ELEMENTOS ---
  const timerDisplay     = document.getElementById("timer-display");
  const startBtn         = document.getElementById("start");
  const resetBtn         = document.getElementById("reset");
  const botoesModo       = document.querySelectorAll(".modo-botao");
  const botaoMudarFundo  = document.getElementById("background");
  const menuFundos       = document.getElementById("menu-fundos");
  const btnFecharGaleria = document.getElementById("btn-fechar-galeria");
  const botaoConfig      = document.getElementById("configuracao");
  const menuConfig       = document.getElementById("menu-configuracao");
  const botaoFecharConfig = document.getElementById("fechar-config");
  const botaoSalvarConfig = document.getElementById("salvar-config");
  const inputPomodoro    = document.getElementById("input-pomodoro");
  const inputPausaCurta  = document.getElementById("input-pausa-curta");
  const inputPausaLonga  = document.getElementById("input-pausa-longa");
  const pipBtn           = document.getElementById("picture-in-picture");
  const botaoTelaCheia   = document.querySelector(".botao-fullscreen");
  const botaoMinScreen   = document.querySelector(".botao-minscreen");

  // Ligando o GPS Inicial!
  displayAtivo = timerDisplay;
  botaoStartAtivo = startBtn;


  // --- CARREGAMENTO DE DADOS SALVOS (localStorage) ---
  const pomodoroPersistido   = localStorage.getItem("tempoPomodoro");
  const pausaCurtaPersistida = localStorage.getItem("tempoPausaCurta");
  const pausaLongaPersistida = localStorage.getItem("tempoPausaLonga");

  if (pomodoroPersistido)   tempoPomodoroPadrao   = parseInt(pomodoroPersistido,   10);
  if (pausaCurtaPersistida) tempoPausaCurtaPadrao = parseInt(pausaCurtaPersistida, 10);
  if (pausaLongaPersistida) tempoPausaLongaPadrao = parseInt(pausaLongaPersistida, 10);

  if (inputPomodoro)   inputPomodoro.value   = tempoPomodoroPadrao   / 60;
  if (inputPausaCurta) inputPausaCurta.value = tempoPausaCurtaPadrao / 60;
  if (inputPausaLonga) inputPausaLonga.value = tempoPausaLongaPadrao / 60;

  const fundoSalvo = localStorage.getItem("fundoSalvoCozyCoffee");
  if (fundoSalvo) document.body.style.backgroundImage = `url('${fundoSalvo}')`;


  // --- EVENTOS: TELA CHEIA ---
  if (botaoTelaCheia) {
    botaoTelaCheia.addEventListener("click", () => {
      if      (document.documentElement.requestFullscreen)       document.documentElement.requestFullscreen();
      else if (document.documentElement.webkitRequestFullscreen) document.documentElement.webkitRequestFullscreen();
      else if (document.documentElement.msRequestFullscreen)     document.documentElement.msRequestFullscreen();
    });
  }

  if (botaoMinScreen) {
    botaoMinScreen.addEventListener("click", () => {
      if      (document.exitFullscreen)       document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.msExitFullscreen)     document.msExitFullscreen();
    });
  }

  function handleFullscreenChange() {
    const emFullscreen = !!document.fullscreenElement;
    botaoTelaCheia?.classList.toggle("escondido",  emFullscreen);
    botaoMinScreen?.classList.toggle("escondido",  !emFullscreen);
  }

  document.addEventListener("fullscreenchange",       handleFullscreenChange);
  document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
  document.addEventListener("msfullscreenchange",     handleFullscreenChange);


  // --- EVENTOS: CONTROLES DO TIMER ---
  // AQUI FOI ONDE CONSERTAMOS O BUG DO CLIQUE
  startBtn?.addEventListener("click", alternarTimer);
  resetBtn?.addEventListener("click", resetarTimer);

  botoesModo.forEach((botao) => {
    botao.addEventListener("click", () => trocarModo(botao));
  });


  // --- EVENTOS: MENUS (Configurações e Fundos) ---
  botaoMudarFundo?.addEventListener("click", () => menuFundos?.classList.remove("escondido"));
  btnFecharGaleria?.addEventListener("click", () => menuFundos?.classList.add("escondido"));

  botaoConfig?.addEventListener("click", () => menuConfig?.classList.remove("escondido"));
  botaoFecharConfig?.addEventListener("click", () => menuConfig?.classList.add("escondido"));

  botaoSalvarConfig?.addEventListener("click", () => {
    const novoPomodoro   = parseInt(inputPomodoro.value,   10) * 60;
    const novaPausaCurta = parseInt(inputPausaCurta.value, 10) * 60;
    const novaPausaLonga = parseInt(inputPausaLonga.value, 10) * 60;

    if (!novoPomodoro || !novaPausaCurta || !novaPausaLonga ||
        novoPomodoro <= 0 || novaPausaCurta <= 0 || novaPausaLonga <= 0) {
      alert("Por favor, insira valores maiores que zero em todos os campos.");
      return; 
    }

    tempoPomodoroPadrao   = novoPomodoro;
    tempoPausaCurtaPadrao = novaPausaCurta;
    tempoPausaLongaPadrao = novaPausaLonga;

    localStorage.setItem("tempoPomodoro",   tempoPomodoroPadrao);
    localStorage.setItem("tempoPausaCurta", tempoPausaCurtaPadrao);
    localStorage.setItem("tempoPausaLonga", tempoPausaLongaPadrao);

    menuConfig?.classList.add("escondido");
    resetarTimer(); 
  });


  // --- EVENTOS: PICTURE IN PICTURE ---
  if (pipBtn) {
    pipBtn.addEventListener("click", async () => {
      if (!("documentPictureInPicture" in window)) {
        alert("Seu navegador não suporta Picture-in-Picture de documentos ainda.");
        return;
      }

      try {
        const pipWindow = await window.documentPictureInPicture.requestWindow({
          width: 320, height: 350,
        });

        const linkFonte = pipWindow.document.createElement("link");
        linkFonte.rel = "stylesheet";
        linkFonte.href = "https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&display=swap";
        pipWindow.document.head.appendChild(linkFonte);

        [...document.styleSheets].forEach((sheet) => {
          try {
            const css = [...sheet.cssRules].map((r) => r.cssText).join("");
            const style = document.createElement("style");
            style.textContent = css;
            pipWindow.document.head.appendChild(style);
          } catch (_) { }
        });

        const display   = document.getElementById("timer-display");
        const controles = document.querySelector(".botoes-controle");

        const placeholder = document.createElement("div");
        display.parentNode.insertBefore(placeholder, display);

        const fundoAtual = document.body.style.backgroundImage;
        
        const pipContainer = document.createElement("div");
        pipContainer.classList.add("timer-pip-mode");
        
        Object.assign(pipContainer.style, {
          backgroundImage: fundoAtual,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
          position: "relative" 
        });
        
        const overlayPip = document.createElement("div");
        overlayPip.classList.add("pip-overlay");

        // Montamos com o fundo certo de primeira!
        pipContainer.append(overlayPip, display, controles);
        pipWindow.document.body.append(pipContainer);
        
        // Atualiza o GPS!
        displayAtivo = display;
        botaoStartAtivo = startBtn;

        pipWindow.addEventListener("pagehide", () => {
          placeholder.parentNode.insertBefore(display,   placeholder);
          placeholder.parentNode.insertBefore(controles, placeholder);
          placeholder.remove();

          // Restaura o GPS para a tela inicial
          displayAtivo = display;
          botaoStartAtivo = startBtn;
          atualizarDisplay();
        });

      } catch (erro) {
        console.error("Erro ao abrir PiP:", erro);
      }
    });
  }

  // --- RENDERIZAÇÃO INICIAL ---
  renderizarGaleria();
  resetarTimer();

});