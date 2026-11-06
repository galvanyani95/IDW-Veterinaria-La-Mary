// 'let' para poder modificar el array global si es necesario
let historias = JSON.parse(localStorage.getItem('historiasClinicas')) || [];
const mascotas = JSON.parse(localStorage.getItem('mascotas')) || [];
const veterinarios = JSON.parse(localStorage.getItem('veterinarios')) || [];

const listadoHistorias = document.getElementById('listado-historias');
const total = document.getElementById('total');
const formulario = document.getElementById('form-historia');
const formularioEditar = document.getElementById('form-editar');
const selectMascota = document.getElementById('selectMascota');
const selectVeterinario = document.getElementById('selectVeterinario');

const modalEditar = new bootstrap.Modal(document.getElementById('modal-editar'));
let idHistoriaEditar;

// Cargar opciones en Mascota y Veterinario
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

function render() {
    if (!listadoHistorias) return;
    listadoHistorias.innerHTML = '';

    historias.forEach((h) => {
        const mascotaObj = mascotas.find((m) => m.idMascota === h.mascota);
        const vetObj = veterinarios.find((v) => v.idVeterinario === h.veterinario);

        listadoHistorias.innerHTML += `
            <tr>
                <td>${mascotaObj ? mascotaObj.nombreMascota : 'Desconocida'}</td>
                <td>${vetObj ? vetObj.nombre : 'Desconocido'}</td>
                <td>${new Date(h.fechaHora).toLocaleString()}</td>
                <td>${h.observaciones}</td>
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
        total.textContent = historias.length;
    }
}


cargarSelects();
render();

function guardarEnLocalStorage() {
    localStorage.setItem('historiasClinicas', JSON.stringify(historias));
}

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

function editarHistoria(id) {
    const historiaAEditar = historias.find((h) => h.idHistoriaClinica === id);
    
    if (historiaAEditar) {
        idHistoriaEditar = id;
        document.getElementById('editarObservaciones').value = historiaAEditar.observaciones;
        modalEditar.show();
    }
}

if (formularioEditar) {
    formularioEditar.addEventListener('submit', (e) => {
        e.preventDefault();

        try {
            const datos = new FormData(formularioEditar);
            const historia = historias.find((h) => h.idHistoriaClinica === idHistoriaEditar);

            if (historia) {
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