// ====================================================================================
// O CÉREBRO DA APLICAÇÃO: VARIÁVEIS GLOBAIS
// ====================================================================================
// Estas são as "gavetas de memória" principais do projeto.
// Elas guardam o estado atual do timer e as configurações.

// Define os tempos padrão em SEGUNDOS. Multiplicar por 60 converte minutos para segundos.
let tempoPomodoroPadrao = 25 * 60;
let tempoPausaCurtaPadrao = 5 * 60;
let tempoPausaLongaPadrao = 15 * 60;

// Variáveis de ESTADO: elas mudam o tempo todo enquanto o usuário interage.
let tempo = tempoPomodoroPadrao; // O contador regressivo principal. Começa com o tempo do Pomodoro.
let intervalo = null; // Guarda o "ID" do nosso timer (do setInterval). É null quando está pausado.
let modoAtual = "pomodoro"; // Diz qual modo está ativo: "pomodoro", "pausa-curta" ou "pausa-longa".
let ciclosPomodoro = 0; // Conta quantos Pomodoros foram completados para saber quando fazer a pausa longa.
let indiceFundoAtual = 0; // Guarda a posição do fundo de tela atual (não usado neste código, mas útil para futuras features).

// barra de progresso ===================================================================================

let bolinhaAtual = 0; // Guarda a posição da bolinha atual na barra de progresso.
function atualizarBolinhas() {
  const dots = document.querySelectorAll(".dot");

  dots.forEach((dot, indice) => {
    if (indice < ciclosPomodoro) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
      });
  }
// Nossa galeria de imagens. Para adicionar um fundo novo, basta adicionar o caminho da imagem aqui!
const fundosDeTela = [
  "assets/backgrounds/amigas-cafe.jpg",
  "assets/backgrounds/amor-sinais.jpg",
  "assets/backgrounds/banco.jpg",
  "assets/backgrounds/barista-homem.jpg",
  "assets/backgrounds/barista-janela.jpg",
  "assets/backgrounds/barista-pausa.jpg",
  "assets/backgrounds/biblia.jpg",
  "assets/backgrounds/café-aconchegante.jpg",
  "assets/backgrounds/cafes-gatos.jpg",
  "assets/backgrounds/casal-lendo.jpg",
  "assets/backgrounds/flores-landscape.jpg",
  "assets/backgrounds/garoto-sentado.jpg",
  "assets/backgrounds/gatinho-janela.jpg",
  "assets/backgrounds/gato-xicara.jpg",
  "assets/backgrounds/hp-grin.jpg",
  "assets/backgrounds/janela-anime.jpg",
  "assets/backgrounds/landscape-arte.jpg",
  "assets/backgrounds/landscape-janelamono.jpg",
  "assets/backgrounds/mesa-estudos.jpg",
  "assets/backgrounds/liyue-montanhas.jpg",
  "assets/backgrounds/namjoon.jpg",
  "assets/backgrounds/notebook-background.jpg",
  "assets/backgrounds/sofa-casa.jpg",
  "assets/backgrounds/versiculo.jpg",
  "assets/backgrounds/zayne-lendo.jpg",
  "assets/backgrounds/ceus-moon.jpg",
  "assets/backgrounds/chuva-tokio.jpg",
  "assets/backgrounds/corredor-dark.jpg",
  "assets/backgrounds/escritório-verde.jpg",
  "assets/backgrounds/landscape-arvores.jpg",
  "assets/backgrounds/landscape-notebook.jpg",
  "assets/backgrounds/library-dark.jpg",
  "assets/backgrounds/menina-cafe.jpg",
  "assets/backgrounds/menina-janela.jpg",
  "assets/backgrounds/montanha.jpg",
  "assets/backgrounds/office-dark.jpg",
  "assets/backgrounds/office-livros.jpg",
  "assets/backgrounds/office-poltronas.jpg",
  "assets/backgrounds/por-do-sol-montanha.jpg",
  "assets/backgrounds/rio-landscape.jpg",
  "assets/backgrounds/study-w-me.jpg",
  "assets/backgrounds/sumero-estudo.jpg",
  "assets/backgrounds/favonius-landscape.jpg",
  "assets/backgrounds/favonios-jardim.jpg",
];

