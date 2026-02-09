        /* ============================
           CONTADOR
        ============================ */
        function actualizarContador() {
            const objetivo = new Date("2026-10-17T12:00:00");
            const ahora = new Date();
            const diferencia = objetivo - ahora;

            if (diferencia <= 0) {
                document.querySelector(".countdown").innerHTML = "¡Hoy es el gran día!";
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
           ANIMACIONES AL HACER SCROLL
        ============================ */
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.2 });

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
           GALERÍA POLAROID (AUTOMÁTICA)
        ============================ */

        // Lista de imágenes en el orden EXACTO que tú quieras (opción C)
        const archivosGaleria = [
            "Atardecer en Jaraiz.jpg",
            "Atardecer en Portugal.jpg"
        ];

        const galeriaGrid = document.getElementById('galeriaGrid');
        let indiceActual = 0; // Para el lightbox

        // Generar tarjetas polaroid
        archivosGaleria.forEach((nombreArchivo, index) => {
            const ruta = "fotos_galeria/" + nombreArchivo;
            const sinExtension = nombreArchivo.replace(/\.[^/.]+$/, "");
            const titulo = sinExtension.replace(/_/g, " ");

            const card = document.createElement('div');
            card.className = 'polaroid';

            const img = document.createElement('img');
            img.src = ruta;
            img.alt = titulo;
            img.dataset.index = index; // Para saber qué foto abrir
            img.loading = "lazy";

            const caption = document.createElement('div');
            caption.className = 'polaroid-title';
            caption.textContent = titulo;

            card.appendChild(img);
            card.appendChild(caption);
            galeriaGrid.appendChild(card);
        });

        /* ============================
           LIGHTBOX: ABRIR IMAGEN
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
            escala = 1; // reset zoom
            lightboxImg.style.transform = "scale(1)";
        }

        /* ============================
           LIGHTBOX: CERRAR
        ============================ */

        const btnCerrar = document.querySelector('.lightbox-close');

        btnCerrar.addEventListener('click', cerrarLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) cerrarLightbox();
        });

        function cerrarLightbox() {
            lightbox.classList.remove('visible');
        }

        /* ============================
           LIGHTBOX: FLECHAS ← →
        ============================ */

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

        /* ============================
           LIGHTBOX: ZOOM TÁCTIL
        ============================ */

        let escala = 1;
        let distanciaInicial = 0;

        lightboxImg.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                distanciaInicial = distanciaEntreDedos(e.touches);
            }
        });

        lightboxImg.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2) {
                const nuevaDistancia = distanciaEntreDedos(e.touches);
                const factor = nuevaDistancia / distanciaInicial;

                escala = Math.min(Math.max(1, factor), 4); // zoom entre 1x y 4x
                lightboxImg.style.transform = `scale(${escala})`;
            }
        });

        function distanciaEntreDedos(touches) {
            const dx = touches[0].clientX - touches[1].clientX;
            const dy = touches[0].clientY - touches[1].clientY;
            return Math.sqrt(dx * dx + dy * dy);
        }

        /* ============================
           LIGHTBOX: SWIPE HACIA ABAJO PARA CERRAR
        ============================ */

        let inicioY = 0;

        lightboxImg.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                inicioY = e.touches[0].clientY;
            }
        });

        lightboxImg.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) {
                const actualY = e.touches[0].clientY;
                const desplazamiento = actualY - inicioY;

                if (desplazamiento > 120 && escala === 1) {
                    cerrarLightbox();
                }
            }
        });
