const btnAumentar = document.getElementById("btnAumentar");
const btnDiminuir = document.getElementById("btnDiminuir");
const painelSetas = document.getElementById("painelSetas")
const botaoIniciar = document.getElementById("btnIniciar");
const botaoReset = document.getElementById("btnResetar")
const display = document.getElementById("tempoDisplay");
const timerStatus = document.getElementById("timerStatus")
const contadorPainel = document.getElementById("contadorPainel");
const timerPrevisao = document.getElementById("timerPrevisao");
const secaoEstatisticas = document.querySelector(".estatisticas");


// Variáveis De Controle Simples
const isTestMode = false;
let TEMPO_FOCO_MIN = isTestMode ? 0 : 25;
let TEMPO_FOCO_SEG = isTestMode ? 5 : 0;
let minimo = 10;
let maximo = 120;

let minutos = TEMPO_FOCO_MIN
let segundos = TEMPO_FOCO_SEG
let cronometroId = null; 
let modoAtual = "foco"; 
let ciclosConcluidos = 0;
let totalCiclosDoDia = 0;

// Renderizar o cronômetro na tela
const atualizarDisplay = () => {
    let minutosFormatados = minutos.toString().padStart(2, "0");
    let segundosFormatados = segundos.toString().padStart(2, "0");
    display.textContent = `${minutosFormatados}:${segundosFormatados}`;
}

// Controla as mensagens no painel orientando o usuário
const atualizarStatusTexto = () => {
    if(modoAtual === "foco"){
        if(ciclosConcluidos === 0){
            timerStatus.textContent = "Período de foco (1 de 2)";

            if(TEMPO_FOCO_MIN >= 60){
                timerPrevisao.innerHTML = "A Seguir: <strong>10 min de intervalor</strong>"
            }else{
               timerPrevisao.innerHTML = "A seguir: <strong>5 min de intervalo</strong>"; 
            }
            botaoIniciar.textContent = "Iniciar Ciclo ▶️";
        }else if(ciclosConcluidos === 1){
            timerStatus.textContent = "Período de foco (2 de 2)";
            timerPrevisao.innerHTML = "A seguir: <strong>fim do bloco</strong>"
        }
    }
    else if(modoAtual === "descanso"){
        timerStatus.textContent = "Intervalo ☕"
        timerPrevisao.innerHTML = "A seguir: <strong>25 min de foco</strong>"
    }
}