// ====================================================================================
// AS FERRAMENTAS: FUNÇÕES DO PROJETO
// ====================================================================================
// Funções são como "receitas" de código que podemos chamar várias vezes.

/**
 * Atualiza o tempo no centro da tela e no título da aba do navegador.
 * @param {HTMLElement} elementoTimer - A "caixinha" no HTML (a <div>) onde o tempo aparece.
 */
function atualizarDisplay(elementoTimer) {
  let tempoFormatado; // Variável para guardar o tempo final

  // Formato de horas
  if (tempo >= 3600) {
    // A matemática para HH:MM:SS
    const horas = Math.floor(tempo / 3600);
    const minutos = Math.floor((tempo % 3600) / 60);
    const segundos = tempo % 60;

    // Formata o tempo com horas, garantindo sempre 2 dígitos
    tempoFormatado = `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
  }
  //  (se for menos de 1 hora)...
  else {
    const minutos = Math.floor(tempo / 60);
    const segundos = tempo % 60;

    // Formata o tempo só com minutos e segundos
    tempoFormatado = `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
  }

  // aplicando o resultado na tela e na aba
  if (elementoTimer) elementoTimer.textContent = tempoFormatado;
  document.title = `☕ ${tempoFormatado} | CozyCoffee`;
}

/**
  Inicia a contagem regressiva.
 */
function IniciarTimer() {
  // Essa linha é uma "trava de segurança". Se o 'intervalo' já tem um valor,
  // significa que o timer já está rodando. O 'return' impede que a função continue,
  // evitando que múltiplos timers rodem ao mesmo tempo (o que causaria bugs).
  if (intervalo) return;

  // setInterval é uma ordem para o navegador:
  // "Execute o código a seguir a cada 1000 milissegundos (ou seja, 1 segundo)".
  // Guardamos o ID dessa ordem na variável 'intervalo' para podermos pará-la depois.
  intervalo = setInterval(() => {
    if (tempo > 0) {
      tempo--; // Se o tempo não acabou, diminui 1 segundo.
      atualizarDisplay(document.getElementById("timer-display")); // E atualiza o timer.
    } else {
      // Se o tempo chegou a zero:
      clearInterval(intervalo); // Manda o navegador PARAR a ordem de antes.
      intervalo = null; // "Limpa" a variável para indicar que o timer está parado.
      const sound = document.getElementById("sound-end-timer"); // Pega o elemento de áudio.
      if (sound) sound.play(); // Toca o som de alarme.
      iniciarProximoModo(); // Chama a função que prepara o próximo ciclo (pausa ou pomodoro).
    }
  }, 1000);
}

/**
 * O FREIO: Pausa a contagem regressiva.
 */
function pausarTimer() {
  clearInterval(intervalo); // Simplesmente manda o navegador parar o timer.
  intervalo = null; // E avisa nosso código que não há mais timer rodando.
}

/**
 * O BOTÃO DE REINICIAR: Volta o tempo para o valor inicial do modo atual.
 */
function resetarTimer() {
  pausarTimer(); // Primeiro, garantimos que o timer pare.

  // Usamos um 'if/else if' para verificar qual modo está ativo
  // e carregar o tempo padrão correspondente na variável 'tempo'.
  if (modoAtual === "pomodoro") tempo = tempoPomodoroPadrao;
  else if (modoAtual === "pausa-curta") tempo = tempoPausaCurtaPadrao;
  else if (modoAtual === "pausa-longa") tempo = tempoPausaLongaPadrao;

  bolinhaAtual = 0; // Reseta a barra de progresso.
  ciclosPomodoro = 0; // Reseta o contador de ciclos.
  atualizarBolinhas(); // Atualiza a barra de progresso.

  // Finalmente, atualizamos o placar com o tempo reiniciado.
  atualizarDisplay(document.getElementById("timer-display"));
}

/**
 * O SELETOR DE MODO: Muda o estado do timer quando o usuário clica em um dos botões de modo.
 * @param {HTMLElement} botao - O botão específico que o usuário clicou (pomodoro, pausa-curta, etc.).
 */
