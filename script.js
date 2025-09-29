// ===================================================================
// VARIÁVEIS GLOBAIS QUE NÃO DEPENDEM DO HTML
// ===================================================================
let tempoPomodoroPadrao = 25 * 60;
let tempoPausaCurtaPadrao = 5 * 60;
let tempoPausaLongaPadrao = 15 * 60;


let tempo = tempoPomodoroPadrao;
let intervalo = null;
let modoAtual = "pomodoro";
let ciclosPomodoro = 0;
let indiceFundoAtual = 0;

// Lista de fundos como uma lista SIMPLES de caminhos.
const fundosDeTela = [
    
  'assets/backgrounds/amigas-cafe.jpg',
  'assets/backgrounds/amor-sinais.jpg',
  'assets/backgrounds/banco.jpg',
  'assets/backgrounds/barista-homem.jpg',
  'assets/backgrounds/barista-janela.jpg',
  'assets/backgrounds/barista-pausa.jpg',
  'assets/backgrounds/biblia.jpg',
  'assets/backgrounds/café-aconchegante.jpg',
  'assets/backgrounds/cafes-gatos.jpg',
  'assets/backgrounds/casal-lendo.jpg',
  'assets/backgrounds/flores-landscape.jpg',
  'assets/backgrounds/garoto-sentado.jpg',
  'assets/backgrounds/gatinho-janela.jpg',
  'assets/backgrounds/gato-xicara.jpg',
  'assets/backgrounds/hp-grin.jpg',
  'assets/backgrounds/janela-anime.jpg',
  'assets/backgrounds/landscape-arte.jpg',
  'assets/backgrounds/landscape-janelamono.jpg',
  'assets/backgrounds/mesa-estudos.jpg',
  'assets/backgrounds/liyue-montanhas.jpg',
  'assets/backgrounds/namjoon.jpg',
  'assets/backgrounds/notebook-background.jpg',
  'assets/backgrounds/sofa-casa.jpg',
  'assets/backgrounds/versiculo.jpg',
  'assets/backgrounds/zayne-lendo.jpg',
 
    
];

// ===================================================================
// FUNÇÕES DO PROJETO
// ===================================================================

/**
 * Atualiza o display do timer na tela e o título da página.
 * @param {HTMLElement} elementoTimer - O elemento HTML onde o tempo será exibido.
 */
