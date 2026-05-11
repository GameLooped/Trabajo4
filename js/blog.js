// Utilidades de LocalStorage para posts
const getPosts = () => JSON.parse(localStorage.getItem('blog_posts')) || [];
const savePosts = (posts) => localStorage.setItem('blog_posts', JSON.stringify(posts));

// Elementos del DOM
const btnNewPost = document.getElementById('btn-new-post');
const btnCancelPost = document.getElementById('btn-cancel-post');
const btnBackToDashboard = document.getElementById('btn-back-to-dashboard');

const formPost = document.getElementById('form-post');
const postIdInput = document.getElementById('post-id');
const postTitleInput = document.getElementById('post-title-input');
const postContentInput = document.getElementById('post-content-input');
const postFormTitle = document.getElementById('post-form-title');

const postsContainer = document.getElementById('posts-container');

// Variables de estado local para lectura
const readPostTitle = document.getElementById('read-post-title');
const readPostDate = document.getElementById('read-post-date');
const readPostAuthor = document.getElementById('read-post-author');
const readPostContent = document.getElementById('read-post-content');

// Navegación
if (btnNewPost) {
    btnNewPost.addEventListener('click', () => {
        formPost.reset();
        postIdInput.value = '';
        postFormTitle.textContent = 'Nueva Publicación';
        document.dispatchEvent(new CustomEvent('nav-post-form'));
    });
}

if (btnCancelPost) {
    btnCancelPost.addEventListener('click', () => {
        document.dispatchEvent(new CustomEvent('nav-dashboard'));
    });
}

if (btnBackToDashboard) {
    btnBackToDashboard.addEventListener('click', () => {
        document.dispatchEvent(new CustomEvent('nav-dashboard'));
    });
}

// Guardar/Editar Post
if (formPost) {
    formPost.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const currentUser = JSON.parse(localStorage.getItem('blog_currentUser'));
        if (!currentUser) return alert('Debes iniciar sesión');

        const title = postTitleInput.value.trim();
        const content = postContentInput.value.trim();
        const id = postIdInput.value;

        if (!title || !content) {
            return alert('Completa todos los campos');
        }

        const posts = getPosts();

        if (id) {
            // Editar existente
            const index = posts.findIndex(p => p.id === id && p.authorId === currentUser.id);
            if (index !== -1) {
                posts[index].title = title;
                posts[index].content = content;
                posts[index].updatedAt = new Date().toISOString();
            }
        } else {
            // Crear nuevo
            const newPost = {
                id: Date.now().toString(),
                title,
                content,
                authorId: currentUser.id,
                authorName: currentUser.name,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            posts.push(newPost);
        }

        savePosts(posts);
        document.dispatchEvent(new CustomEvent('nav-dashboard'));
        loadPosts(); // Recargar la lista
    });
}

// Cargar y Listar Posts
const loadPosts = () => {
    if (!postsContainer) return;
    
    const currentUser = JSON.parse(localStorage.getItem('blog_currentUser'));
    if (!currentUser) return;

    const posts = getPosts().filter(p => p.authorId === currentUser.id);
    
    // Ordenar por fecha más reciente
    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    postsContainer.innerHTML = '';

    if (posts.length === 0) {
        postsContainer.innerHTML = '<div class="no-posts-msg">Aún no tienes publicaciones. ¡Crea la primera!</div>';
        return;
    }

    posts.forEach(post => {
        const date = new Date(post.createdAt).toLocaleDateString();
        
        const card = document.createElement('div');
        card.className = 'post-card';
        card.innerHTML = `
            <h3 class="post-title">${post.title}</h3>
            <div class="post-date">${date}</div>
            <div class="post-excerpt">${post.content}</div>
            <div class="post-actions">
                <button class="btn btn-secondary btn-icon btn-read" data-id="${post.id}">Leer</button>
                <button class="btn btn-secondary btn-icon btn-edit" data-id="${post.id}">Editar</button>
                <button class="btn btn-danger btn-icon btn-delete" data-id="${post.id}">Eliminar</button>
            </div>
        `;
        postsContainer.appendChild(card);
    });

    attachPostEvents();
};

// Adjuntar eventos a los botones de las tarjetas
const attachPostEvents = () => {
    document.querySelectorAll('.btn-read').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            readPost(id);
        });
    });

    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            editPost(id);
        });
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            deletePost(id);
        });
    });
};

// Leer Post
const readPost = (id) => {
    const posts = getPosts();
    const post = posts.find(p => p.id === id);
    if (!post) return;

    readPostTitle.textContent = post.title;
    readPostDate.textContent = new Date(post.createdAt).toLocaleDateString();
    readPostAuthor.textContent = post.authorName;
    readPostContent.textContent = post.content;

    document.dispatchEvent(new CustomEvent('nav-read-post'));
};

// Editar Post
const editPost = (id) => {
    const currentUser = JSON.parse(localStorage.getItem('blog_currentUser'));
    const posts = getPosts();
    const post = posts.find(p => p.id === id && p.authorId === currentUser.id);
    
    if (!post) return;

    postIdInput.value = post.id;
    postTitleInput.value = post.title;
    postContentInput.value = post.content;
    postFormTitle.textContent = 'Editar Publicación';

    document.dispatchEvent(new CustomEvent('nav-post-form'));
};

// Eliminar Post
const deletePost = (id) => {
    if (!confirm('¿Estás seguro de eliminar esta publicación?')) return;

    const currentUser = JSON.parse(localStorage.getItem('blog_currentUser'));
    let posts = getPosts();
    
    posts = posts.filter(p => !(p.id === id && p.authorId === currentUser.id));
    savePosts(posts);
    
    loadPosts();
};

// Escuchar evento de carga de dashboard
document.addEventListener('app-load-dashboard', loadPosts);