function trocarModo(botao) {
  // Pega TODOS os botões de modo.
  const botoesModo = document.querySelectorAll(".modo-botao");
  // Passa por cada um deles e remove a classe "ativo" (para o estilo visual).
  botoesModo.forEach((b) => b.classList.remove("ativo"));
  // Adiciona a classe "ativo" APENAS no botão que foi clicado.
  botao.classList.add("ativo");

  // Atualiza a variável que controla o modo atual com o ID do botão clicado.
  modoAtual = botao.id;

  // Define o tempo inicial de acordo com o novo modo.
  if (botao.id === "pomodoro") tempo = tempoPomodoroPadrao;
  if (botao.id === "pausa-curta") tempo = tempoPausaCurtaPadrao;
  if (botao.id === "pausa-longa") tempo = tempoPausaLongaPadrao;

  pausarTimer(); // Por segurança, o timer é pausado ao trocar de modo.
  atualizarDisplay(document.getElementById("timer-display")); // Atualiza o placar.
}

function iniciarProximoModo() {

    const btnPomodoro = document.getElementById("pomodoro");
    const btnPausaCurta = document.getElementById("pausa-curta");
    const btnPausaLonga = document.getElementById("pausa-longa");

  if (modoAtual === "pomodoro") {
    ciclosPomodoro++; 
    atualizarBolinhas(); 

    if (ciclosPomodoro % 4 === 0) {
      trocarModo(btnPausaLonga); 
    } else {
      trocarModo(btnPausaCurta); 
    }
  } else {
    if (modoAtual === "pausa-longa") {
      ciclosPomodoro = 0; 
      atualizarBolinhas();
    } 
    trocarModo(btnPomodoro);
  }
 
  setTimeout(IniciarTimer, 1000);
}

// ====================================================================================
// O PONTO DE PARTIDA DE TUDO: CÓDIGO PRINCIPAL
// ====================================================================================
// O 'DOMContentLoaded' é um evento que o navegador dispara quando a página HTML
// foi completamente ca'rregada. Colocamos nosso código principal aqui dentro para garantir
// que ele só vai rodar quando todos os botões e divs já existirem na página.

