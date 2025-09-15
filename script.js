// ===================================================================
// VARIÁVEIS GLOBAIS QUE NÃO DEPENDEM DO HTML
// ===================================================================
let tempo = 25 * 60;
let intervalo = null;
let modoAtual = "pomodoro";
let ciclosPomodoro = 0;
let indiceFundoAtual = 0;

// Lista de fundos como uma lista SIMPLES de caminhos.
const fundosDeTela = [
    'assets/backgrounds/amigas-cafe.jpg',
    'assets/backgrounds/barista-janela.jpg',
    'assets/backgrounds/cafes-gatos.jpg',
    'assets/backgrounds/garoto-sentado.jpg',
    'assets/backgrounds/gatinho-janela.jpg',
    'assets/backgrounds/hp-grin.jpg',
    'assets/backgrounds/janela-anime.jpg',
    'assets/backgrounds/landscape-arte.jpg',
    'assets/backgrounds/landscape-janelamono.jpg',
    'assets/backgrounds/namjoon.jpg',
    'assets/backgrounds/padrao-gatoscafe.jpg',
    'assets/backgrounds/rhys-feyre.jpg',
    'assets/backgrounds/barista-cerejeira.jpg',
    'assets/backgrounds/biblia.jpg',
    'assets/backgrounds/cafe-padroes.png',
    'assets/backgrounds/casal-lendo.jpg',
    'assets/backgrounds/casal.jpg',
    'assets/backgrounds/devocional.jpg',
    'assets/backgrounds/versiculo.jpg',
    'assets/backgrounds/zayne-lendo.jpg'
];

// ===================================================================
// FUNÇÕES DO PROJETO (Elas podem ser declaradas aqui fora)
// ===================================================================

function atualizarDisplay(elementoTimer) {
    const minutos = Math.floor(tempo / 60);
    const segundos = tempo % 60;
    const tempoFormatado = `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
    if(elementoTimer) elementoTimer.textContent = tempoFormatado;
    document.title = `☕ ${tempoFormatado} | CozyCoffee`;
}

// NOTE: As outras funções (IniciarTimer, pausarTimer, etc.) usarão as
// variáveis de elementos que serão definidas DENTRO do DOMContentLoaded.
// Isso funciona porque elas só são CHAMADAS depois que os eventos de clique são adicionados.

// ===================================================================
// CÓDIGO PRINCIPAL QUE RODA APÓS O HTML ESTAR 100% CARREGADO
// ===================================================================

window.addEventListener('DOMContentLoaded', () => {

    // --- SELETORES DE ELEMENTOS (LUGAR CORRETO E SEGURO) ---
    const timer = document.getElementById("timer-display");
    const startBtn = document.getElementById("start");
    const pauseBtn = document.getElementById("pause");
    const resetBtn = document.getElementById("reset");
    const botoesModo = document.querySelectorAll(".modo-botao");
    const botaoMudarFundo = document.getElementById('background');
    const menuFundos = document.getElementById('menu-fundos');
    const galeriaFundos = document.getElementById('galeria-fundos');
    const botaoFecharMenu = document.getElementById('fechar-menu');
    
    // --- FUNÇÕES QUE DEPENDEM DIRETAMENTE DOS ELEMENTOS ---
    // Colocamos a definição delas aqui dentro para garantir que usem as
    // constantes corretas que acabamos de definir.

    function IniciarTimer() {
        if (intervalo) return;
        intervalo = setInterval(() => {
            if (tempo > 0) {
                tempo--;
                atualizarDisplay(timer);
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
        atualizarDisplay(timer);
    }

    function trocarModo(botao) {
        botoesModo.forEach(b => b.classList.remove("ativo"));
        botao.classList.add("ativo");
        modoAtual = botao.id;
        if (botao.id === "pomodoro") tempo = 25 * 60;
        if (botao.id === "pausa-curta") tempo = 5 * 60;
        if (botao.id === "pausa-longa") tempo = 15 * 60;
        pausarTimer();
        atualizarDisplay(timer);
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

    // --- EVENT LISTENERS ---
    startBtn.addEventListener("click", IniciarTimer);
    pauseBtn.addEventListener("click", pausarTimer);
    resetBtn.addEventListener("click", resetarTimer);
    botoesModo.forEach(botao => {
        botao.addEventListener("click", () => trocarModo(botao));
    });

    
if (botaoMudarFundo) {
    botaoMudarFundo.addEventListener('click', () => {
        menuFundos.classList.remove('escondido');
        botaoFecharMenu.classList.remove('escondido'); // MOSTRAR o botão de fechar
    });
}

if (botaoFecharMenu) {
    botaoFecharMenu.addEventListener('click', () => {
        menuFundos.classList.add('escondido');
        botaoFecharMenu.classList.add('escondido'); // ESCONDER o botão de fechar
    });
}

    // --- LÓGICA DO MENU DE FUNDOS ---
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

    // --- CARREGAMENTO INICIAL (LocalStorage) ---
    const fundoSalvo = localStorage.getItem('fundoSalvoCozyCoffee');
    if (fundoSalvo) {
        document.body.style.backgroundImage = `url('${fundoSalvo}')`;
    }

    // --- INICIALIZAÇÃO DO DISPLAY ---
    atualizarDisplay(timer);
});