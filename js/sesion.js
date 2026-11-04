function obtenerToken() {
    return sessionStorage.getItem('accessToken');
}

function estaLogueado() {
    return obtenerToken() !== null;
}

function cerrarSesion() {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('usuario');
    window.location.href = 'login.html';
}

function actualizarNavbar() {
    const navContainer = document.querySelector('.navbar-nav');
    if (!navContainer) return;

    if (estaLogueado()) {
        navContainer.innerHTML = `
            <a href="index.html" class="nav-link">Inicio</a>
            <a href="contacto.html" class="nav-link">Contacto</a>              
            <a href="institucional.html" class="nav-link">Institucional</a>
            <a href="panelAdmin.html" class="nav-link">Panel Admin</a>
            <button class="btn btn-secondary ms-lg-2" onclick="cerrarSesion()">Cerrar sesión</button>
        `;
    }
}

// NUEVO: Validación para proteger páginas privadas
document.addEventListener('DOMContentLoaded', () => {
    actualizarNavbar();

    // Obtenemos el nombre del archivo actual (ej: 'mascotas.html', 'panelAdmin.html')
    const paginaActual = window.location.pathname.split('/').pop();

    // Páginas públicas donde permitimos entrar sin loguearse
    const paginasPublicas = ['index.html', 'contacto.html', 'institucional.html', ''];

    // Si no está logueado y la página actual NO es pública, redirigir al index
    if (!estaLogueado() && !paginasPublicas.includes(paginaActual)) {
        window.location.href = 'login.html';
    }
});