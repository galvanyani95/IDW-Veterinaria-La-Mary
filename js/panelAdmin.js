if (!estaLogueado()) {
    window.location.href = 'login.html';
}

const mascotas = JSON.parse(localStorage.getItem('mascotas')) || [];
const veterinarios = JSON.parse(localStorage.getItem('veterinarios')) || [];
const turnos = JSON.parse(localStorage.getItem('turnos')) || [];
const historiaClinica = JSON.parse(localStorage.getItem('historiaClinicas')) || [];

const nombreUsuarioElem = document.getElementById('nombre-usuario');
if (nombreUsuarioElem) {
    nombreUsuarioElem.textContent = sessionStorage.getItem('usuario');
}


const totalMascotasElem = document.getElementById('total-mascotas');
if (totalMascotasElem) {
    totalMascotasElem.textContent = mascotas.length + ' Registradas';
}

const totalVeterinariosElem = document.getElementById('total-veterinarios');
if (totalVeterinariosElem) {
    totalVeterinariosElem.textContent = veterinarios.length + ' Registrados';
}

const totalTurnosElem = document.getElementById('total-turnos');
if (totalTurnosElem) {
    totalTurnosElem.textContent = turnos.length + ' Registrados';
}

const totalHistoriaElem = document.getElementById('total-historia-clinica');
if (totalHistoriaElem) {
    totalHistoriaElem.textContent = historiaClinica.length + ' Registrados';
}

