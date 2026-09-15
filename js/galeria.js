// ==========================================
// GALERIA - RePercussion Trio
// ==========================================


// ==========================================
// FOTOGRAFIAS
// ==========================================

const photos = [
    {
        thumb: '/imagens/galeria/foto1.jpg',
        full: '/imagens/galeria/foto1.jpg',
        alt: 'RePercussion Trio - Intermitências',
        size: 'large'
    },

    {
        thumb: '/imagens/galeria/foto2.jpg',
        full: '/imagens/galeria/foto2.jpg',
        alt: 'RePercussion Trio - Intermitências',
        size: 'small'
    },

    {
        thumb: '/imagens/galeria/foto3.jpg',
        full: '/imagens/galeria/foto3.jpg',
        alt: 'RePercussion Trio - Póvoa de Varzim',
        size: 'medium'
    },

    {
        thumb: '/imagens/galeria/foto4.jpg',
        full: '/imagens/galeria/foto4.jpg',
        alt: 'RePercussion Trio - Um Quadro',
        size: 'small'
    },

    {
        thumb: '/imagens/galeria/foto5.jpg',
        full: '/imagens/galeria/foto5.jpg',
        alt: 'RePercussion Trio - Decoder',
        size: 'small'
    },

    {
        thumb: '/imagens/galeria/foto6.jpg',
        full: '/imagens/galeria/foto6.jpg',
        alt: 'RePercussion Trio - Um Quadro',
        size: 'medium'
    }

    // Para adicionar mais fotografias:
    //
    // {
    //     thumb: '/imagens/galeria/foto7.jpg',
    //     full: '/imagens/galeria/foto7.jpg',
    //     alt: 'RePercussion Trio',
    //     size: 'medium'
    // }
];


// ==========================================
// VÍDEOS YOUTUBE
// ==========================================

const videos = [

    {
        id: 'EwRCXJEFdnM',
        title: 'BK',
        composer: 'Maria Vittoria Agresti',
        year: '2024'
    },

    {
        id: 'NGF_QhZKx_s',
        title: 'Musique de Table',
        composer: 'Thierry de Mey',
        year: '1987'
    },

    {
        id: 'Ixwtmh-hVBk',
        title: 'Psychedelic Industrial',
        composer: 'Carlos Guedes',
        year: '2022'
    },

    {
        id: '-1yYJOTor2Y',
        title: 'VUOI CHE NEL FUORI',
        composer: 'Marco Momi',
        year: '2020'
    },

    {
        id: 'pVqMi05E52M',
        title: 'Pointless Dream',
        composer: 'Olívia Silva',
        year: '2020'
    },

    {
        id: 'gR9JXiznWq0',
        title: 'Zoom in Zoom out',
        composer: 'Luís Tinoco',
        year: '2009'
    }

    // Para adicionar mais vídeos:
    //
    // {
    //     id: 'IDdoVideoYoutube',
    //     title: 'Título',
    //     composer: 'Compositor',
    //     year: 'Ano'
    // }
];


// Índice do vídeo atualmente selecionado no preview grande
let currentVideoIndex = 0;


// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener('DOMContentLoaded', function () {

    initGalleryTabs();

    loadPhotosGallery();

    loadVideoViewer();

    initLightbox();

});


// ==========================================
// TABS FOTOS / VÍDEOS
// ==========================================

function initGalleryTabs() {

    const tabs =
        document.querySelectorAll('.gallery-tab');

    const sectionFotos =
        document.getElementById('gallery-section-fotos');

    const sectionVideos =
        document.getElementById('gallery-section-videos');

    if (!tabs.length || !sectionFotos || !sectionVideos) {
        return;
    }

    tabs.forEach(function (tab) {

        tab.addEventListener('click', function () {

            tabs.forEach(function (t) {
                t.classList.remove('active');
            });

            tab.classList.add('active');

            const target = tab.dataset.tab;

            if (target === 'fotos') {

                sectionFotos.hidden = false;
                sectionVideos.hidden = true;

                // Pára o vídeo quando sai da aba de vídeos
                stopVideoViewer();

            } else {

                sectionFotos.hidden = true;
                sectionVideos.hidden = false;

                // Carrega (sem autoplay) o vídeo atualmente selecionado
                playCurrentVideo();

            }

        });

    });

}


// ==========================================
// GALERIA DE FOTOS (MASONRY)
// ==========================================

function loadPhotosGallery() {

    const masonry =
        document.getElementById('gallery-masonry');

    if (!masonry) {
        console.error(
            'Elemento #gallery-masonry não encontrado.'
        );
        return;
    }

    masonry.innerHTML = '';

    photos.forEach(function (photo, index) {

        const photoDiv =
            createPhotoItem(photo, index);

        masonry.appendChild(photoDiv);

    });

}

function createPhotoItem(photo, index) {

    const div =
        document.createElement('div');

    div.className =
        `gallery-item photo-item size-${photo.size}`;

    div.innerHTML = `

        <img
            src="${photo.thumb}"
            alt="${photo.alt}"
            class="gallery-photo"
            data-index="${index}"
        >

        <div class="photo-overlay">
            <i class="fas fa-search-plus"></i>
        </div>

    `;

    div.addEventListener('click', function () {
        openLightbox(index);
    });

    return div;

}


