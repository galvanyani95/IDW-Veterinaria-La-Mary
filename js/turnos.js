// Si ya existe js/auth.js (login), esta página queda protegida: sin sesión redirige al login
if (typeof protegerPagina === 'function') protegerPagina();

// ===== Utilidades =====
function leerLista(clave) {
    try {
        const datos = JSON.parse(localStorage.getItem(clave));
        return Array.isArray(datos) ? datos : [];
    } catch (error) {
        return [];
    }
}

function guardarEnLocalStorage() {
    try {
        localStorage.setItem('turnos', JSON.stringify(turnos));
        return true;
    } catch (error) {
        alert('No se pudo guardar en el almacenamiento del navegador.');
        return false;
    }
}

function generarId() {
    if (window.crypto && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}

// Evita que el texto ingresado se interprete como HTML (XSS)
function escapar(texto) {
    return String(texto).replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}

// Fecha y hora actual en el formato que usa <input type="datetime-local">
function fechaHoraActual() {
    const ahora = new Date();
    ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());
    return ahora.toISOString().slice(0, 16);
}

function esPasada(fechaHora) {
    return new Date(fechaHora) < new Date();
}

function formatearFecha(fechaHora) {
    return new Date(fechaHora).toLocaleString('es-AR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: false
    });
}

// ===== Estado y elementos del DOM =====
const turnos = leerLista('turnos');

const listado = document.getElementById('listado-turnos');
const total = document.getElementById('total-turnos');
const buscador = document.getElementById('buscador');
const catalogo = document.getElementById('catalogo-turnos');

const formulario = document.getElementById('form-turnos');
const inputFechaHora = document.getElementById('fechaHora');
const selectMascota = document.getElementById('mascota');
const selectVeterinario = document.getElementById('veterinario');

const formularioEditar = document.getElementById('form-editar-turno');

const elementoModal = document.getElementById('modal-editar-turno');

const modalEditar = elementoModal
    ? bootstrap.Modal.getOrCreateInstance(elementoModal)
    : null;


const inputEditarId = document.getElementById('editarIdTurno');
const inputEditarFechaHora = document.getElementById('editarFechaHora');
const selectEditarMascota = document.getElementById('editarMascota');
const selectEditarVeterinario = document.getElementById('editarVeterinario');
let idTurnoEditar = null;

// No se pueden pedir turnos en el pasado
inputFechaHora.min = fechaHoraActual();

// ===== Mascotas y veterinarios (se leen de LocalStorage cada vez) =====
const obtenerMascotas = () => leerLista('mascotas');
const obtenerVeterinarios = () => leerLista('veterinarios');

function cargarSelects() {
    const mascotas = obtenerMascotas();
    const veterinarios = obtenerVeterinarios();

    const opcionesMascotas =
        `<option value="">${mascotas.length ? 'Seleccione una mascota' : 'Primero registrá una mascota'}</option>` +
        mascotas.map((m) =>
            `<option value="${m.idMascota}">${escapar(m.nombreMascota)} (${escapar(m.nombreDuenio)})</option>`
        ).join('');

    const opcionesVeterinarios =
        `<option value="">${veterinarios.length ? 'Seleccione un veterinario' : 'Primero registrá un veterinario'}</option>` +
        veterinarios.map((v) =>
            `<option value="${v.idVeterinario}">${escapar(v.nombre)} - ${escapar(v.especializacion)}</option>`
        ).join('');

    // Desplegables del formulario principal
    if (selectMascota) {
        selectMascota.innerHTML = opcionesMascotas;
    }

    if (selectVeterinario) {
        selectVeterinario.innerHTML = opcionesVeterinarios;
    }

    // Desplegables del formulario de edición
    if (selectEditarMascota) {
        selectEditarMascota.innerHTML = opcionesMascotas;
    }

    if (selectEditarVeterinario) {
        selectEditarVeterinario.innerHTML = opcionesVeterinarios;
    }

}

// ===== Validación =====
// Devuelve un mensaje de error, o null si el turno es válido
function validarTurno({ fechaHora, idMascota, idVeterinario }, idActual = null, controlarPasado = true) {
    if (!fechaHora || !idMascota || !idVeterinario) {
        return 'Completá todos los campos.';
    }
    if (!obtenerMascotas().some((m) => m.idMascota === idMascota)) {
        return 'La mascota seleccionada no existe.';
    }
    if (!obtenerVeterinarios().some((v) => v.idVeterinario === idVeterinario)) {
        return 'El veterinario seleccionado no existe.';
    }
    if (controlarPasado && esPasada(fechaHora)) {
        return 'No se pueden registrar turnos en una fecha y hora pasadas.';
    }
    const ocupado = turnos.some((t) =>
        t.fechaHora === fechaHora &&
        t.idVeterinario === idVeterinario &&
        t.idTurno !== idActual
    );
    if (ocupado) {
        return 'Ese veterinario ya tiene un turno en esa fecha y hora.';
    }
    return null;
}

