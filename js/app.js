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

// Funciones globales (Toast y Modal)
window.showToast = (message, type = 'success') => {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? '<i class="ph ph-check-circle" style="color: #10b981; font-size: 1.2rem;"></i>' 
                                    : '<i class="ph ph-warning-circle" style="color: var(--error-color); font-size: 1.2rem;"></i>';
    
    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

window.showConfirmModal = (onConfirm) => {
    const modal = document.getElementById('confirm-modal');
    modal.classList.remove('d-none');
    
    const btnCancel = document.getElementById('btn-modal-cancel');
    const btnConfirm = document.getElementById('btn-modal-confirm');
    
    // Remove old listeners to avoid multiple fires
    const newCancel = btnCancel.cloneNode(true);
    const newConfirm = btnConfirm.cloneNode(true);
    btnCancel.parentNode.replaceChild(newCancel, btnCancel);
    btnConfirm.parentNode.replaceChild(newConfirm, btnConfirm);
    
    newCancel.addEventListener('click', () => modal.classList.add('d-none'));
    newConfirm.addEventListener('click', () => {
        modal.classList.add('d-none');
        onConfirm();
    });
};

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
