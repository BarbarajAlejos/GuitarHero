document.addEventListener('DOMContentLoaded', function() {
    const juegoArea = document.getElementById('juego');
    let puntuacion = 0;
    const puntuacionSpan = document.getElementById('puntuacion');
    let vidas = 3;
    const vidasSpan = document.getElementById('vidas');
    let juegoActivo = false;
    let juegoPausado = false;
    let generadorElementos;

    const btnInicio = document.getElementById('inicioJuego');
    const btnPausa = document.getElementById('pausaJuego');
  
    btnInicio.addEventListener('click', function() {
        if (!juegoActivo || juegoPausado) {
            if (!juegoActivo) {
                iniciarJuego();
            } else {
                reanudarJuego();
            }
        }
    });
    btnPausa.addEventListener('click', pausarJuego);
  
    function iniciarJuego() {
        juegoActivo = true;
        juegoPausado = false;
        btnPausa.disabled = false;
        btnInicio.disabled = true;
        btnInicio.textContent = 'Reanudar';
        generadorElementos = setInterval(generarElemento, 2000);
    }
  
    function pausarJuego() {
        if (juegoActivo && !juegoPausado) {
            clearInterval(generadorElementos);
            juegoPausado = true;
            btnInicio.disabled = false;
            btnPausa.disabled = true;
        }
    }
  
    function reanudarJuego() {
        if (juegoActivo && juegoPausado) {
            juegoPausado = false;
            btnInicio.disabled = true;
            btnPausa.disabled = false;
            generadorElementos = setInterval(generarElemento, 2000);
        }
    }
  
    function manejarTeclas(e) {
        if (!juegoActivo || juegoPausado) return;
    
        let circuloSeleccionado;
        switch(e.key.toLowerCase()) {
            case 'a':
                circuloSeleccionado = document.querySelector('.verde[data-tecla="A"]');
                break;
            case 'b':
                circuloSeleccionado = document.querySelector('.rojo[data-tecla="B"]');
                break;
            case 'c':
                circuloSeleccionado = document.querySelector('.amarillo[data-tecla="C"]');
                break;
            case 'd':
                circuloSeleccionado = document.querySelector('.purpura[data-tecla="D"]');
                break;
            case 'e':
                circuloSeleccionado = document.querySelector('.azul[data-tecla="E"]');
                break;
            default:
                return;
        }
        
        if (circuloSeleccionado) {
            verificarCaptura(circuloSeleccionado);
        }
    }
  
    function verificarCaptura(circulo) {
        document.querySelectorAll('.elemento').forEach(function(elemento) {
            const rectCirculo = circulo.getBoundingClientRect();
            const rectElemento = elemento.getBoundingClientRect();
            if (rectElemento.top < rectCirculo.bottom && rectElemento.bottom > rectCirculo.top && rectElemento.right > rectCirculo.left && rectElemento.left < rectCirculo.right) {
                juegoArea.removeChild(elemento);
                if (elemento.dataset.esSaludable === 'true') {
                    puntuacion += 10;
                    puntuacionSpan.textContent = puntuacion.toString();
                } else {
                    // Restar vidas si el elemento no es saludable
                    vidas--;
                    vidasSpan.textContent = vidas.toString();
                    if (vidas <= 0) {
                        finalizarJuego();
                    }
                }
            }
        });
    }
  
    function generarElemento() {
        if (!juegoActivo || juegoPausado) return;
    
        const elemento = document.createElement('div');
        elemento.classList.add('elemento');
        elemento.dataset.esSaludable = Math.random() > 0.5; // Esto determina si ganas o pierdes puntos
    
        const circulos = document.querySelectorAll('#jugador .circulo');
        const indiceAleatorio = Math.floor(Math.random() * circulos.length);
        const circuloSeleccionado = circulos[indiceAleatorio];
        const posicion = circuloSeleccionado.getBoundingClientRect().left + window.scrollX - juegoArea.getBoundingClientRect().left;
        elemento.style.left = `${posicion}px`;
        elemento.style.top = '0px';
        juegoArea.appendChild(elemento);
    
        let intervalo = setInterval(function() {
            if (!juegoActivo || juegoPausado) {
                clearInterval(intervalo);
                juegoArea.removeChild(elemento);
                return;
            }
            let topActual = parseInt(window.getComputedStyle(elemento).getPropertyValue('top'), 10);
            if (topActual > juegoArea.offsetHeight - circuloSeleccionado.offsetHeight) {
                clearInterval(intervalo);
                juegoArea.removeChild(elemento);
                if (elemento.dataset.esSaludable === 'false') {
                    vidas--;
                    vidasSpan.textContent = vidas.toString();
                    if (vidas <= 0) {
                        finalizarJuego();
                    }
                }
            } else {
                elemento.style.top = `${topActual + 4}px`;
            }
        }, 50);
    }
  
    document.addEventListener('keydown', manejarTeclas);
  
    function finalizarJuego() {
        juegoActivo = false;
        juegoPausado = true;
        clearInterval(generadorElementos);
        alert('Juego terminado. Tus vidas han llegado a 0.');
        // Implementa aquí cualquier lógica adicional para cuando el juego termina.
        // Por ejemplo, podrías ocultar el área de juego o mostrar un menú de fin de juego.
        stopEndSound();
    }
  
    const startSound = document.getElementById('ShawnM');
    const endSound = document.getElementById('error');

    function playStartSound() {
        startSound.play();
    }

    function stopEndSound() {
        endSound.pause();
        endSound.currentTime = 0;
    }

    document.getElementById('inicioJuego').addEventListener('click', function() {
        playStartSound();
    });
});

  