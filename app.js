const botao = document.querySelector("#btnIniciar");
const display = document.querySelector("#tempoDisplay");

// Variáveis do cronômetro
let minutos = 25;
let segundos = 0;
let cronometroId = null; 

// função cronômetro
const iniciarCronometro = () => {

    // verifica se o cronômetro já foi iniciado
    if(cronometroId !== null) return;

    // API assíncrona (temporizador do browser)
    cronometroId = setInterval(() => {
    // verifica se minutos e segundos são 0 
    if(segundos === 0 && minutos === 0){
        minutos += 25
        segundos = 0
    }else if( segundos === 0){
        minutos -= 1
        segundos += 59
    }else{
        segundos -= 1
    }

    // variáveis que recebem minutos e segundos formatados
    let minutosFormatados = minutos.toString().padStart(2, "0");
    let segundosFormatados = segundos.toString().padStart(2, "0");

    // renderiza o cronômetro
    display.textContent = `${minutosFormatados}:${segundosFormatados}`;

}, 1000);
}

const pausarCronometro = () => {
    clearInterval(cronometroId);
    cronometroId = null;
}


// evento de partida
botao.addEventListener("click", () => {
    // verifica se cronometro estar parado
    if(cronometroId === null){
        iniciarCronometro();
        botao.textContent = "Pausar ⏸️"
        display.style.color = "#61afef";
    }else{
        pausarCronometro();
        botao.textContent = "Ativo!⚡";
        display.style.color = "#ffffff";
    }

});