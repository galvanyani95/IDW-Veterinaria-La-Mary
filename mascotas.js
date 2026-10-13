// Si hay datos en el localStorage, los cargamos, si no, array vacío
const mascotas = JSON.parse(localStorage.getItem('mascotas')) || [];

const listadoMascotas = document.getElementById('listado-mascotas');
const total = document.getElementById('total');
const formulario = document.getElementById('form-mascota');
const formularioEditar = document.getElementById('form-editar');

// Modal de editar y variable para el ID
const modalEditar = new bootstrap.Modal(document.getElementById('modal-editar'));
let idMascotaEditar;

// Función para cargar y renderizar los datos en la tabla
function render() {
    listadoMascotas.innerHTML = '';

    mascotas.forEach((mascota) => {
        listadoMascotas.innerHTML += `
            <tr>
                <td>${mascota.nombreDuenio}</td>
                <td>${mascota.nombreMascota}</td>
                <td>${mascota.color}</td>
                <td>${mascota.edad}</td>
                <td>${mascota.peso}</td>
                <td class="text-center">
                    <button class="btn btn-danger btn-sm me-2" onclick="eliminarMascota('${mascota.idMascota}')">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                    <button class="btn btn-warning btn-sm" onclick="editarMascota('${mascota.idMascota}')">
                        <i class="bi bi-pencil-square"></i> Editar
                    </button>
                </td>
            </tr>
        `;
    });

    total.textContent = mascotas.length;
}

// Ejecutamos render al cargar la página
render();

function guardarEnLocalStorage() {
    localStorage.setItem('mascotas', JSON.stringify(mascotas));
}

// Manejo del formulario para crear nueva mascota
formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const datos = new FormData(formulario);

    const nuevaMascota = {
        idMascota: crypto.randomUUID(),
        nombreDuenio: datos.get('nombreDuenio').trim(),
        nombreMascota: datos.get('nombreMascota').trim(),
        color: datos.get('color').trim(),
        edad: Number(datos.get('edad')),
        peso: parseFloat(datos.get('peso'))
    };

    mascotas.push(nuevaMascota);
    guardarEnLocalStorage();
    render();
    formulario.reset();
});

// Función para abrir el modal y cargar los datos de la mascota a editar
function editarMascota(id) {
    const mascotaAEditar = mascotas.find((mascota) => mascota.idMascota === id);
    
    if (mascotaAEditar) {
        idMascotaEditar = id;

        // Rellenamos los inputs del modal de editar
        document.getElementById('editarNombreDuenio').value = mascotaAEditar.nombreDuenio;
        document.getElementById('editarNombreMascota').value = mascotaAEditar.nombreMascota;
        document.getElementById('editarColor').value = mascotaAEditar.color;
        document.getElementById('editarEdad').value = mascotaAEditar.edad;
        document.getElementById('editarPeso').value = mascotaAEditar.peso;

        modalEditar.show();
    }
}

// Manejo del formulario de editar
formularioEditar.addEventListener('submit', (e) => {
    e.preventDefault();

    try {
        const datos = new FormData(formularioEditar);
        const mascota = mascotas.find((mascota) => mascota.idMascota === idMascotaEditar);

        if (mascota) {
            mascota.nombreDuenio = datos.get('editarNombreDuenio').trim();
            mascota.nombreMascota = datos.get('editarNombreMascota').trim();
            mascota.color = datos.get('editarColor').trim();
            mascota.edad = Number(datos.get('editarEdad'));
            mascota.peso = parseFloat(datos.get('editarPeso'));

            guardarEnLocalStorage();
            render();
            modalEditar.hide();
            idMascotaEditar = undefined;
        }
    } catch (error) {
        console.error("Error al actualizar la mascota:", error);
    }
});

// Función para eliminar una mascota con confirmación previa y usando findIndex/splice
function eliminarMascota(id) {
    const confirmar = confirm("¿Está seguro de que desea eliminar esta mascota?");

    if (confirmar) {
        const indice = mascotas.findIndex((mascota) => mascota.idMascota === id);
        
        if (indice !== -1) {
            mascotas.splice(indice, 1);
            guardarEnLocalStorage();
            render();
        }
    }
}