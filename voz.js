// --- 🚍 Datos de rutas ---
const rutas = [
    { origen: "Portal Américas", destino: "Portal El Dorado", bus: "TransMilenio K10" },
    { origen: "Portal El Dorado", destino: "Portal Américas", bus: "TransMilenio F10" },
    { origen: "Portal Norte", destino: "Portal Suba", bus: "TransMilenio C5" },
    { origen: "Portal Suba", destino: "Portal Norte", bus: "TransMilenio B5" },
    { origen: "Portal Tunal", destino: "Portal 80", bus: "TransMilenio D7" },
    { origen: "Portal 80", destino: "Portal Tunal", bus: "TransMilenio H7" },
    { origen: "Portal 20 de Julio", destino: "Portal Banderas", bus: "TransMilenio F23" },
    { origen: "Portal Banderas", destino: "Portal 20 de Julio", bus: "TransMilenio L23" },
    { origen: "Portal de las Américas", destino: "Portal Usme", bus: "TransMilenio H2" },
    { origen: "Portal Usme", destino: "Portal de las Américas", bus: "TransMilenio F2" },
    { origen: "Portal El Tunal", destino: "Portal Norte", bus: "TransMilenio B11" },
    { origen: "Portal Norte", destino: "Portal El Tunal", bus: "TransMilenio H11" },
    { origen: "Portal Suba", destino: "Portal Américas", bus: "TransMilenio F7" },
    { origen: "Portal Américas", destino: "Portal Suba", bus: "TransMilenio C7" },
    { origen: "Portal 80", destino: "Portal Dorado", bus: "TransMilenio K9" },
    { origen: "Portal Dorado", destino: "Portal 80", bus: "TransMilenio D9" },
    { origen: "Portal Usme", destino: "Portal El Dorado", bus: "TransMilenio K15" },
    { origen: "Portal El Dorado", destino: "Portal Usme", bus: "TransMilenio H15" },
    { origen: "Portal 20 de Julio", destino: "Portal Norte", bus: "TransMilenio B8" },
    { origen: "Portal Norte", destino: "Portal 20 de Julio", bus: "TransMilenio L8" },
    { origen: "Portal Suba", destino: "Portal Banderas", bus: "TransMilenio F10" },
    { origen: "Portal Banderas", destino: "Portal Suba", bus: "TransMilenio C10" },
];

// --- Variables ---
let paso = 0; // 0 = origen, 1 = destino
let reconocimientoActivo = false;

// --- Funciones del Modal ---
function abrirModalVoz() {
    document.getElementById('modalVoz').style.display = 'block';
    // Limpiar campos
    document.getElementById('origen').value = '';
    document.getElementById('destino').value = '';
    document.getElementById('resultado-voice').textContent = '';
    document.getElementById('resultado-voice').innerHTML = '';
    resetearBoton();
}

function cerrarModalVoz() {
    document.getElementById('modalVoz').style.display = 'none';
    // Detener cualquier reconocimiento de voz activo
    if (window.currentRecognition) {
        window.currentRecognition.stop();
        window.currentRecognition = null;
    }
    reconocimientoActivo = false;
    resetearBoton();
}

// --- 🔊 Reconocimiento de voz secuencial ---
function iniciarDictado() {
    if (reconocimientoActivo) {
        return; // Evitar múltiples instancias
    }
    
    paso = 0;
    reconocimientoActivo = true;
    document.getElementById('btnDictar').classList.add('listening');
    document.getElementById('btnDictar').textContent = '🔴 Escuchando origen...';
    
    narrar("Diga su estación de origen");
    setTimeout(() => escuchar(), 1500);
}

function escuchar() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Tu navegador no soporta reconocimiento de voz.");
        resetearBoton();
        return;
    }

    const recognition = new SpeechRecognition();
    window.currentRecognition = recognition;
    recognition.lang = "es-ES";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.start();

    recognition.onresult = (event) => {
        const texto = event.results[0][0].transcript.trim();

        if (paso === 0) {
            document.getElementById("origen").value = texto;
            document.getElementById('btnDictar').textContent = '🔴 Escuchando destino...';
            narrar(`Origen detectado: ${texto}. Ahora diga su destino`);
            paso = 1;
            setTimeout(() => escuchar(), 2500);
        } else {
            document.getElementById("destino").value = texto;
            document.getElementById('btnDictar').textContent = '🔍 Buscando ruta...';
            narrar(`Destino detectado: ${texto}. Buscando ruta...`);
            setTimeout(() => {
                buscarRuta();
                resetearBoton();
            }, 1500);
        }
    };

    recognition.onerror = (event) => {
        console.error("Error en reconocimiento de voz:", event.error);
        if (paso === 0) {
            narrar("No se entendió el origen, intente de nuevo.");
        } else {
            narrar("No se entendió el destino, intente de nuevo.");
        }
        resetearBoton();
    };

    recognition.onend = () => {
        if (reconocimientoActivo && paso < 2) {
            // El reconocimiento terminó inesperadamente
            console.log("Reconocimiento terminado");
        }
    };
}

