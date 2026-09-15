// =========================================================
// EVENTOS PARTILHADOS
// =========================================================

// Carrega eventos do JSON
async function carregarEventos() {
    try {
        const response = await fetch(`/data/eventos.json?t=${Date.now()}`);

        if (!response.ok) {
            throw new Error(`Erro HTTP ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error('Erro ao carregar eventos:', error);
        return [];
    }
}


// =========================================================
// PRÓXIMO CONCERTO
// =========================================================

async function getNextConcert() {
    const eventos = await carregarEventos();

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const proximos = eventos.filter(evento => {
        const data = new Date(`${evento.date}T00:00:00`);
        return data >= hoje;
    });

    proximos.sort((a, b) => {
        return new Date(`${a.date}T00:00:00`) - new Date(`${b.date}T00:00:00`);
    });

    return proximos.length > 0 ? proximos[0] : null;
}


// =========================================================
// CONCERTO FLUTUANTE
// =========================================================

function textoEvento(valor, idioma) {
    if (valor && typeof valor === 'object') {
        return valor[idioma] || valor.pt || valor.en || '';
    }

    return valor || '';
}

async function atualizarFloatingConcert() {
    const floating = document.getElementById('floating-concert');

    if (!floating) {
        return;
    }

    // Esconder enquanto os dados estão a ser carregados para nunca
    // mostrar os placeholders (-- / --- / --:--) ao visitante.
    floating.style.display = 'none';

    const concert = await getNextConcert();

    if (!concert) {
        return;
    }

    const idioma =
        typeof currentLanguage !== 'undefined'
            ? currentLanguage
            : (localStorage.getItem('language') || 'en');

    const day = document.getElementById('concert-day');
    const month = document.getElementById('concert-month');
    const title = document.getElementById('concert-title');
    const time = document.getElementById('concert-time');
    const location = document.getElementById('concert-location');

    if (!day || !month || !title || !time || !location) {
        console.error('Elementos da floating concert card não encontrados.');
        return;
    }

    day.textContent = concert.day || '';
    month.textContent = textoEvento(concert.month, idioma);
    title.textContent = textoEvento(concert.title, idioma);
    time.textContent = concert.time || '';
    location.textContent = textoEvento(concert.location, idioma);

    floating.style.display = 'block';
}


// =========================================================
// INICIALIZAÇÃO
// =========================================================

// A floating card não depende do carregamento das traduções para
// aparecer em PT, mas é atualizada novamente quando as traduções
// terminam de carregar ou quando o idioma muda.
document.addEventListener('DOMContentLoaded', function () {
    atualizarFloatingConcert();
});

document.addEventListener('languageChanged', function () {
    atualizarFloatingConcert();
});
