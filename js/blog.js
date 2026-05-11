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
const postImageFile = document.getElementById('post-image-file');
const postImageInput = document.getElementById('post-image-input');
const imagePreviewContainer = document.getElementById('image-preview-container');
const imagePreview = document.getElementById('image-preview');
const postContentInput = document.getElementById('post-content-input');
const postFormTitle = document.getElementById('post-form-title');

const postsContainer = document.getElementById('posts-container');

// Variables de estado local para lectura
// Variables de estado local para lectura
const readPostTitle = document.getElementById('read-post-title');
const readPostDate = document.getElementById('read-post-date');
const readPostAuthor = document.getElementById('read-post-author');
const readPostImage = document.getElementById('read-post-image');
const readPostContent = document.getElementById('read-post-content');

// Navegación
if (btnNewPost) {
    btnNewPost.addEventListener('click', () => {
        formPost.reset();
        postIdInput.value = '';
        postImageInput.value = '';
        postImageFile.value = '';
        imagePreviewContainer.style.display = 'none';
        postFormTitle.textContent = 'Nueva Publicación';
        document.dispatchEvent(new CustomEvent('nav-post-form'));
    });
}

// Compresión y carga de imagen
if (postImageFile) {
    postImageFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) {
            imagePreviewContainer.style.display = 'none';
            postImageInput.value = '';
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                // Comprimir usando Canvas para no saturar LocalStorage
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800;
                const scaleSize = MAX_WIDTH / img.width;
                canvas.width = MAX_WIDTH;
                canvas.height = img.height * scaleSize;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                postImageInput.value = compressedBase64;
                
                // Mostrar vista previa
                imagePreview.src = compressedBase64;
                imagePreviewContainer.style.display = 'block';
            };
        };
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
        if (!currentUser) return window.showToast('Debes iniciar sesión', 'error');

        const title = postTitleInput.value.trim();
        const content = postContentInput.value.trim();
        const imageUrl = postImageInput.value.trim();
        const id = postIdInput.value;

        if (!title || !content) {
            return window.showToast('Completa todos los campos obligatorios', 'error');
        }

        const posts = getPosts();

        if (id) {
            // Editar existente
            const index = posts.findIndex(p => p.id === id && p.authorId === currentUser.id);
            if (index !== -1) {
                posts[index].title = title;
                posts[index].content = content;
                posts[index].imageUrl = imageUrl;
                posts[index].updatedAt = new Date().toISOString();
            }
        } else {
            // Crear nuevo
            const newPost = {
                id: Date.now().toString(),
                title,
                content,
                imageUrl,
                liked: false,
                authorId: currentUser.id,
                authorName: currentUser.name,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            posts.push(newPost);
        }

        savePosts(posts);
        window.showToast(id ? 'Publicación actualizada' : 'Publicación creada exitosamente');
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

    posts.forEach((post, index) => {
        const date = new Date(post.createdAt).toLocaleDateString();
        const imgHtml = post.imageUrl ? `<img src="${post.imageUrl}" alt="Thumbnail" style="width: 100%; height: 160px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;">` : '';
        const heartClass = post.liked ? 'ph-heart-fill' : 'ph-heart';
        const likedClass = post.liked ? 'liked' : '';

        const card = document.createElement('div');
        card.className = 'post-card stagger-item';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            ${imgHtml}
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <h3 class="post-title">${post.title}</h3>
                <button class="btn-like ${likedClass}" data-id="${post.id}"><i class="ph ${heartClass}"></i></button>
            </div>
            <div class="post-date">${date}</div>
            <div class="post-excerpt">${post.content}</div>
            <div class="post-actions">
                <button class="btn btn-secondary btn-icon btn-read" data-id="${post.id}"><i class="ph ph-book-open"></i> Leer</button>
                <button class="btn btn-secondary btn-icon btn-edit" data-id="${post.id}"><i class="ph ph-pencil"></i> Editar</button>
                <button class="btn btn-danger btn-icon btn-delete" data-id="${post.id}"><i class="ph ph-trash"></i> Eliminar</button>
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
            const id = e.currentTarget.getAttribute('data-id');
            readPost(id);
        });
    });

    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            editPost(id);
        });
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            deletePost(id);
        });
    });

    document.querySelectorAll('.btn-like').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            toggleLike(id);
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
    
    if (post.imageUrl) {
        readPostImage.src = post.imageUrl;
        readPostImage.style.display = 'block';
    } else {
        readPostImage.style.display = 'none';
        readPostImage.src = '';
    }

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
    postImageInput.value = post.imageUrl || '';
    
    if (post.imageUrl) {
        imagePreview.src = post.imageUrl;
        imagePreviewContainer.style.display = 'block';
    } else {
        imagePreviewContainer.style.display = 'none';
    }
    
    postImageFile.value = '';
    postFormTitle.textContent = 'Editar Publicación';

    document.dispatchEvent(new CustomEvent('nav-post-form'));
};

// Eliminar Post
const deletePost = (id) => {
    window.showConfirmModal(() => {
        const currentUser = JSON.parse(localStorage.getItem('blog_currentUser'));
        let posts = getPosts();
        
        posts = posts.filter(p => !(p.id === id && p.authorId === currentUser.id));
        savePosts(posts);
        
        window.showToast('Publicación eliminada correctamente');
        loadPosts();
    });
};

// Toggle Like
const toggleLike = (id) => {
    const posts = getPosts();
    const index = posts.findIndex(p => p.id === id);
    if (index !== -1) {
        posts[index].liked = !posts[index].liked;
        savePosts(posts);
        loadPosts();
    }
};

// Escuchar evento de carga de dashboard
document.addEventListener('app-load-dashboard', loadPosts);
