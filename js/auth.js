// Utilidades de LocalStorage para usuarios
const getUsers = () => JSON.parse(localStorage.getItem('blog_users')) || [];
const saveUsers = (users) => localStorage.setItem('blog_users', JSON.stringify(users));

// Session util
const setCurrentUser = (user) => localStorage.setItem('blog_currentUser', JSON.stringify(user));
const getCurrentUser = () => JSON.parse(localStorage.getItem('blog_currentUser'));

// Elementos del DOM
const formRegister = document.getElementById('form-register');
const registerName = document.getElementById('register-name');
const registerEmail = document.getElementById('register-email');
const registerPassword = document.getElementById('register-password');

const formLogin = document.getElementById('form-login');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');

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
        
        if (users.find(u => u.email === email)) {
            alert('Este correo ya está registrado');
            return;
        }

        const newUser = { id: Date.now().toString(), name, email, password };

        users.push(newUser);
        saveUsers(users);
        
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        formRegister.reset();
        document.dispatchEvent(new CustomEvent('auth-success-register'));
    });
}

// Login de usuarios
if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = loginEmail.value.trim();
        const password = loginPassword.value.trim();

        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Guardar en sesión
            setCurrentUser({ id: user.id, name: user.name, email: user.email });
            formLogin.reset();
            document.dispatchEvent(new CustomEvent('auth-login-success'));
        } else {
            alert('Credenciales incorrectas');
        }
    });
}
