// ===================================================================
// VARIÁVEIS E CONSTANTES GLOBAIS
// ===================================================================

let tempo = 25 * 60;  // Armazena o tempo restante do timer em segundos.
let intervalo = null;  // Controla o setInterval para podermos pausar o timer.
let modoAtual = "pomodoro"; // Guarda o modo atual (pomodoro, pausa-curta, pausa-longa).
let ciclosPomodoro = 0; // Conta quantos ciclos de Pomodoro foram concluídos.
let indiceFundoAtual = 0; // Guarda a posição do fundo de tela atual na lista.

// Seleciona os elementos do HTML que vamos manipular.
const timer = document.getElementById("timer-display");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const botoesModo = document.querySelectorAll(".modo-botao");
const botaoMudarFundo = document.getElementById('background');

// Lista com os caminhos para todas as imagens de fundo.
const fundosDeTela = [
    'assets/backgrounds/amigas-cafe.jpg',
    'assets/backgrounds/amigas-devocional.jpg',
    'assets/backgrounds/amigas-jardim.jpg',
    'assets/backgrounds/amigas-pintura.jpg',
    'assets/backgrounds/barista-cerejeira.jpg',
    'assets/backgrounds/barista-homem.jpg',
    'assets/backgrounds/barista-pausa.jpg',
    'assets/backgrounds/biblia.jpg',
    'assets/backgrounds/cafe-padroes.png',
    'assets/backgrounds/casal-lendo.jpg',
    'assets/backgrounds/casal.jpg',
    'assets/backgrounds/cat-cafe.jpg',
    'assets/backgrounds/devocional.jpg',
    'assets/backgrounds/elfo-estudo.jpg',
    'assets/backgrounds/garota-dev.jpg',
    'assets/backgrounds/garoto-estudando.jpg',
    'assets/backgrounds/gatinho-dormindo.jpg',
    'assets/backgrounds/hacker-man.jpg',
    'assets/backgrounds/jardim-encantado-garota.jpg',
    'assets/backgrounds/jovem-jardim.jpg',
    'assets/backgrounds/menina-devocional.jpg',
    'assets/backgrounds/mesa-estudos.jpg',
    'assets/backgrounds/notebook-background.jpg',
    'assets/backgrounds/padrao-cafeteria.jpg',
    'assets/backgrounds/sofa-casa.jpg',
    'assets/backgrounds/textura-abstrata.jpg',
    'assets/backgrounds/versiculo.jpg',
    'assets/backgrounds/zayne-lendo.jpg'
];

// ===================================================================
// FUNÇÕES PRINCIPAIS DO TIMER
// ===================================================================

