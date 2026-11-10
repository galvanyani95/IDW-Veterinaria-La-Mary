// let para poder modificar el array global si es necesario
let historias = JSON.parse(localStorage.getItem('historiasClinicas')) || [];
const mascotas = JSON.parse(localStorage.getItem('mascotas')) || [];
const veterinarios = JSON.parse(localStorage.getItem('veterinarios')) || [];

const listadoHistorias = document.getElementById('listado-historias');
const total = document.getElementById('total');
const formulario = document.getElementById('form-historia');
const formularioEditar = document.getElementById('form-editar');
const selectMascota = document.getElementById('selectMascota');
const selectVeterinario = document.getElementById('selectVeterinario');
const filtroMascotaSelect = document.getElementById('filtroMascota');

const modalEditar = new bootstrap.Modal(document.getElementById('modal-editar'));
let idHistoriaEditar;

// Cargar opciones en Mascota y Veterinario en el formulario
function cargarSelects() {
    if (selectMascota) {
        selectMascota.innerHTML = '<option value="">Seleccione una mascota...</option>';
        mascotas.forEach((m) => {
            selectMascota.innerHTML += `<option value="${m.idMascota}">${m.nombreMascota} (Dueño: ${m.nombreDuenio})</option>`;
        });
    }

    if (selectVeterinario) {
        selectVeterinario.innerHTML = '<option value="">Seleccione un veterinario...</option>';
        veterinarios.forEach((v) => {
            selectVeterinario.innerHTML += `<option value="${v.idVeterinario}">${v.nombre} - ${v.especializacion}</option>`;
        });
    }
}

// Cargar opciones en Mascota y Veterinario (modal para editar)
function cargarSelectsEdicion() {
    const editarSelectMascota = document.getElementById('editarSelectMascota');
    const editarSelectVeterinario = document.getElementById('editarSelectVeterinario');

    if (editarSelectMascota) {
        editarSelectMascota.innerHTML = '<option value="">Seleccione una mascota...</option>';
        mascotas.forEach((m) => {
            editarSelectMascota.innerHTML += `<option value="${m.idMascota}">${m.nombreMascota} (Dueño: ${m.nombreDuenio})</option>`;
        });
    }

    if (editarSelectVeterinario) {
        editarSelectVeterinario.innerHTML = '<option value="">Seleccione un veterinario...</option>';
        veterinarios.forEach((v) => {
            editarSelectVeterinario.innerHTML += `<option value="${v.idVeterinario}">${v.nombre} - ${v.especializacion}</option>`;
        });
    }
}

// Cargar opciones en el selector de filtro
function cargarFiltroMascotas() {
    if (filtroMascotaSelect) {
        filtroMascotaSelect.innerHTML = '<option value="">Todas las mascotas</option>';
        mascotas.forEach((m) => {
            filtroMascotaSelect.innerHTML += `<option value="${m.idMascota}">${m.nombreMascota}</option>`;
        });
    }
}

function render(idFiltro = '') {
    if (!listadoHistorias) return;
    listadoHistorias.innerHTML = '';

    // filtrar historial si se seleccionó una mascota específica
    const historiasFiltradas = idFiltro 
        ? historias.filter(h => h.mascota === idFiltro)
        : historias;

    historiasFiltradas.forEach((h) => {
        const mascotaObj = mascotas.find((m) => m.idMascota === h.mascota);
        const vetObj = veterinarios.find((v) => v.idVeterinario === h.veterinario);

        // Mostrar los primeros 8 caracteres del UUID 
        const idCorto = h.idHistoriaClinica ? h.idHistoriaClinica.substring(0, 8) + '...' : 'N/D';

        listadoHistorias.innerHTML += `
            <tr>
                <td>
                    <span class="font-monospace text-muted small" title="${h.idHistoriaClinica}">
                        ${idCorto}
                    </span>
                </td>
                <td>${mascotaObj ? mascotaObj.nombreMascota : 'Desconocida'}</td>
                <td>${vetObj ? vetObj.nombre : 'Desconocido'}</td>
                <td>${new Date(h.fechaHora).toLocaleString()}</td>
                <td>${h.observaciones}</td>
                <td class="text-center text-nowrap" style="min-width: 170px;">
                <td class="text-center">
                    <button class="btn btn-danger btn-sm me-2" onclick="eliminarHistoria('${h.idHistoriaClinica}')">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                    <button class="btn btn-warning btn-sm" onclick="editarHistoria('${h.idHistoriaClinica}')">
                        <i class="bi bi-pencil-square"></i> Editar
                    </button>
                </td>
            </tr>
        `;
    });

    if (total) {
        total.textContent = historiasFiltradas.length;
    }
}

// Inicialización de datos al cargar la página
cargarSelects();
cargarFiltroMascotas();
render();

function guardarEnLocalStorage() {
    localStorage.setItem('historiasClinicas', JSON.stringify(historias));
}

// Crear nueva historia clínica
if (formulario) {
    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault();

        const datos = new FormData(formulario);

        const nuevaHistoria = {
            idHistoriaClinica: crypto.randomUUID(),
            mascota: document.getElementById('selectMascota').value,
            veterinario: document.getElementById('selectVeterinario').value,
            fechaHora: datos.get('fechaHora'),
            observaciones: datos.get('observaciones').trim()
        };

        historias.push(nuevaHistoria);

        guardarEnLocalStorage();
        render();
        formulario.reset();
        cargarSelects();
    });
}

// Abrir modal y completar con todos los datos a editar
function editarHistoria(id) {
    const historiaAEditar = historias.find((h) => h.idHistoriaClinica === id);
    
    if (historiaAEditar) {
        idHistoriaEditar = id;
        
        cargarSelectsEdicion();

        // Asignar los valores actuales de la historia seleccionada
        document.getElementById('editarSelectMascota').value = historiaAEditar.mascota;
        document.getElementById('editarSelectVeterinario').value = historiaAEditar.veterinario;
        document.getElementById('editarFechaHora').value = historiaAEditar.fechaHora;
        document.getElementById('editarObservaciones').value = historiaAEditar.observaciones;
        
        // Mostrar el modal
        modalEditar.show();
    }
}

// Guardar los cambios del formulario para editar
if (formularioEditar) {
    formularioEditar.addEventListener('submit', (e) => {
        e.preventDefault();

        try {
            const datos = new FormData(formularioEditar);
            const historia = historias.find((h) => h.idHistoriaClinica === idHistoriaEditar);

            if (historia) {
                historia.mascota = document.getElementById('editarSelectMascota').value;
                historia.veterinario = document.getElementById('editarSelectVeterinario').value;
                historia.fechaHora = datos.get('editarFechaHora');
                historia.observaciones = datos.get('editarObservaciones').trim();

                guardarEnLocalStorage();
                render();
                modalEditar.hide();
                idHistoriaEditar = undefined;
            }
        } catch (error) {
            console.error("Error al actualizar la historia clínica:", error);
        }
    });
}

// Eliminar historia clínica
function eliminarHistoria(id) {
    const confirmar = confirm("¿Está seguro de que desea eliminar esta historia clínica?");

    if (confirmar) {
        const indice = historias.findIndex((h) => h.idHistoriaClinica === id);
        
        if (indice !== -1) {
            historias.splice(indice, 1);
            guardarEnLocalStorage();
            render();
        }
    }
}

// Cambios en el filtro de la tabla
if (filtroMascotaSelect) {
    filtroMascotaSelect.addEventListener('change', (e) => {
        const idMascotaSeleccionada = e.target.value;
        render(idMascotaSeleccionada);
    });
}