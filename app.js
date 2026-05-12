const botao = document.querySelector("#btnIniciar");
const botaoReset = document.querySelector("#btnResetar")
const display = document.querySelector("#tempoDisplay");

// Variáveis do cronômetro
let minutos = 25;
let segundos = 0;
let cronometroId = null; 

// função de renderizar
const atualizarDisplay = () => {

    // variáveis que recebem minutos e segundos formatados
    let minutosFormatados = minutos.toString().padStart(2, "0");
    let segundosFormatados = segundos.toString().padStart(2, "0");

    // renderiza o cronômetro
    display.textContent = `${minutosFormatados}:${segundosFormatados}`;
}

// função cronômetro
const iniciarCronometro = () => {

    // verifica se o cronômetro já foi iniciado
    if(cronometroId !== null) return;

    // API assíncrona (temporizador do browser)
    cronometroId = setInterval(() => {
    // verifica se minutos e segundos são 0 
    if(segundos === 0 && minutos === 0){
        pausarCronometro();
        display.textContent = "Iniciar ▶️";
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
}

// função de Resetar
const resetarCronometro = () => {
    clearInterval(cronometroId);
    minutos = 25;
    segundos = 0;
    //valores sanatizados
    let minutosFormatados = minutos.toString().padStart(2, "0"); 
    let segundosFormatados = segundos.toString().padStart(2, "0");
    cronometroId = null;
    //renderizar o diplay resetado
    display.textContent = `${minutosFormatados}:${segundosFormatados}`;
    botao.textContent = "Iniciar Ciclo ▶️";
    botaoReset.hidden = true;

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