// Atualiza a exibição do tempo na página e na aba do navegador.
function atualizarDisplay() {
    const minutos = Math.floor(tempo / 60);
    const segundos = tempo % 60;
    const tempoFormatado = `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;

    timer.textContent = tempoFormatado; // Atualiza o tempo na página.
    document.title = `☕ ${tempoFormatado} | CozyCoffee`; // Atualiza o tempo na aba.
}

// Inicia a contagem regressiva do timer.
function IniciarTimer() {
    if (intervalo) return; // Impede que múltiplos timers rodem ao mesmo tempo.

    intervalo = setInterval(() => {
        if (tempo > 0) {
            tempo--; // Diminui um segundo.
            atualizarDisplay(); // Atualiza a tela.
        } else {
            clearInterval(intervalo); // Para o timer quando o tempo chega a zero.
            intervalo = null;
            playSound("sound-end-timer"); // Toca o som de finalização.
            iniciarProximoModo(); // Inicia o próximo ciclo automaticamente.
        }
    }, 1000); // Executa a cada 1000 milissegundos (1 segundo).
}

// Pausa a contagem regressiva do timer.
function pausarTimer() {
    clearInterval(intervalo); // Para o setInterval.
    intervalo = null; // Limpa a variável de controle.
}

// Reseta o timer para o tempo inicial do modo atual.
function resetarTimer() {
    pausarTimer(); // Garante que o timer pare.
    
    // Verifica o modo atual e define o tempo correspondente.
    if (modoAtual === "pomodoro") {
        tempo = 25 * 60;
    } else if (modoAtual === "pausa-curta") {
        tempo = 5 * 60;
    } else if (modoAtual === "pausa-longa") {
        tempo = 15 * 60;
    }
    
    atualizarDisplay(); // Atualiza a tela com o tempo resetado.
}

// ===================================================================
// FUNÇÕES DE LÓGICA DE MODOS
// ===================================================================

// Troca o modo do timer (chamada pelos cliques nos botões).
function trocarModo(botao) {
    botoesModo.forEach(b => b.classList.remove("ativo")); // Remove a classe 'ativo' de todos os botões.
    botao.classList.add("ativo"); // Adiciona a classe 'ativo' ao botão clicado.

    modoAtual = botao.id; // Atualiza a variável de modo atual.

    // Define o tempo com base no ID do botão clicado.
    if (botao.id === "pomodoro") tempo = 25 * 60;
    if (botao.id === "pausa-curta") tempo = 5 * 60;
    if (botao.id === "pausa-longa") tempo = 15 * 60;

    pausarTimer(); // Pausa o timer ao trocar de modo.
    atualizarDisplay(); // Atualiza a tela com o novo tempo.
}

// Decide qual será o próximo modo e o inicia (usado pela automação).
function iniciarProximoModo() {
    if (modoAtual === 'pomodoro') {
        ciclosPomodoro++; // Incrementa o contador de ciclos de foco.
        // A cada 4 ciclos de foco, inicia uma pausa longa. Senão, inicia uma curta.
        if (ciclosPomodoro % 4 === 0) {
            trocarParaModo('pausa-longa');
        } else {
            trocarParaModo('pausa-curta');
        }
    } else {
        // Se uma pausa acabou, volta para o modo de foco.
        trocarParaModo('pomodoro');
    }

    // Espera 1 segundo e inicia o timer do novo modo automaticamente.
    setTimeout(IniciarTimer, 1000);
}

// Função de ajuda que "clica" em um botão de modo para nós.
function trocarParaModo(idModo) {
    const botaoAlvo = document.getElementById(idModo); // Encontra o botão pelo ID.
    if (botaoAlvo) {
        trocarModo(botaoAlvo); // Chama a função principal de troca de modo.
    }
}

// ===================================================================
// FUNÇÕES DE BACKGROUND E SOM
// ===================================================================

// Troca para a próxima imagem de fundo da lista.
function trocarFundo() {
    // Avança o índice e usa o operador '%' para voltar ao início quando chega ao fim.
    indiceFundoAtual = (indiceFundoAtual + 1) % fundosDeTela.length;
    const novoFundo = fundosDeTela[indiceFundoAtual];

    document.body.style.backgroundImage = `url('${novoFundo}')`; // Aplica a nova imagem.
    localStorage.setItem('fundoSalvoCozyCoffee', novoFundo); // Salva a escolha no navegador.
}

// Toca um som com base no ID do elemento <audio>.
function playSound(id) {
    const sound = document.getElementById(id);
    if (sound) {
        sound.play(); // Toca o som se o elemento for encontrado.
    }
}

// ===================================================================
// EVENT LISTENERS (OUVINTES DE EVENTOS)
// ===================================================================

// Adiciona o evento de clique para cada botão de modo.
botoesModo.forEach(botao => {
    botao.addEventListener("click", () => {
        trocarModo(botao);
    });
});

// Adiciona os eventos de clique para os botões de controle.
startBtn.addEventListener("click", IniciarTimer);
pauseBtn.addEventListener("click", pausarTimer);
resetBtn.addEventListener("click", resetarTimer);
if (botaoMudarFundo) {
    botaoMudarFundo.addEventListener('click', trocarFundo);
}

// Roda quando a página termina de carregar o HTML.
window.addEventListener('DOMContentLoaded', () => {
    const fundoSalvo = localStorage.getItem('fundoSalvoCozyCoffee'); // Pega o fundo salvo na memória.
    if (fundoSalvo) {
        document.body.style.backgroundImage = `url('${fundoSalvo}')`; // Aplica o fundo salvo.
        const indiceSalvo = fundosDeTela.indexOf(fundoSalvo); // Sincroniza o índice.
        if (indiceSalvo !== -1) {
            indiceFundoAtual = indiceSalvo;
        }
    }
});

// ===================================================================
// INICIALIZAÇÃO
// ===================================================================

atualizarDisplay(); // Garante que o tempo '25:00' apareça assim que a página carrega.