// Temporizador assíncrono do navegador
const iniciarCronometro = () => {

    // verifica se o cronômetro já foi iniciado
    if(cronometroId !== null) return;
    if(TEMPO_FOCO_MIN >= 60 && ciclosConcluidos === 0){
        minutos = TEMPO_FOCO_MIN / 2;
    }

    atualizarStatusTexto();
    secaoEstatisticas.hidden = true;
    timerPrevisao.hidden = false;
    painelSetas.classList.add("escondido")

    cronometroId = setInterval(() => {
    // verifica se minutos e segundos são 0 
    if(segundos === 0 && minutos === 0){
        emitirBeep()
        gerenciarFimDeCiclo();
        return;
    }
    if( segundos === 0){
        minutos--;
        segundos = 59;
    }else{
        segundos--;
    }

    atualizarDisplay();

}, 1000);
}
// Função de pausar
const pausarCronometro = () => {
    clearInterval(cronometroId);
    cronometroId = null;
    timerPrevisao.textContent = "Em Pausa";
}
// Função de reset
const resetarCronometro = () => {
    clearInterval(cronometroId);
    minutos = TEMPO_FOCO_MIN;
    segundos = TEMPO_FOCO_SEG;
    modoAtual = "foco"
    ciclosConcluidos = 0;
    atualizarDisplay();
    atualizarStatusTexto();
    cronometroId = null;
    //renderizar o diplay resetado
    botaoIniciar.classList.remove("redondo");
    botaoIniciar.textContent = "Iniciar Ciclo ▶️";
    botaoReset.classList.add("escondido")
    painelSetas.classList.remove("escondido");
    timerPrevisao.innerHTML = "<strong>Você terá apenas 1 intervalo</strong>"
}
// Função de Ciclos
const gerenciarFimDeCiclo = () => {
    emitirBeep(); // Aviso sonoro toca no fim

    if(modoAtual === "foco"){
        ciclosConcluidos++; // adiciona +1 ao contador
        totalCiclosDoDia++; // adiciona +1 ao Ciclos totais do Dia

        contadorPainel.textContent = totalCiclosDoDia;

        if(ciclosConcluidos === 1){
            // Verifica se o tempo é maior ou igual 1h para adicionar 10 min
            modoAtual = "descanso";
            if(TEMPO_FOCO_MIN >= 60){
                minutos = isTestMode ? 0 : 10;
                segundos = isTestMode ? 5 : 0;
            }else{
                minutos = isTestMode ? 0 : 5;
                segundos = isTestMode ? 5 : 0;
            }
        }
        else if(ciclosConcluidos === 2){
            // Segundo ciclo acabou
            clearInterval(cronometroId);
            cronometroId = null;
            ciclosConcluidos = 0;
            modoAtual = "foco";
            minutos = TEMPO_FOCO_MIN;
            segundos = TEMPO_FOCO_SEG;
            painelSetas.classList.remove("escondido");
            botaoIniciar.classList.remove("redondo")
            secaoEstatisticas.hidden = false;
            timerPrevisao.hidden = true;
        }
    }
    else if(modoAtual === "descanso"){
        // Descanso acabou volta para segundo bloco
        modoAtual = "foco"
        if(TEMPO_FOCO_MIN >= 60){
            minutos = isTestMode ? 0 : TEMPO_FOCO_MIN/2;
        }else{
            minutos = TEMPO_FOCO_MIN;
        }
        segundos = TEMPO_FOCO_SEG;
    }
    atualizarDisplay();  
    atualizarStatusTexto();
}
// Função de aviso sonoro
const emitirBeep = () => {
    // 1. Cria o contexto de áudio do navegador
    const contexto = new (window.AudioContext || window.webkitAudioContext)();
    
    // 2. Cria o oscilador (gerador de onda senoidal)
    const oscilador = contexto.createOscillator();
    
    // 3. Conecta o oscilador à saída de som do sistema
    oscilador.connect(contexto.destination);
    
    // 4. Configura as propriedades do som
    oscilador.type = "sine";          
    oscilador.frequency.value = 600;  
    
    // 5. Liga o som
    oscilador.start();
    
    // 6. Agenda o desligamento automático após 0.2 segundos
    setTimeout(() => {
        oscilador.stop();
        contexto.close();
    }, 200);
}

// Evento de click da setas
btnAumentar.addEventListener("click", () =>{
    if(TEMPO_FOCO_MIN < maximo){
        if(TEMPO_FOCO_MIN >= 60){
            TEMPO_FOCO_MIN += 10;
        }else{
            TEMPO_FOCO_MIN += 5;
        }
        minutos = TEMPO_FOCO_MIN;
        atualizarDisplay();
    }
})
btnDiminuir.addEventListener("click", () =>{
    if(cronometroId === null && TEMPO_FOCO_MIN > minimo){
        if(TEMPO_FOCO_MIN > 60){
            TEMPO_FOCO_MIN -= 10;
        }else{
            TEMPO_FOCO_MIN -= 5;
        }
        minutos = TEMPO_FOCO_MIN;
        atualizarDisplay();
    }
})
botaoIniciar.addEventListener("click", () => {
    // verifica se cronometro estar parado
    if(cronometroId === null){
        iniciarCronometro();
        botaoIniciar.classList.add("redondo");
        botaoIniciar.innerHTML = `<i data-lucide="pause"></i>`;
        lucide.createIcons();
        display.style.color = "#61afef";
        botaoReset.classList.remove("remove");
    }else{
        pausarCronometro();
        botaoIniciar.innerHTML = `<i data-lucide="play"></i>`;
        lucide.createIcons();
        botaoReset.classList.remove("escondido");
        display.style.color = "#ffffff";
    }

});
botaoReset.addEventListener("click", () => {
    resetarCronometro();
});