window.addEventListener("DOMContentLoaded", () => {
  // --- A CAIXA DE FERRAMENTAS: SELETORES DE ELEMENTOS ---
  // Guardamos os elementos do HTML em variáveis para acessá-los de forma fácil e rápida.
  const timer = document.getElementById("timer-display");
  const startBtn = document.getElementById("start");
  const pauseBtn = document.getElementById("pause");
  const resetBtn = document.getElementById("reset");
  const botoesModo = document.querySelectorAll(".modo-botao");
  const botaoMudarFundo = document.getElementById("background");
  const menuFundos = document.getElementById("menu-fundos");
  const galeriaFundos = document.getElementById("galeria-fundos");
  const botaoFecharMenu = document.getElementById("fechar-menu");
  const botaoConfig = document.getElementById("configuracao");
  const menuConfig = document.getElementById("menu-configuracao");
  const botaoFecharConfig = document.getElementById("fechar-config");
  const botaoSalvarConfig = document.getElementById("salvar-config");
  const inputPomodoro = document.getElementById("input-pomodoro");
  const inputPausaCurta = document.getElementById("input-pausa-curta");
  const inputPausaLonga = document.getElementById("input-pausa-longa");
  const pipBtn = document.getElementById("pip-button");

  // --- A MEMÓRIA DO USUÁRIO: CARREGANDO DADOS DO localStorage ---
  // O localStorage é um pequeno "depósito" no navegador onde podemos guardar informações
  // que persistem mesmo que o usuário feche a aba.
  const tempoSalvoPomodoro = localStorage.getItem("tempoPomodoro");
  const tempoSalvoPausaCurta = localStorage.getItem("tempoPausaCurta");
  const tempoSalvoPausaLonga = localStorage.getItem("tempoPausaLonga");

  // Verificamos se há algum tempo salvo. Se houver, usamos ele no lugar do padrão.
  if (tempoSalvoPomodoro) tempoPomodoroPadrao = parseInt(tempoSalvoPomodoro);
  if (tempoSalvoPausaCurta)
    tempoPausaCurtaPadrao = parseInt(tempoSalvoPausaCurta);
  if (tempoSalvoPausaLonga)
    tempoPausaLongaPadrao = parseInt(tempoSalvoPausaLonga);

  // Atualiza os 'inputs' no menu de configurações para que eles mostrem os valores atuais (sejam os padrão ou os salvos).
  inputPomodoro.value = tempoPomodoroPadrao / 60;
  inputPausaCurta.value = tempoPausaCurtaPadrao / 60;
  inputPausaLonga.value = tempoPausaLongaPadrao / 60;

  // Carrega o último fundo de tela que o usuário escolheu.
  const fundoSalvo = localStorage.getItem("fundoSalvoCozyCoffee");
  if (fundoSalvo) {
    document.body.style.backgroundImage = `url('${fundoSalvo}')`;
  }

  //  Botão de Tela cheia //

  const botaoTelaCheia = document.querySelector(".botao-fullscreen");
  const botaoMinScreen = document.querySelector(".botao-minscreen");

  // Lógica para entrar na tela cheia//

  if (botaoTelaCheia) {
    botaoTelaCheia.addEventListener("click", () => {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        /* Safari */
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        /* IE11 */
        document.documentElement.msRequestFullscreen();
      }
    });
  }

  // Código para sair da tela cheia //

  if (botaoMinScreen) {
    botaoMinScreen.addEventListener("click", () => {
      console.log("Saindo do modo Tela Cheia!");
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    });
  }
  /// Cérebro da troca //

  function handleFullscreenChange() {
    if (document.fullscreenElement) {
      botaoTelaCheia.classList.add("escondido");
      botaoMinScreen.classList.remove("escondido");
    } else {
      botaoTelaCheia.classList.remove("escondido");
      botaoMinScreen.classList.add("escondido");
    }
  }

  // Diz ao Navegador para chamar a função quando o estado mudar //

  document.addEventListener("fullscreenchange", handleFullscreenChange);
  document.addEventListener("webkitfullscreenchange", handleFullscreenChange); // Para Safari
  document.addEventListener("msfullscreenchange", handleFullscreenChange); // Para IE

  // --- CONECTANDO OS FIOS: EVENT LISTENERS ---
  // 'addEventListener' é o "ouvinte de eventos". Ele fica esperando uma ação do usuário
  // (como um 'click') para disparar uma de nossas funções (a "receita").
  startBtn.addEventListener("click", IniciarTimer);
  pauseBtn.addEventListener("click", pausarTimer);

  // Aqui estava o seu bug! O correto é apenas passar o nome da função ('resetarTimer')
  // como o segundo argumento do "ouvinte".
  resetBtn.addEventListener("click", resetarTimer);

  // Como temos vários botões de modo, passamos por cada um ('forEach')
  // e adicionamos um "ouvinte" de clique individualmente.
  botoesModo.forEach((botao) => {
    botao.addEventListener("click", () => trocarModo(botao));
  });

  // Lógica para abrir/fechar o menu de fundos adicionando/removendo uma classe CSS.
  if (botaoMudarFundo) {
    botaoMudarFundo.addEventListener("click", () => {
      menuFundos.classList.remove("escondido");
    });
  }
  if (botaoFecharMenu) {
    botaoFecharMenu.addEventListener("click", () => {
      menuFundos.classList.add("escondido");
    });
  }

  // Mesma lógica de abrir/fechar para o menu de configurações.
  if (botaoConfig) {
    botaoConfig.addEventListener("click", () => {
      menuConfig.classList.remove("escondido");
    });
  }
  if (botaoFecharConfig) {
    botaoFecharConfig.addEventListener("click", () => {
      menuConfig.classList.add("escondido");
    });
  }

  // Lógica para salvar as novas configurações de tempo quando o usuário clica em "Salvar".
  if (botaoSalvarConfig) {
    botaoSalvarConfig.addEventListener("click", () => {
      // Pega os valores dos inputs (que estão em minutos) e já converte para segundos.
      const novoPomodoro = inputPomodoro.value * 60;
      const novaPausaCurta = inputPausaCurta.value * 60;
      const novaPausaLonga = inputPausaLonga.value * 60;

      // Uma pequena validação para garantir que os tempos não sejam zero ou negativos.
      if (novoPomodoro > 0 && novaPausaCurta > 0 && novaPausaLonga > 0) {
        tempoPomodoroPadrao = novoPomodoro;
        tempoPausaCurtaPadrao = novaPausaCurta;
        tempoPausaLongaPadrao = novaPausaLonga;

        // Salva os novos valores no localStorage para que sejam lembrados na próxima visita.
        localStorage.setItem("tempoPomodoro", tempoPomodoroPadrao);
        localStorage.setItem("tempoPausaCurta", tempoPausaCurtaPadrao);
        localStorage.setItem("tempoPausaLonga", tempoPausaLongaPadrao);
      }
      menuConfig.classList.add("escondido"); // Esconde o menu de configurações.
      resetarTimer(); // Reseta o timer para que ele já use os novos tempos.
    });
  }

  // LÓGICA PARA PICTURE IN  PICTURE ====================================================================

  if (pipBtn) {
    pipBtn.addEventListener("click", async () => {
      if ("documentPictureInPicture" in window) {
        try {
          const pipWindow = await window.documentPictureInPicture.requestWindow(
            {
              width: 320,
              height: 350,
            },
          );

          // Copia os estilos para a nova janela flutuante
          [...document.styleSheets].forEach((styleSheet) => {
            try {
              const cssRules = [...styleSheet.cssRules]
                .map((rule) => rule.cssText)
                .join("");
              const style = document.createElement("style");
              style.textContent = cssRules;
              pipWindow.document.head.appendChild(style);
            } catch (e) {
              const link = document.createElement("link");
              link.rel = "stylesheet";
              link.href = styleSheet.href;
              pipWindow.document.head.appendChild(link);
            }
          });

          // Elementos que vão para o PiP
          const display = document.getElementById("timer-display");
          const controles = document.querySelector(".botoes-controle");

          const pipContainer = document.createElement("div");
          pipContainer.classList.add("timer-pip-mode");

          // Movemos os elementos para a janela PiP
          pipContainer.append(display, controles);
          pipWindow.document.body.append(pipContainer);

          // Quando fechar o PiP, devolve os elementos para o lugar certo
          pipWindow.addEventListener("pagehide", () => {
            const mainContainer = document.querySelector(".container");
            // Insere antes da barra de progresso ou no final do container
            mainContainer.appendChild(display);
            mainContainer.appendChild(controles);
          });
        } catch (error) {
          console.error("Erro ao abrir PiP:", error);
        }
      } else {
        alert("Seu navegador não suporta PiP ainda! Tente no Chrome. 😉");
      }
    });
  }

  // --- CONSTRUINDO A GALERIA MÁGICA: LÓGICA DO MENU DE FUNDOS ---
  // Este trecho cria as fotinhas de miniatura dinamicamente a partir da nossa lista 'fundosDeTela'.
  if (galeriaFundos) {
    fundosDeTela.forEach((caminhoDaImagem, indice) => {
      const miniatura = document.createElement("div"); // Cria uma <div> "do nada".
      miniatura.classList.add("miniatura-fundo"); // Adiciona uma classe para o CSS estilizá-la.
      miniatura.style.backgroundImage = `url('${caminhoDaImagem}')`; // Define a imagem da miniatura.

      // Adiciona um "ouvinte" de clique em cada uma das miniaturas que criamos.
      miniatura.addEventListener("click", () => {
        const fundoEscolhido = fundosDeTela[indice]; // Pega o caminho da imagem clicada.
        document.body.style.backgroundImage = `url('${fundoEscolhido}')`; // Aplica no fundo da página.
        localStorage.setItem("fundoSalvoCozyCoffee", fundoEscolhido); // Salva a escolha no localStorage.
        menuFundos.classList.add("escondido"); // Fecha o menu.
      });
      // Finalmente, "pendura" a miniatura que criamos dentro da galeria no HTML.
      galeriaFundos.appendChild(miniatura);
    });
  }

  // Chamamos a função resetarTimer() uma vez no início de tudo.
  // Isso garante que o placar na tela comece com o valor correto do modo padrão (pomodoro).
  resetarTimer();
});