// ===== Listado =====
function render() {
    const mascotas = obtenerMascotas();
    const veterinarios = obtenerVeterinarios();
    const texto = buscador.value.trim().toLowerCase();

    // Se une cada turno con los datos de su mascota y veterinario
    const filas = [...turnos]
        .sort((a, b) => a.fechaHora.localeCompare(b.fechaHora))
        .map((turno) => ({
            turno,
            mascota: mascotas.find((m) => m.idMascota === turno.idMascota),
            veterinario: veterinarios.find((v) => v.idVeterinario === turno.idVeterinario)
        }))
        .filter(({ mascota, veterinario }) => {
            const nombres = [
                mascota ? mascota.nombreMascota : '',
                mascota ? mascota.nombreDuenio : '',
                veterinario ? veterinario.nombre : ''
            ].join(' ').toLowerCase();
            return nombres.includes(texto);
        });

    if (filas.length === 0) {
        listado.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-muted">
                    ${turnos.length === 0 ? 'No hay turnos registrados.' : 'Ningún turno coincide con la búsqueda.'}
                </td>
            </tr>`;
    } else {
        listado.innerHTML = filas.map(({ turno, mascota, veterinario }) => `
            <tr>
                <td>${formatearFecha(turno.fechaHora)}</td>
                <td>${mascota
                    ? `${escapar(mascota.nombreMascota)} <small class="text-muted">(${escapar(mascota.nombreDuenio)})</small>`
                    : '<span class="text-muted">Mascota eliminada</span>'}</td>
                <td>${veterinario
                    ? escapar(veterinario.nombre)
                    : '<span class="text-muted">Veterinario eliminado</span>'}</td>
                <td class="text-center text-nowrap">
                    <button type="button" class="btn btn-warning btn-sm me-2" data-accion="editar" data-id="${turno.idTurno}">
                        <i class="bi bi-pencil-square"></i> Editar
                    </button>
                    
                    <button type="button" class="btn btn-success btn-sm me-2" data-accion="imprimir" data-id="${turno.idTurno}">
                        <i class="bi bi-printer"></i> Imprimir
                    </button>

                    <button type="button" class="btn btn-danger btn-sm" data-accion="eliminar" data-id="${turno.idTurno}">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>

                </td>
            </tr>
        `).join('');
    }

    total.textContent = turnos.length;
    renderCatalogo(mascotas, veterinarios);
}

// Tarjetas con los turnos próximos (los que todavía no pasaron)
function renderCatalogo(mascotas, veterinarios) {
    if (!catalogo) return;

    const proximos = [...turnos]
        .filter((t) => !esPasada(t.fechaHora))
        .sort((a, b) => a.fechaHora.localeCompare(b.fechaHora));

    if (proximos.length === 0) {
        catalogo.innerHTML = '<div class="col-12 text-center text-muted">No hay turnos próximos.</div>';
        return;
    }

    catalogo.innerHTML = proximos.map((t) => {
        const mascota = mascotas.find((m) => m.idMascota === t.idMascota);
        const veterinario = veterinarios.find((v) => v.idVeterinario === t.idVeterinario);
        return `
            <div class="col-12 col-sm-6 col-lg-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${formatearFecha(t.fechaHora)}</h5>
                        <p class="card-text mb-0">
                            Mascota: ${mascota ? escapar(mascota.nombreMascota) : 'eliminada'}<br>
                            Veterinario: ${veterinario ? escapar(veterinario.nombre) : 'eliminado'}
                        </p>
                    </div>
                </div>
            </div>`;
    }).join('');
}

// ===== Alta =====
formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const datos = new FormData(formulario);

    const nuevo = {
        fechaHora: datos.get('fechaHora'),
        idMascota: datos.get('mascota'),
        idVeterinario: datos.get('veterinario')
    };

    const error = validarTurno(nuevo);
    if (error) {
        alert(error);
        return;
    }

    turnos.push({ idTurno: generarId(), ...nuevo });

    if (!guardarEnLocalStorage()) {
        turnos.pop();
        return;
    }
    render();
    formulario.reset();
    inputFechaHora.min = fechaHoraActual();
});

// ===== Edición =====
function editarTurno(id) {
    const turno = turnos.find((t) => t.idTurno === id);

    if (!turno) {
        alert('No se encontró el turno.');
        return;
    }

    if (!modalEditar) {
        alert('No se encontró el modal de edición.');
        return;
    }


    cargarSelects();
    idTurnoEditar = id;
    
    inputEditarId.value = turno.idTurno;
    inputEditarFechaHora.value = turno.fechaHora;
    selectEditarMascota.value = turno.idMascota;
    selectEditarVeterinario.value = turno.idVeterinario;

    modalEditar.show();
}


if (formularioEditar) {
    formularioEditar.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const turno = turnos.find((t) => t.idTurno === idTurnoEditar);
    if (!turno) return;

    const datos = new FormData(formularioEditar);
    const cambios = {
        fechaHora: datos.get('editarFechaHora'),
        idMascota: datos.get('editarMascota'),
        idVeterinario: datos.get('editarVeterinario')
    };

    // Solo se controla que no sea pasada si se cambió la fecha y hora
    const error = validarTurno(cambios, idTurnoEditar, cambios.fechaHora !== turno.fechaHora);
    if (error) {
        alert(error);
        return;
    }

    const copiaOriginal = { ...turno };
    Object.assign(turno, cambios);

    if (!guardarEnLocalStorage()) {
        Object.assign(turno, copiaOriginal);
        return;
    }
    render();
    modalEditar.hide();
    idTurnoEditar = null;
});
}

// ===== Imprimir =====

function imprimirComprobante(id) {
    const turno = turnos.find(t => t.idTurno === id);

    if (!turno) {
        alert('No se encontró el turno.');
        return;
    }

    const mascota = obtenerMascotas().find(
        m => m.idMascota === turno.idMascota
    );

    const veterinario = obtenerVeterinarios().find(
        v => v.idVeterinario === turno.idVeterinario
    );

    if (!mascota || !veterinario) {
        alert('No se encontraron los datos de la mascota o veterinario.');
        return;
    }

    const ventana = window.open('', '_blank');

    if (!ventana) {
        alert('Permití las ventanas emergentes para imprimir el comprobante.');
        return;
    }

    ventana.document.write(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Comprobante de turno</title>

            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 35px;
                    color: #333;
                }

                .comprobante {
                    max-width: 600px;
                    margin: auto;
                    border: 2px solid #198754;
                    padding: 30px;
                    border-radius: 10px;
                }

                h1 {
                    color: #198754;
                    text-align: center;
                }

                h3 {
                    text-align: center;
                    margin-bottom: 30px;
                }

                .dato {
                    padding: 12px;
                    border-bottom: 1px solid #ddd;
                }

                .pie {
                    text-align: center;
                    margin-top: 35px;
                    font-size: 14px;
                }

                @media print {
                    body {
                        padding: 0;
                    }
                }
            </style>
        </head>

        <body>
            <div class="comprobante">

                <h1>Veterinaria La Mary</h1>
                <h3>COMPROBANTE DE TURNO</h3>

                <div class="dato">
                    <strong>N° de turno:</strong>
                    ${escapar(turno.idTurno)}
                </div>

                <div class="dato">
                    <strong>Fecha y hora:</strong>
                    ${escapar(formatearFecha(turno.fechaHora))}
                </div>

                <div class="dato">
                    <strong>Mascota:</strong>
                    ${escapar(mascota.nombreMascota)}
                </div>

                <div class="dato">
                    <strong>Dueño/a:</strong>
                    ${escapar(mascota.nombreDuenio)}
                </div>

                <div class="dato">
                    <strong>Veterinario:</strong>
                    ${escapar(veterinario.nombre)}
                </div>

                <div class="pie">
                    <p>¡Gracias por confiar en Veterinaria La Mary!</p>
                    <p>Conserve este comprobante para su consulta.</p>
                </div>

            </div>

            <script>
                window.onload = function() {
                    window.print();
                };
            <\/script>
        </body>
        </html>
    `);

    ventana.document.close();
}




// ===== Baja =====
function eliminarTurno(id) {
    if (!confirm('¿Desea eliminar el turno?')) return;

    const indice = turnos.findIndex((t) => t.idTurno === id);
    if (indice === -1) return;

    const [eliminado] = turnos.splice(indice, 1);
    if (!guardarEnLocalStorage()) {
        turnos.splice(indice, 0, eliminado);
        return;
    }
    render();
}

// ===== Eventos =====
listado.addEventListener('click', (evento) => {
    const boton = evento.target.closest('button[data-accion]');
    if (!boton) return;

    const id = boton.dataset.id;

    if (boton.dataset.accion === 'editar') editarTurno(id);
    
    if (boton.dataset.accion === 'imprimir') imprimirComprobante(id);

    if (boton.dataset.accion === 'eliminar') eliminarTurno(id);

});

buscador.addEventListener('input', render);

// ===== Inicio =====
cargarSelects();
render();
