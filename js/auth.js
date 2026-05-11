// Utilidades de LocalStorage para usuarios
const getUsers = () => JSON.parse(localStorage.getItem('blog_users')) || [];
const saveUsers = (users) => localStorage.setItem('blog_users', JSON.stringify(users));

// Elementos del DOM
const formRegister = document.getElementById('form-register');
const registerName = document.getElementById('register-name');
const registerEmail = document.getElementById('register-email');
const registerPassword = document.getElementById('register-password');

// Registro de usuarios
if (formRegister) {
    formRegister.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = registerName.value.trim();
        const email = registerEmail.value.trim();
        const password = registerPassword.value.trim();

        if (!name || !email || !password) {
            alert('Todos los campos son obligatorios');
            return;
        }

        const users = getUsers();
        
        // Verificar si el correo ya existe
        if (users.find(u => u.email === email)) {
            alert('Este correo ya está registrado');
            return;
        }

        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password // En un entorno real se usaría hash, aquí se guarda en texto plano por LocalStorage
        };

        users.push(newUser);
        saveUsers(users);
        
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        formRegister.reset();
        
        // Cambiar a vista de login (se despacha un evento personalizado para app.js)
        document.dispatchEvent(new CustomEvent('auth-success-register'));
    });
}
