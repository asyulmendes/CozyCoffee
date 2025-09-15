// ===================================================================
// VARIÁVEIS E CONSTANTES GLOBAIS
// ===================================================================

let tempo = 25 * 60;
let intervalo = null;
let modoAtual = "pomodoro";
let ciclosPomodoro = 0;
let indiceFundoAtual = 0;

// Seleciona os elementos PRINCIPAIS do HTML. O resto será selecionado depois.
const timer = document.getElementById("timer-display");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const botoesModo = document.querySelectorAll(".modo-botao");

// Lista de fundos como uma lista SIMPLES de caminhos.
const fundosDeTela = [
    'assets/backgrounds/amigas-cafe.jpg',
    'assets/backgrounds/barista-cerejeira.jpg',
    'assets/backgrounds/barista-homem.jpg',
    'assets/backgrounds/barista-pausa.jpg',
    'assets/backgrounds/biblia.jpg',
    'assets/backgrounds/cafe-padroes.png',
    'assets/backgrounds/casal-lendo.jpg',
    'assets/backgrounds/casal.jpg',
    'assets/backgrounds/devocional.jpg',
    'assets/backgrounds/jardim-encantado-garota.jpg',
    'assets/backgrounds/jovem-jardim.jpg',
    'assets/backgrounds/menina-devocional.jpg',
    'assets/backgrounds/mesa-estudos.jpg',
    'assets/backgrounds/notebook-background.jpg',
    'assets/backgrounds/padrao-cafeteria.jpg',
    'assets/backgrounds/sofa-casa.jpg',
    'assets/backgrounds/versiculo.jpg',
    'assets/backgrounds/zayne-lendo.jpg',
    'assets/backgrounds/barista-janela.jpg',
    'assets/backgrounds/cafes-gatos.jpg',
    'assets/backgrounds/garoto-sentado.jpg',
    'assets/backgrounds/gatinho-janela.jpg',
    'assets/backgrounds/hp-grin.jpg',
    'assets/backgrounds/janela-anime.jpg',
    'assets/backgrounds/landscape-arte.jpg',
    'assets/backgrounds/landscape-chuvososofa.jpg',
    'assets/backgrounds/landscape-janelamono.jpg',
    'assets/backgrounds/namjoon.jpg',
    'assets/backgrounds/padrao-gatoscafe.jpg',
    'assets/backgrounds/rhys-feyre.jpg',
    'assets/backgrounds/sofa-magico.jpg',
];

// ===================================================================
// FUNÇÕES DO PROJETO
// ===================================================================

function atualizarDisplay() {
    const minutos = Math.floor(tempo / 60);
    const segundos = tempo % 60;
    const tempoFormatado = `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
    timer.textContent = tempoFormatado;
    document.title = `☕ ${tempoFormatado} | CozyCoffee`;
}

function IniciarTimer() {
    if (intervalo) return;
    intervalo = setInterval(() => {
        if (tempo > 0) {
            tempo--;
            atualizarDisplay();
        } else {
            clearInterval(intervalo);
            intervalo = null;
            const sound = document.getElementById("sound-end-timer");
            if (sound) sound.play();
            iniciarProximoModo();
        }
    }, 1000);
}

function pausarTimer() {
    clearInterval(intervalo);
    intervalo = null;
}

function resetarTimer() {
    pausarTimer();
    if (modoAtual === "pomodoro") tempo = 25 * 60;
    else if (modoAtual === "pausa-curta") tempo = 5 * 60;
    else if (modoAtual === "pausa-longa") tempo = 15 * 60;
    atualizarDisplay();
}

function trocarModo(botao) {
    botoesModo.forEach(b => b.classList.remove("ativo"));
    botao.classList.add("ativo");
    modoAtual = botao.id;
    if (botao.id === "pomodoro") tempo = 25 * 60;
    if (botao.id === "pausa-curta") tempo = 5 * 60;
    if (botao.id === "pausa-longa") tempo = 15 * 60;
    pausarTimer();
    atualizarDisplay();
}

function iniciarProximoModo() {
    if (modoAtual === 'pomodoro') {
        ciclosPomodoro++;
        if (ciclosPomodoro % 4 === 0) {
            trocarParaModo('pausa-longa');
        } else {
            trocarParaModo('pausa-curta');
        }
    } else {
        trocarParaModo('pomodoro');
    }
    setTimeout(IniciarTimer, 1000);
}

function trocarParaModo(idModo) {
    const botaoAlvo = document.getElementById(idModo);
    if (botaoAlvo) {
        trocarModo(botaoAlvo);
    }
}

// ===================================================================
// CÓDIGO QUE RODA APÓS O HTML ESTAR 100% CARREGADO
// ===================================================================

window.addEventListener('DOMContentLoaded', () => {

    // --- Seletores de Elementos ---
    const botaoMudarFundo = document.getElementById('background');
    const menuFundos = document.getElementById('menu-fundos');
    const galeriaFundos = document.getElementById('galeria-fundos');
    const botaoFecharMenu = document.getElementById('fechar-menu');

    // --- Event Listeners ---
    startBtn.addEventListener("click", IniciarTimer);
    pauseBtn.addEventListener("click", pausarTimer);
    resetBtn.addEventListener("click", resetarTimer);
    botoesModo.forEach(botao => {
        botao.addEventListener("click", () => trocarModo(botao));
    });

    // --- Lógica do Menu de Fundos (Simplificada) ---
    if (botaoMudarFundo) {
        botaoMudarFundo.addEventListener('click', () => {
            menuFundos.classList.remove('escondido');
        });
    }

    if (botaoFecharMenu) {
        botaoFecharMenu.addEventListener('click', () => {
            menuFundos.classList.add('escondido');
        });
    }

    if (galeriaFundos) {
        fundosDeTela.forEach((caminhoDaImagem, indice) => {
            const miniatura = document.createElement('div');
            miniatura.classList.add('miniatura-fundo');
            miniatura.style.backgroundImage = `url('${caminhoDaImagem}')`;
            miniatura.dataset.indice = indice;

            miniatura.addEventListener('click', () => {
                const fundoEscolhido = fundosDeTela[indice];
                document.body.style.backgroundImage = `url('${fundoEscolhido}')`;
                localStorage.setItem('fundoSalvoCozyCoffee', fundoEscolhido);
                menuFundos.classList.add('escondido');
            });
            galeriaFundos.appendChild(miniatura);
        });
    }

    // --- Carregamento Inicial (LocalStorage) ---
    const fundoSalvo = localStorage.getItem('fundoSalvoCozyCoffee');
    if (fundoSalvo) {
        document.body.style.backgroundImage = `url('${fundoSalvo}')`;
    }

    // --- Inicialização do Display ---
    atualizarDisplay();
});