function resetearBoton() {
    reconocimientoActivo = false;
    document.getElementById('btnDictar').classList.remove('listening');
    document.getElementById('btnDictar').textContent = '🎤 Dictar Origen y Destino';
    if (window.currentRecognition) {
        window.currentRecognition = null;
    }
}

// --- 🔊 Síntesis de voz ---
function narrar(texto) {
    // Detener cualquier narración anterior
    speechSynthesis.cancel();
    
    const msg = new SpeechSynthesisUtterance(texto);
    msg.lang = "es-ES";
    msg.rate = 0.9;
    msg.pitch = 1;
    msg.volume = 0.8;
    
    speechSynthesis.speak(msg);
}

// --- 🔎 Buscar ruta ---
function buscarRuta() {
    const origen = document.getElementById("origen").value.trim().toLowerCase();
    const destino = document.getElementById("destino").value.trim().toLowerCase();

    if (!origen || !destino) {
        const mensaje = "Por favor, proporcione tanto el origen como el destino.";
        document.getElementById("resultado-voice").textContent = mensaje;
        narrar(mensaje);
        return;
    }

    // Buscar ruta exacta o parcial
    const ruta = rutas.find(r => {
        const origenCoincide = r.origen.toLowerCase().includes(origen) || origen.includes(r.origen.toLowerCase());
        const destinoCoincide = r.destino.toLowerCase().includes(destino) || destino.includes(r.destino.toLowerCase());
        return origenCoincide && destinoCoincide;
    });

    if (ruta) {
        const mensaje = `Debes tomar el ${ruta.bus}`;
        document.getElementById("resultado-voice").innerHTML = `
            <div style="color: #28a745; font-size: 20px;">
                ✅ ${mensaje}
            </div>
            <div style="color: #666; font-size: 14px; margin-top: 10px;">
                ${ruta.origen} → ${ruta.destino}
            </div>
        `;
        narrar(mensaje);
    } else {
        const mensaje = "No existe ruta directa entre esas estaciones.";
        document.getElementById("resultado-voice").innerHTML = `
            <div style="color: #dc3545; font-size: 18px;">
                ❌ ${mensaje}
            </div>
            <div style="color: #666; font-size: 14px; margin-top: 10px;">
                Verifique los nombres de las estaciones
            </div>
        `;
        narrar(mensaje);
    }
}

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', function() {
const modalHTML = `
<div id="modalVoz" class="modal-voice">
<div class="modal-voice-content">
<h2>🎤 Consulta tu bus</h2>

<input id="origen" type="text" placeholder="Origen (se dicta)" readonly>
<input id="destino" type="text" placeholder="Destino (se dicta)" readonly>

<div>
<button id="btnDictar" class="btn-voice" onclick="iniciarDictado()">
🎤 Dictar Origen y Destino
</button>
<button class="btn-close" onclick="cerrarModalVoz()">
Cerrar
</button>
</div>

<div id="resultado-voice"></div>
</div>
</div>
`;

document.body.insertAdjacentHTML('beforeend', modalHTML);

const btnAudio = document.querySelector('.btn-Audio');
if (btnAudio) {
btnAudio.addEventListener('click', abrirModalVoz);
}

window.addEventListener('click', function(event) {
const modal = document.getElementById('modalVoz');
if (event.target === modal) {
cerrarModalVoz();
}
});

document.addEventListener('keydown', function(event) {
if (event.key === 'Escape') {
cerrarModalVoz();
}
});
});

// Función global para compatibilidad
window.abrirModalVoz = abrirModalVoz;
window.cerrarModalVoz = cerrarModalVoz;

window.iniciarDictado = iniciarDictado;