// ==========================================
// VISUALIZADOR DE VÍDEOS (PREVIEW GRANDE + CARROSSEL)
// ==========================================

function loadVideoViewer() {

    const carousel =
        document.getElementById('video-carousel');

    if (!carousel) {
        console.error(
            'Elemento #video-carousel não encontrado.'
        );
        return;
    }

    carousel.innerHTML = '';

    videos.forEach(function (video, index) {

        const item =
            createCarouselItem(video, index);

        carousel.appendChild(item);

    });

    initCarouselArrows();

    // Seleciona o primeiro vídeo por defeito (sem autoplay)
    selectVideo(0, false);

}

function createCarouselItem(video, index) {

    const div =
        document.createElement('div');

    div.className = 'carousel-item';
    div.dataset.index = index;

    const thumb =
        document.createElement('img');

    thumb.src =
        `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`;

    thumb.alt = video.title;
    thumb.className = 'carousel-thumb-img';

    thumb.onerror = function () {
        this.onerror = null;
        this.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
    };

    div.innerHTML = `
        <div class="carousel-play-icon">
            <i class="fas fa-play"></i>
        </div>
        <p class="carousel-title">${video.title}</p>
    `;

    div.prepend(thumb);

    div.addEventListener('click', function () {
        selectVideo(index, true);
    });

    return div;

}

function selectVideo(index, autoplay) {

    if (!videos[index]) {
        return;
    }

    currentVideoIndex = index;

    const video = videos[index];

    const iframe =
        document.getElementById('video-viewer-iframe');

    const title =
        document.getElementById('video-viewer-title');

    const meta =
        document.getElementById('video-viewer-meta');

    if (iframe) {

        const autoplayParam =
            autoplay ? '&autoplay=1' : '';

        iframe.src =
            `https://www.youtube-nocookie.com/embed/${video.id}?rel=0${autoplayParam}`;

    }

    if (title) {
        title.textContent = video.title;
    }

    if (meta) {
        meta.textContent = `${video.composer} · ${video.year}`;
    }

    updateCarouselActiveState();

}

function updateCarouselActiveState() {

    const items =
        document.querySelectorAll('.carousel-item');

    items.forEach(function (item) {

        item.classList.toggle(
            'active',
            parseInt(item.dataset.index) === currentVideoIndex
        );

    });

    const activeItem =
        document.querySelector('.carousel-item.active');

    if (activeItem) {

        activeItem.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest'
        });

    }

}

function playCurrentVideo() {
    selectVideo(currentVideoIndex, false);
}

function stopVideoViewer() {

    const iframe =
        document.getElementById('video-viewer-iframe');

    if (iframe) {
        iframe.src = '';
    }

}

function initCarouselArrows() {

    const prevBtn =
        document.getElementById('carousel-prev');

    const nextBtn =
        document.getElementById('carousel-next');

    const carousel =
        document.getElementById('video-carousel');

    if (!carousel) {
        return;
    }

    if (prevBtn) {

        prevBtn.addEventListener('click', function () {
            carousel.scrollBy({ left: -200, behavior: 'smooth' });
        });

    }

    if (nextBtn) {

        nextBtn.addEventListener('click', function () {
            carousel.scrollBy({ left: 200, behavior: 'smooth' });
        });

    }

}


// ==========================================
// LIGHTBOX (FOTOS)
// ==========================================

function initLightbox() {

    const lightbox =
        document.getElementById('lightbox');

    const closeBtn =
        document.querySelector('.lightbox-close');

    const prevBtn =
        document.getElementById('lightbox-prev');

    const nextBtn =
        document.getElementById('lightbox-next');

    if (!lightbox) {
        return;
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function () {
            navigateLightbox(-1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            navigateLightbox(1);
        });
    }

    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', function (e) {

        if (lightbox.style.display === 'flex') {

            if (e.key === 'ArrowLeft') {
                navigateLightbox(-1);
            }

            if (e.key === 'ArrowRight') {
                navigateLightbox(1);
            }

            if (e.key === 'Escape') {
                closeLightbox();
            }

        }

    });

}

function openLightbox(index) {

    const lightbox =
        document.getElementById('lightbox');

    const lightboxImage =
        document.getElementById('lightbox-image');

    if (!lightbox || !lightboxImage || !photos[index]) {
        return;
    }

    lightboxImage.src = photos[index].full;
    lightboxImage.alt = photos[index].alt;

    lightbox.style.display = 'flex';
    lightbox.dataset.currentIndex = index;

    document.body.style.overflow = 'hidden';

}

function closeLightbox() {

    const lightbox =
        document.getElementById('lightbox');

    if (!lightbox) {
        return;
    }

    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';

}

function navigateLightbox(direction) {

    const lightbox =
        document.getElementById('lightbox');

    if (!lightbox || photos.length === 0) {
        return;
    }

    let currentIndex =
        parseInt(lightbox.dataset.currentIndex) || 0;

    let newIndex = currentIndex + direction;

    if (newIndex < 0) {
        newIndex = photos.length - 1;
    }

    if (newIndex >= photos.length) {
        newIndex = 0;
    }

    openLightbox(newIndex);

}
