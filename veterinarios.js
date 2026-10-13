const veterinarios = JSON.parse(localStorage.getItem('veterinarios')) || [];

const listadoVeterinarios = document.getElementById('listado-veterinarios');
const total = document.getElementById('total');
const formulario = document.getElementById('form-veterinarios');
const formularioEditar = document.getElementById('form-editar');
const modalEditar = new bootstrap.Modal(document.getElementById('modal-editar'));
let idveterinarioEditar;

function render() {
    listadoVeterinarios.innerHTML = '';

    veterinarios.forEach((veterinario) => {
        listadoVeterinarios.innerHTML += `
            <tr>
                <td>${veterinario.matricula}</td>
                <td>${veterinario.nombre}</td>
                <td>${veterinario.especializacion}</td>
                <td>${veterinario.valorConsulta}</td>
                <td class="text-center">
                    <button class="btn btn-danger btn-sm me-2" onclick="eliminarVeterinario('${veterinario.idVeterinario}')">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                    <button class="btn btn-warning btn-sm" onclick="editarVeterinario('${veterinario.idVeterinario}')">
                        <i class="bi bi-pencil-square"></i> Editar
                    </button>
                </td>
            </tr>
        `;
    });

    total.textContent = veterinarios.length;
}

render();

function guardarEnLocalStorage() {
    localStorage.setItem('veterinarios', JSON.stringify(veterinarios));
}

formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const datos = new FormData(formulario);

    const nuevoVeterinario = {
        idVeterinario: crypto.randomUUID(),
        matricula: Number(datos.get('matricula')),
        nombre: datos.get('nombre').trim(),
        especializacion: datos.get('especializacion').trim(),
        valorConsulta: parseFloat(datos.get('valorConsulta')),
    };

    veterinarios.push(nuevoVeterinario);
    guardarEnLocalStorage();
    render();
    renderCatalogo();
    formulario.reset();
});


function eliminarVeterinario(id) {
    const confirmar = confirm("¿Desea eliminar el profesional?");

    if (confirmar) {
        const indice = veterinarios.findIndex((veterinario) => veterinario.idVeterinario === id);
        
        if (indice !== -1) {
            veterinarios.splice(indice, 1);
            guardarEnLocalStorage();
            render();
            renderCatalogo();
        }
    }
}

function editarVeterinario(id) {
    const veterinarioEditar = veterinarios.find((veterinario) => veterinario.idVeterinario === id);
    
    if (veterinarioEditar) {
        idveterinarioEditar = id;

        document.getElementById('editarMatricula').value = veterinarioEditar.matricula;
        document.getElementById('editarNombre').value = veterinarioEditar.nombre;
        document.getElementById('editarEspecializacion').value = veterinarioEditar.especializacion;
        document.getElementById('editarValorConsulta').value = veterinarioEditar.valorConsulta;

        modalEditar.show();
    }
}

formularioEditar.addEventListener('submit', (e) => {
    e.preventDefault();

    try {
        const datos = new FormData(formularioEditar);
        const veterinarioActualizado = veterinarios.find((v) => v.idVeterinario === idveterinarioEditar);


        if (veterinarioActualizado) {
            veterinarioActualizado.matricula = Number(datos.get('editarMatricula'));
            veterinarioActualizado.nombre = datos.get('editarNombre').trim();
            veterinarioActualizado.especializacion = datos.get('editarEspecializacion').trim();
            veterinarioActualizado.valorConsulta = parseFloat(datos.get('editarValorConsulta'));
 

            guardarEnLocalStorage();
            render();
            renderCatalogo();
            modalEditar.hide();
            idveterinarioEditar= undefined;
        }
    } catch (error) {
        console.error("Error al actualizar el profesional:", error);
    }
});


// Para el html
// <div id="catalogo-veterinarios" class="row"></div>


const catalogo = document.getElementById('catalogo-veterinarios');

function renderCatalogo() {
    catalogo.innerHTML = '';

    veterinarios.forEach(v => {
        catalogo.innerHTML += `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${v.nombre}</h5>
                        <p class="card-text">
                            Matrícula: ${v.matricula}<br>
                            Especialización: ${v.especializacion}<br>
                            Valor consulta: $${v.valorConsulta}
                        </p>
                    </div>
                </div>
            </div>
        `;
    });
}

renderCatalogo();

// Para el html
// <input type="text" id="buscador" class="form-control mb-3" placeholder="Buscar veterinario">

document.getElementById('buscador').addEventListener('input', (e) => {
    const texto = e.target.value.toLowerCase();

    const filtrados = veterinarios.filter(v =>
        v.nombre.toLowerCase().includes(texto) ||
        v.especializacion.toLowerCase().includes(texto)
    );

    renderFiltrados(filtrados);
});

function renderFiltrados(lista) {
    listadoVeterinarios.innerHTML = '';

    lista.forEach(v => {
        listadoVeterinarios.innerHTML += `
            <tr>
                <td>${v.matricula}</td>
                <td>${v.nombre}</td>
                <td>${v.especializacion}</td>
                <td>${v.valorConsulta}</td>
                <td class="text-center">
                    <button class="btn btn-danger btn-sm me-2" onclick="eliminarVeterinario('${v.idVeterinario}')">Eliminar</button>
                    <button class="btn btn-warning btn-sm" onclick="editarVeterinario('${v.idVeterinario}')">Editar</button>
                </td>
            </tr>
        `;
    });
}
