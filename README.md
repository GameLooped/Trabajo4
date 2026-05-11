# Blog Personal con Autenticación

Este es un proyecto de aplicación web tipo Blog desarrollado con Vanilla JavaScript, HTML5 y CSS3. Permite a los usuarios registrarse, iniciar sesión y gestionar sus propias publicaciones (CRUD) con persistencia local de datos.

## Características Principales

*   **Autenticación Local:** Registro y login de usuarios con credenciales guardadas en `LocalStorage`.
*   **Gestión de Publicaciones (CRUD):** Creación, lectura, edición y eliminación de posts.
*   **Soporte de Imágenes:** Permite subir imágenes locales que son comprimidas automáticamente (vía HTML5 Canvas) para optimizar el almacenamiento.
*   **Diseño Premium UI/UX:**
    *   Dark Mode por defecto.
    *   Efectos de *Glassmorphism* (desenfoque de fondo).
    *   Notificaciones tipo *Toast* y ventanas modales personalizadas.
    *   Animaciones fluidas y diseño responsivo.
*   **Gestión de Estado:** Manejo dinámico del DOM sin recargar la página (SPA - Single Page Application).

## Tecnologías Utilizadas

*   HTML5
*   CSS3 (Variables CSS, Flexbox, Grid, Animaciones)
*   JavaScript (ES6+, DOM Manipulation, LocalStorage, Canvas API)
*   [Phosphor Icons](https://phosphoricons.com/) para iconografía vectorial.

## Instalación y Uso

1. Clonar este repositorio.
2. Abrir el archivo `index.html` en cualquier navegador web moderno.
3. Registrar un usuario nuevo para acceder al Dashboard y comenzar a publicar.