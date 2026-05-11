// UI State Manager
const viewLogin = document.getElementById('view-login');
const viewRegister = document.getElementById('view-register');
const viewDashboard = document.getElementById('view-dashboard');
const viewPostForm = document.getElementById('view-post-form');
const viewReadPost = document.getElementById('view-read-post');

const linkToRegister = document.getElementById('link-to-register');
const linkToLogin = document.getElementById('link-to-login');

const userGreeting = document.getElementById('user-greeting');

// Funciones de navegación
const hideAllViews = () => {
    viewLogin.classList.add('d-none');
    viewRegister.classList.add('d-none');
    viewDashboard.classList.add('d-none');
    viewPostForm.classList.add('d-none');
    viewReadPost.classList.add('d-none');
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
    try {
        const currentUserStr = localStorage.getItem('blog_currentUser');
        const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
        
        if (currentUser && currentUser.id) {
            if (userGreeting) userGreeting.textContent = `Hola, ${currentUser.name}`;
            showView(viewDashboard);
            document.dispatchEvent(new CustomEvent('app-load-dashboard'));
        } else {
            showView(viewLogin);
        }
    } catch (e) {
        console.error("Error inicializando app", e);
        showView(viewLogin);
    }
};

// Listeners globales
document.addEventListener('auth-success-register', () => showView(viewLogin));
document.addEventListener('auth-login-success', initApp);
document.addEventListener('auth-logout-success', initApp);

// Blog navigation events
document.addEventListener('nav-dashboard', () => showView(viewDashboard));
document.addEventListener('nav-post-form', () => showView(viewPostForm));
document.addEventListener('nav-read-post', () => showView(viewReadPost));

// Ejecutar al cargar
document.addEventListener('DOMContentLoaded', initApp);
