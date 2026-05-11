// UI State Manager
const viewLogin = document.getElementById('view-login');
const viewRegister = document.getElementById('view-register');
const viewDashboard = document.getElementById('view-dashboard');

const linkToRegister = document.getElementById('link-to-register');
const linkToLogin = document.getElementById('link-to-login');

const userGreeting = document.getElementById('user-greeting');

// Funciones de navegación
const hideAllViews = () => {
    viewLogin.classList.add('d-none');
    viewRegister.classList.add('d-none');
    viewDashboard.classList.add('d-none');
};

const showView = (view) => {
    hideAllViews();
    view.classList.remove('d-none');
};

// Cambiar entre Login y Registro
if (linkToRegister) linkToRegister.addEventListener('click', (e) => { e.preventDefault(); showView(viewRegister); });
if (linkToLogin) linkToLogin.addEventListener('click', (e) => { e.preventDefault(); showView(viewLogin); });

// Inicializar aplicación
const initApp = () => {
    const currentUser = JSON.parse(localStorage.getItem('blog_currentUser'));
    if (currentUser) {
        if (userGreeting) userGreeting.textContent = `Hola, ${currentUser.name}`;
        showView(viewDashboard);
        document.dispatchEvent(new CustomEvent('app-load-dashboard'));
    } else {
        showView(viewLogin);
    }
};

// Listeners globales
document.addEventListener('auth-success-register', () => showView(viewLogin));
document.addEventListener('auth-login-success', initApp);
document.addEventListener('auth-logout-success', initApp);

// Ejecutar al cargar
document.addEventListener('DOMContentLoaded', initApp);
