/* ============================
   CONTADOR
============================ */
function actualizarContador() {
    const objetivo = new Date("2026-10-17T12:00:00Z");
    const ahora = new Date();
    const diferencia = objetivo - ahora;

    if (diferencia <= 0) {
        document.querySelector(".countdown").innerHTML = "<p style='font-family:Great Vibes;font-size:2rem;color:#D4B483'>¡Hoy es el gran día!</p>";
        return;
    }

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diferencia / (1000 * 60)) % 60);
    const segundos = Math.floor((diferencia / 1000) % 60);

    document.getElementById("days").textContent = dias;
    document.getElementById("hours").textContent = horas;
    document.getElementById("minutes").textContent = minutos;
    document.getElementById("seconds").textContent = segundos;
}

setInterval(actualizarContador, 1000);
actualizarContador();

/* ============================
   CURSOR GLOW
============================ */
const cursorGlow = document.getElementById('cursor-glow');

document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top  = e.clientY + 'px';
});

/* ============================
   EFECTO "LETRA SURGE" AL MOVER CURSOR
   Ilumina el texto al pasar el ratón
============================ */
/* ============================
   EFECTO "LETRA SURGE" AL MOVER CURSOR
   Ilumina el elemento completo al pasar el ratón
   (sin fragmentar el texto en spans para no romper el layout)
============================ */
document.querySelectorAll('.reveal-cursor').forEach(el => {
    // Arranca con opacidad reducida
    el.style.transition = 'opacity 0.6s ease, text-shadow 0.6s ease';
    el.style.opacity = '0.55';

    // Al entrar: revela completamente con brillo
    el.addEventListener('mouseenter', () => {
        el.style.opacity = '1';
        el.style.textShadow = '0 0 30px rgba(212,180,131,0.6)';
    });

    // Al salir: vuelve al estado inicial suavemente
    el.addEventListener('mouseleave', () => {
        el.style.opacity = '0.55';
        el.style.textShadow = '';
    });
});

/* ============================
   ANIMACIONES AL HACER SCROLL
============================ */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('section.animate').forEach(sec => observer.observe(sec));

/* ============================
   BOTÓN VOLVER ARRIBA
============================ */
const btnTop = document.getElementById('btnTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        btnTop.classList.add('visible');
    } else {
        btnTop.classList.remove('visible');
    }
});

btnTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================
   GALERÍA POLAROID
============================ */
document.addEventListener("DOMContentLoaded", () => {

    const archivosGaleria = [
        "Atardecer en Jaraiz.jpg",
        "Atardecer en Portugal.jpg"
    ];

    const galeriaGrid = document.getElementById('galeriaGrid');
    let indiceActual = 0;
    let escala = 1;

    archivosGaleria.forEach((nombreArchivo, index) => {
        const ruta = "fotos_galeria/" + nombreArchivo;
        const sinExtension = nombreArchivo.replace(/\.[^/.]+$/, "");
        const titulo = sinExtension.replace(/_/g, " ");

        const card = document.createElement('div');
        card.className = 'polaroid';

        const img = document.createElement('img');
        img.src = ruta;
        img.alt = titulo;
        img.dataset.index = index;
        img.loading = "lazy";

        const caption = document.createElement('div');
        caption.className = 'polaroid-title';
        caption.textContent = titulo;

        card.appendChild(img);
        card.appendChild(caption);
        galeriaGrid.appendChild(card);
    });

    /* ============================
       LIGHTBOX
    ============================ */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    document.querySelectorAll('.polaroid img').forEach(img => {
        img.addEventListener('click', () => {
            indiceActual = parseInt(img.dataset.index);
            abrirLightbox(indiceActual);
        });
    });

    function abrirLightbox(indice) {
        lightboxImg.src = "fotos_galeria/" + archivosGaleria[indice];
        lightbox.classList.add('visible');
        escala = 1;
        lightboxImg.style.transform = "scale(1)";
    }

    const btnCerrar = document.querySelector('.lightbox-close');
    btnCerrar.addEventListener('click', cerrarLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) cerrarLightbox();
    });

    function cerrarLightbox() {
        lightbox.classList.remove('visible');
    }

    const flechaIzq = document.querySelector('.arrow-left');
    const flechaDer = document.querySelector('.arrow-right');

    flechaIzq.addEventListener('click', () => {
        indiceActual = (indiceActual - 1 + archivosGaleria.length) % archivosGaleria.length;
        abrirLightbox(indiceActual);
    });

    flechaDer.addEventListener('click', () => {
        indiceActual = (indiceActual + 1) % archivosGaleria.length;
        abrirLightbox(indiceActual);
    });

    /* Zoom táctil + swipe combinados en listeners unificados */
    let distanciaInicial = 0;
    let inicioY = 0;
    let gestoDosD = false;

    lightboxImg.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            gestoDosD = true;
            distanciaInicial = distanciaEntreDedos(e.touches);
        } else if (e.touches.length === 1) {
            gestoDosD = false;
            inicioY = e.touches[0].clientY;
        }
    });

    lightboxImg.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2 && gestoDosD) {
            const nuevaDistancia = distanciaEntreDedos(e.touches);
            const factor = nuevaDistancia / distanciaInicial;
            escala = Math.min(Math.max(1, factor), 4);
            lightboxImg.style.transform = `scale(${escala})`;
        } else if (e.touches.length === 1 && !gestoDosD) {
            const desplazamiento = e.touches[0].clientY - inicioY;
            if (desplazamiento > 120 && escala === 1) {
                cerrarLightbox();
            }
        }
    });

    function distanciaEntreDedos(touches) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
});

/* ============================
   MENÚ HAMBURGUESA
============================ */
const menuToggle = document.getElementById("menuToggle");
const nav = document.querySelector("nav");

menuToggle.addEventListener("click", () => {
    nav.classList.toggle("expanded");
    menuToggle.setAttribute(
        "aria-label",
        nav.classList.contains("expanded") ? "Cerrar menú" : "Abrir menú"
    );
});

document.querySelectorAll("nav a").forEach(enlace => {
    enlace.addEventListener("click", () => {
        nav.classList.remove("expanded");
        menuToggle.setAttribute("aria-label", "Abrir menú");
    });
});

/* ============================
   OCULTAR MENÚ AL HACER SCROLL
============================ */
let ultimaPos = 0;

window.addEventListener("scroll", () => {
    if (nav.classList.contains("expanded")) return;

    const actual = window.scrollY;

    if (actual > ultimaPos && actual > 80) {
        nav.style.transform = "translateY(-100%)";
    } else {
        nav.style.transform = "translateY(0)";
    }

    ultimaPos = actual;
});
