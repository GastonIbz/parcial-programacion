const botonLuces = document.getElementById('boton-luces'); // ID Boton de Luces
const celdasMaterias = document.querySelectorAll('tbody tr:not(.recreo) td:not(.hora)'); // Selecciona celdas de materias (no recreo, ni hora)
const celdasRecreo = document.querySelectorAll('tbody tr.recreo td'); // Selecciona celdas de la fila de recreo
const celdasDias = document.querySelectorAll('tbody tr:not(.recreo) td:not(.hora), tbody tr.recreo td'); // Selecciona todas las celdas de los días
let modoLucesActivo = false; // Indica si el modo luces está activo
let intervalosLuces = []; // Intervalos de color (array) para las luces

function ColorAleatorio() { // Genera un string con un color RGB aleatorio.
    const r = Math.floor(Math.random() * 256); // Rojo
    const g = Math.floor(Math.random() * 256); // Verde
    const b = Math.floor(Math.random() * 256); // Azul
    return `rgb(${r}, ${g}, ${b})`;
}

function GradienteAleatorio() { // Genera un string con un gradiente lineal aleatorio.
    const color1 = ColorAleatorio(); // Primer color 
    const color2 = ColorAleatorio(); // Segundo color 
    const angulo = Math.random() * 360 + 'deg'; // Ángulo para el gradiente
    return `linear-gradient(${angulo}, ${color1}, ${color2})`;
}

function activarModoLuces() { 
    celdasDias.forEach((celda, index) => { // Agrupa cada celda de los días
        const intervalo = Math.random() * 1000 + 200; // Cambio de color
        const intervalId = setInterval(() => { //  Intervalo para cambiar el fondo de la celda
            celda.style.backgroundImage = GradienteAleatorio(); // Gradiente aleatorio como fondo.
            celda.style.backgroundSize = '100% 200%'; // Asegura que el gradiente cubra la celda.
        }, intervalo);
        intervalosLuces.push(intervalId); // Guarda el ID del intervalo.
    });
}

function desactivarModoLuces() { 
    intervalosLuces.forEach(intervalId => clearInterval(intervalId)); // Detiene cada intervalo guardado
    intervalosLuces = []; // Limpia el array de intervalos
    celdasDias.forEach(celda => { // Toca cada celda de los días
        celda.style.backgroundImage = ''; // Remueve la gradiente
        celda.style.backgroundSize = ''; // Remueve el tamaño del fondo
        celda.style.transition = ''; // Remueve cualquier transición
    });
}

botonLuces.addEventListener('click', () => { 
    modoLucesActivo = !modoLucesActivo; // Cambia el estado del modo luces
    if (modoLucesActivo) { 
        botonLuces.textContent = 'Desactivar Luces'; 
        activarModoLuces(); // Llama a la función para activar las luces
    } else { 
        botonLuces.textContent = 'Modo Luces'; 
        desactivarModoLuces(); // Llama a la función para desactivar las luces
    }
});

// Reproductor de audio
const reproductorAudio = document.getElementById('reproductorAudio');
const botonPlay = document.getElementById('botonPlay');
const botonPausa = document.getElementById('botonPausa');
const botonAnterior = document.getElementById('botonAnterior');
const botonSiguiente = document.getElementById('botonSiguiente');
const barraProgreso = document.getElementById('barraProgreso');
const tiempoActualDisplay = document.getElementById('tiempoActualDisplay');
const duracionDisplay = document.getElementById('duracionDisplay');

// Nombres de eventos más descriptivos 
const EVENTO_CLICK = 'click';
const EVENTO_TIEMPO_ACTUALIZADO = 'timeupdate';
const EVENTO_AUDIO_TERMINADO = 'ended';
const EVENTO_DATOS_CARGADOS = 'loadedmetadata';
const EVENTO_INPUT_BARRA = 'input';

// Lee la lista de canciones desde el atributo 'data-playlist' del elemento de audio
let listaDeReproduccion = JSON.parse(reproductorAudio.dataset.playlist);
// Canción que se está reproduciendo actualmente (empieza en 0 para la primera canción)
let indiceCancionActual = 0;

// Función para cargar una canción específica según su índice en la lista de reproducción
function cargarCancion(indiceCancion) {
    if (indiceCancion < 0) {
        indiceCancionActual = listaDeReproduccion.length - 1;
    } else if (indiceCancion >= listaDeReproduccion.length) {
        indiceCancionActual = 0;
    } else {
        indiceCancionActual = indiceCancion;
    }
    reproductorAudio.src = listaDeReproduccion[indiceCancionActual];
    reproductorAudio.load();
    reproductorAudio.addEventListener(EVENTO_DATOS_CARGADOS, () => {
        barraProgreso.max = reproductorAudio.duration;
        duracionDisplay.textContent = formatearTiempo(reproductorAudio.duration);
        reproductorAudio.play();
    }, { once: true });
}

// Evento cuando la canción termina
reproductorAudio.addEventListener(EVENTO_AUDIO_TERMINADO, () => {
    cargarCancion(indiceCancionActual + 1);
});

// Evento mientras la canción se está reproduciendo
reproductorAudio.addEventListener(EVENTO_TIEMPO_ACTUALIZADO, () => {
    barraProgreso.value = reproductorAudio.currentTime;
    tiempoActualDisplay.textContent = formatearTiempo(reproductorAudio.currentTime);
});

// Evento cuando el usuario interactúa con la barra de progreso
barraProgreso.addEventListener(EVENTO_INPUT_BARRA, () => {
    reproductorAudio.currentTime = barraProgreso.value;
});

// Función para formatear el tiempo de reproducción
function formatearTiempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = Math.floor(segundos % 60).toString().padStart(2, '0');
    return `${minutos}:${segundosRestantes}`;
}

// Botón Play
botonPlay.addEventListener(EVENTO_CLICK, () => {
    if (reproductorAudio.paused) {
        reproductorAudio.play();
        console.log("Reproduciendo audio");
    }
});

// Botón Pausa
botonPausa.addEventListener(EVENTO_CLICK, () => {
    if (!reproductorAudio.paused) {
        reproductorAudio.pause();
        console.log("Pausando audio");
    }
});

// Botón Anterior
botonAnterior.addEventListener(EVENTO_CLICK, () => {
    cargarCancion(indiceCancionActual - 1);
});

// Botón Siguiente
botonSiguiente.addEventListener(EVENTO_CLICK, () => {
    cargarCancion(indiceCancionActual + 1);
});

// Cargar la primera canción al inicio
cargarCancion(indiceCancionActual);