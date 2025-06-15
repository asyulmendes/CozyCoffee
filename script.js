let tempo = 25 * 60;  // Tempo inicial
let intervalo = null;  // Variável para o setInterval

const timer = document.getElementById("timer-display");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const botoesModo = document.querySelectorAll(".modo-botao");

function atualizarDisplay() {
    const minutos = Math.floor(tempo / 60);  // Converte segundos para minutos
    const segundos = tempo % 60;  // Obtém os segundos restantes
    timer.textContent = `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
}

// Função para iniciar o timer
function IniciarTimer() {
    if (intervalo) return;  // Evita iniciar o timer se já estiver rodando

    intervalo = setInterval(() => {
        if (tempo > 0) {
            tempo--;
            atualizarDisplay();
        } else {
            // Quando o tempo chega a 0
            clearInterval(intervalo);
            intervalo = null;
            alert("Tempo acabou! Faça uma pausa ☕.");
        }
    }, 1000);
}

// Função para pausar o timer
function pausarTimer() {
    clearInterval(intervalo);
    intervalo = null;
}

// Função para resetar o timer
function resetarTimer() {
    pausarTimer();
    tempo = 25 * 60;  // Reseta para 25 minutos
    atualizarDisplay();
}

// Função para trocar o modo e definir o tempo
function trocarModo(botao) {
    botoesModo.forEach(b => b.classList.remove("ativo"));
    botao.classList.add("ativo");

    if (botao.id === "pomodoro") tempo = 25 * 60;  // 25 minutos para Pomodoro
    if (botao.id === "pausa-curta") tempo = 5 * 60;  // 5 minutos para Pausa Curta
    if (botao.id === "pausa-longa") tempo = 15 * 60;  // 15 minutos para Pausa Longa

    atualizarDisplay();
    pausarTimer();  // Pausa o timer ao trocar de modo
}

// Adiciona eventos para os botões de modo
botoesModo.forEach(botao => {
    botao.addEventListener("click", () => {
        trocarModo(botao);
    });
});

// Adiciona eventos para os botões
startBtn.addEventListener("click", IniciarTimer);
pauseBtn.addEventListener("click", pausarTimer);
resetBtn.addEventListener("click", resetarTimer);

// Função para tocar o som
function playSound(id) {
    const sound = document.getElementById(id);
    if (sound) sound.play();
}

// Função para atualizar o display do tempo quando a página carrega
atualizarDisplay();