function atualizarDisplay(elementoTimer) {
    const minutos = Math.floor(tempo / 60); // Calcula os minutos inteiros.
    const segundos = tempo % 60; // Calcula os segundos restantes.
    // Formata o tempo para sempre ter dois dígitos (ex: 05:09).
    const tempoFormatado = `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
    
    if (elementoTimer) elementoTimer.textContent = tempoFormatado; // Atualiza o texto no HTML.
    document.title = `☕ ${tempoFormatado} | CozyCoffee`; // Atualiza o título da aba do navegador.
}

/**
 * Inicia a contagem regressiva do timer.
 */
function IniciarTimer() {
    // Se o intervalo já estiver rodando, não faz nada. Isso evita criar múltiplos timers.
    if (intervalo) return;

    // Inicia um intervalo que executa a função a cada 1000ms (1 segundo).
    intervalo = setInterval(() => {
        if (tempo > 0) {
            tempo--; // Diminui 1 segundo.
            atualizarDisplay(document.getElementById("timer-display")); // Atualiza a tela.
        } else {
            // Se o tempo chegou a zero:
            clearInterval(intervalo); // Para o contador.
            intervalo = null; // Reseta a variável do intervalo.
            const sound = document.getElementById("sound-end-timer");
            if (sound) sound.play(); // Toca o som de finalização.
            iniciarProximoModo(); // Passa para o próximo modo (pausa ou pomodoro).
        }
    }, 1000);
}

/**
 * Pausa a contagem regressiva do timer.
 */
function pausarTimer() {
    clearInterval(intervalo); // Para o intervalo usando o ID que guardamos.
    intervalo = null; // "Limpa" a variável para indicar que o timer está parado.
}

/**
 * Reseta o timer para o valor inicial do modo atual.
 */
function resetarTimer() {
    pausarTimer(); // Garante que qualquer timer rodando seja parado.
    // Verifica o modo atual e redefine a variável 'tempo' para o valor padrão correspondente.
    if (modoAtual === "pomodoro") tempo = tempoPomodoroPadrao;
    else if (modoAtual === "pausa-curta") tempo = tempoPausaCurtaPadrao;
    else if (modoAtual === "pausa-longa") tempo = tempoPausaLongaPadrao;
    // Atualiza o display para mostrar o tempo resetado.
    atualizarDisplay(document.getElementById("timer-display"));
}

/**
 * Troca o modo do timer (Pomodoro, Pausa Curta, Pausa Longa) quando um botão é clicado.
 * @param {HTMLElement} botao - O botão de modo que foi clicado.
 */
function trocarModo(botao) {
    const botoesModo = document.querySelectorAll(".modo-botao");
    botoesModo.forEach(b => b.classList.remove("ativo")); // Remove a classe 'ativo' de todos os botões.
    botao.classList.add("ativo"); // Adiciona a classe 'ativo' apenas no botão clicado.
    
    modoAtual = botao.id; // Atualiza a variável de estado 'modoAtual'.
    
    // Define o tempo inicial de acordo com o novo modo.
    if (botao.id === "pomodoro") tempo = tempoPomodoroPadrao;
    if (botao.id === "pausa-curta") tempo = tempoPausaCurtaPadrao;
    if (botao.id === "pausa-longa") tempo = tempoPausaLongaPadrao;
    
    pausarTimer(); // Pausa o timer ao trocar de modo.
    atualizarDisplay(document.getElementById("timer-display")); // Atualiza a tela com o novo tempo.
}

/**
 * Inicia o próximo ciclo automaticamente (Pomodoro -> Pausa, Pausa -> Pomodoro).
 */
function iniciarProximoModo() {
    if (modoAtual === 'pomodoro') {
        ciclosPomodoro++; // Incrementa o contador de ciclos.
        // Se completou 4 ciclos, inicia uma pausa longa.
        if (ciclosPomodoro % 4 === 0) {
            trocarParaModo('pausa-longa');
        } else { // Caso contrário, inicia uma pausa curta.
            trocarParaModo('pausa-curta');
        }
    } else { // Se estava em qualquer tipo de pausa, volta para o pomodoro.
        trocarParaModo('pomodoro');
    }
    // Inicia o novo timer automaticamente após uma pequena espera de 1 segundo.
    setTimeout(IniciarTimer, 1000);
}

/**
 * Função auxiliar para encontrar e ativar um modo pelo seu ID.
 * @param {string} idModo - O ID do modo para o qual queremos trocar ('pomodoro', 'pausa-curta', etc).
 */
function trocarParaModo(idModo) {
    const botaoAlvo = document.getElementById(idModo);
    if (botaoAlvo) {
        trocarModo(botaoAlvo);
    }
}

// ===================================================================
// CÓDIGO PRINCIPAL
// Este código só roda quando o HTML está 100% carregado no navegador.
// ===================================================================

window.addEventListener('DOMContentLoaded', () => {

    // --- SELETORES DE ELEMENTOS ---
    // "Pegamos" os elementos do HTML e guardamos em variáveis para poder manipulá-los.
    const timer = document.getElementById("timer-display");
    const startBtn = document.getElementById("start");
    const pauseBtn = document.getElementById("pause");
    const resetBtn = document.getElementById("reset");
    const botoesModo = document.querySelectorAll(".modo-botao");
    const botaoMudarFundo = document.getElementById('background');
    const menuFundos = document.getElementById('menu-fundos');
    const galeriaFundos = document.getElementById('galeria-fundos');
    const botaoFecharMenu = document.getElementById('fechar-menu');
    const botaoConfig = document.getElementById('configuracao');
    const menuConfig = document.getElementById('menu-configuracao');
    const botaoFecharConfig = document.getElementById('fechar-config');
    const botaoSalvarConfig = document.getElementById('salvar-config');
    const inputPomodoro = document.getElementById('input-pomodoro');
    const inputPausaCurta = document.getElementById('input-pausa-curta');
    const inputPausaLonga = document.getElementById('input-pausa-longa');

    // --- CARREGAMENTO INICIAL (LocalStorage) ---
    // Busca os dados salvos no navegador do usuário para personalizar a experiência.
    const tempoSalvoPomodoro = localStorage.getItem('tempoPomodoro');
    const tempoSalvoPausaCurta = localStorage.getItem('tempoPausaCurta');
    const tempoSalvoPausaLonga = localStorage.getItem('tempoPausaLonga');

    // Se houver tempos salvos, atualiza as variáveis padrão com eles.
    if (tempoSalvoPomodoro) tempoPomodoroPadrao = parseInt(tempoSalvoPomodoro);
    if (tempoSalvoPausaCurta) tempoPausaCurtaPadrao = parseInt(tempoSalvoPausaCurta);
    if (tempoSalvoPausaLonga) tempoPausaLongaPadrao = parseInt(tempoSalvoPausaLonga);

    // Atualiza os valores nos inputs do menu de configurações para refletir os tempos atuais.
    inputPomodoro.value = tempoPomodoroPadrao / 60;
    inputPausaCurta.value = tempoPausaCurtaPadrao / 60;
    inputPausaLonga.value = tempoPausaLongaPadrao / 60;
    
    // Carrega o último fundo de tela salvo pelo usuário.
    const fundoSalvo = localStorage.getItem('fundoSalvoCozyCoffee');
    if (fundoSalvo) {
        document.body.style.backgroundImage = `url('${fundoSalvo}')`;
    }

    // --- EVENT LISTENERS ---
    // Conecta as funções aos eventos de clique dos botões.
    startBtn.addEventListener("click", IniciarTimer);
    pauseBtn.addEventListener("click", pausarTimer);
    
    // <<<< AQUI ESTAVA O ERRO >>>>
    // O código original era: resetBtn.addEventListener("click", resetBtn.addEventListener("click", resetarTimer));
    // Isso aninhava um addEventListener dentro do outro, fazendo com que o segundo argumento se tornasse 'undefined' e o evento não funcionasse.
    // A forma correta é simplesmente passar o nome da função que deve ser executada.
    resetBtn.addEventListener("click", resetarTimer);

    // Adiciona um listener para cada botão de modo.
    botoesModo.forEach(botao => {
        botao.addEventListener("click", () => trocarModo(botao));
    });

    // Lógica para abrir e fechar o menu de fundos.
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
    
    // Lógica para abrir e fechar o menu de configurações.
    if (botaoConfig) {
        botaoConfig.addEventListener('click', () => {
            menuConfig.classList.remove('escondido');
        });
    }
    if (botaoFecharConfig) {
        botaoFecharConfig.addEventListener('click', () => {
            menuConfig.classList.add('escondido');
        });
    }

    // Lógica para salvar as novas configurações de tempo.
    if (botaoSalvarConfig) {
        botaoSalvarConfig.addEventListener('click', () => {
            // Pega os valores dos inputs e converte para segundos.
            const novoPomodoro = inputPomodoro.value * 60;
            const novaPausaCurta = inputPausaCurta.value * 60;
            const novaPausaLonga = inputPausaLonga.value * 60;

            // Valida se os valores são positivos antes de salvar.
            if (novoPomodoro > 0 && novaPausaCurta > 0 && novaPausaLonga > 0) {
                tempoPomodoroPadrao = novoPomodoro;
                tempoPausaCurtaPadrao = novaPausaCurta;
                tempoPausaLongaPadrao = novaPausaLonga;

                // Salva os novos valores no localStorage para a próxima visita.
                localStorage.setItem('tempoPomodoro', tempoPomodoroPadrao);
                localStorage.setItem('tempoPausaCurta', tempoPausaCurtaPadrao);
                localStorage.setItem('tempoPausaLonga', tempoPausaLongaPadrao);
            }
            menuConfig.classList.add('escondido'); // Fecha o menu.
            resetarTimer(); // Reseta o timer para refletir as novas configurações.
           
        });
    }

    // --- LÓGICA DO MENU DE FUNDOS ---
    // Cria dinamicamente as miniaturas de fundo de tela na galeria.
    if (galeriaFundos) {
        fundosDeTela.forEach((caminhoDaImagem, indice) => {
            const miniatura = document.createElement('div'); // Cria um novo elemento <div>.
            miniatura.classList.add('miniatura-fundo'); // Adiciona a classe de estilo.
            miniatura.style.backgroundImage = `url('${caminhoDaImagem}')`; // Define a imagem da miniatura.
            
            // Adiciona um evento de clique em cada miniatura.
            miniatura.addEventListener('click', () => {
                const fundoEscolhido = fundosDeTela[indice]; // Pega o caminho da imagem clicada.
                document.body.style.backgroundImage = `url('${fundoEscolhido}')`; // Aplica ao fundo da página.
                localStorage.setItem('fundoSalvoCozyCoffee', fundoEscolhido); // Salva a escolha.
                menuFundos.classList.add('escondido'); // Fecha o menu.
            });
            galeriaFundos.appendChild(miniatura); // Adiciona a miniatura criada à galeria no HTML.
        });
    }

    // --- INICIALIZAÇÃO DO DISPLAY ---
    // Chama resetarTimer() no início para garantir que o timer comece com o valor correto
    // do modo padrão (pomodoro) ou com os valores carregados do localStorage.
    resetarTimer();
});