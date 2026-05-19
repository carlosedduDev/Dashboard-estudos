const botao = document.getElementById("btnIniciar");
const botaoReset = document.getElementById("btnResetar")
const display = document.getElementById("tempoDisplay");
const timerStatus = document.getElementById("timerStatus")
const contadorPainel = document.getElementById("contadorPainel");
const timerPrevisao = document.getElementById("timerPrevisao");
const secaoEstatisticas = document.querySelector(".estatisticas");

// Variáveis do cronômetro
let minutos = 0;
let segundos = 5;
let cronometroId = null; 
let modoAtual = "foco"; 
let ciclosConcluidos = 0;
let totalCiclosDoDia = 0;

// função de renderizar
const atualizarDisplay = () => {

    // variáveis que recebem minutos e segundos formatados
    let minutosFormatados = minutos.toString().padStart(2, "0");
    let segundosFormatados = segundos.toString().padStart(2, "0");

    // renderiza o cronômetro
    display.textContent = `${minutosFormatados}:${segundosFormatados}`;
}

const atualizarStatusTexto = () => {
    if(modoAtual === "foco"){
        if(ciclosConcluidos === 0){
            timerStatus.textContent = "Período de foco (1 de 2)";
            timerPrevisao.innerHTML = "A seguir: <strong>5 min de intervalo</strong>";
            botao.textContent = "Iniciar Ciclo ▶️";
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

// função cronômetro
const iniciarCronometro = () => {

    // verifica se o cronômetro já foi iniciado
    if(cronometroId !== null) return;

    atualizarStatusTexto();
    secaoEstatisticas.hidden = true;
    timerPrevisao.hidden = false;
    
    // API assíncrona (temporizador do browser)
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

// função de pausar
const pausarCronometro = () => {
    clearInterval(cronometroId);
    cronometroId = null;
    timerPrevisao.textContent = "Em Pausa"
}

// função de Resetar
const resetarCronometro = () => {
    clearInterval(cronometroId);
    minutos = 25;
    segundos = 0;
    modoAtual = "foco"
    ciclosConcluidos = 0;
    atualizarDisplay()
    atualizarStatusTexto()
    cronometroId = null;
    //renderizar o diplay resetado
    botao.textContent = "Iniciar Ciclo ▶️";
    botaoReset.hidden = true;

}

// Função de Ciclos
const gerenciarFimDeCiclo = () => {
    emitirBeep(); // Aviso sonoro toca no fim

    if(modoAtual === "foco"){
        ciclosConcluidos++; // adiciona +1 ao contador
        totalCiclosDoDia++; // adiciona +1 ao Ciclos totais do Dia

        contadorPainel.textContent = totalCiclosDoDia;

        if(ciclosConcluidos === 1){
            // Primeiro Ciclo acabou -> Descanso de 5 min
            modoAtual = "descanso";
            minutos = 0;
            segundos = 5;
        }
        else if(ciclosConcluidos === 2){
            // Segundo ciclo acabou
            clearInterval(cronometroId);
            cronometroId = null;
            ciclosConcluidos = 0;
            modoAtual = "foco"
            minutos = 0;
            segundos = 5;
            secaoEstatisticas.hidden = false;
            timerPrevisao.hidden = true;
            
        }
    }
    else if(modoAtual === "descanso"){
        // Descanso de 5 min acabou -> segundo ciclo de foco
        modoAtual = "foco"
        minutos = 0;
        segundos = 5;
    }
    atualizarDisplay(); // Atualiza os números da tela 
    atualizarStatusTexto();
}

// função para emitir o som de aviso (Buzzer)
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

// Evento de partida
botao.addEventListener("click", () => {
    // verifica se cronometro estar parado
    if(cronometroId === null){
        iniciarCronometro();
        botao.textContent = "Pausar ⏸️"
        display.style.color = "#61afef";
        botaoReset.hidden = true;
    }else{
        pausarCronometro();
        botao.textContent = "Iniciar ⏯️";
        display.style.color = "#ffffff";
        botaoReset.hidden = false;
    }

});

// Evento de resetar
botaoReset.addEventListener("click", () => {
    resetarCronometro()
})