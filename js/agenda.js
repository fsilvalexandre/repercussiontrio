async function organizarEventos() {

    const eventos = await carregarEventos();

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const proximosTimeline = document.querySelector('#proximos .timeline');
    const passadosCardsGrid = document.querySelector('#passados .cards-grid');

    // Verificar se os elementos existem
    if (!proximosTimeline || !passadosCardsGrid) {
        console.error('Elementos da agenda não encontrados.');
        return;
    }

    // Limpar eventos existentes
    proximosTimeline.innerHTML = '';
    passadosCardsGrid.innerHTML = '';

    const proximos = [];
    const passados = [];

    // Idioma atual
    const idioma =
        typeof currentLanguage !== 'undefined'
            ? currentLanguage
            : 'en';


    // =====================================================
    // CRIAR EVENTOS
    // =====================================================

    eventos.forEach(evento => {

        const data = new Date(evento.date);
        data.setHours(0, 0, 0, 0);

        // Suporte para eventos antigos sem tradução
        const month = obterTexto(evento.month, idioma);
        const title = obterTexto(evento.title, idioma);
        const location = obterTexto(evento.location, idioma);
        const description = obterTexto(evento.description, idioma);

        const timelineItem = document.createElement('div');

        timelineItem.className = 'timeline-item';

        timelineItem.innerHTML = `
            <div class="timeline-content">

                <div class="event-date-badge">
                    <span class="day">${evento.day}</span>
                    <span class="month">${month}</span>
                </div>

                <h3 class="event-title">${title}</h3>

                <p class="event-time">${evento.time}</p>

                <p class="event-location">${location}</p>

                <p class="event-description">${description}</p>

            </div>
        `;


        // Evento futuro
        if (data >= hoje) {

            proximos.push({
                elemento: timelineItem,
                data: data
            });

        }

        // Evento passado
        else {

            passados.push({
                elemento: timelineItem,
                data: data
            });

        }

    });


    // =====================================================
    // ORDENAR
    // =====================================================

    // Próximos: mais próximo primeiro
    proximos.sort((a, b) => {
        return a.data - b.data;
    });

    // Passados: mais recente primeiro
    passados.sort((a, b) => {
        return b.data - a.data;
    });


    // =====================================================
    // MOSTRAR PRÓXIMOS
    // =====================================================

// AGRUPAR POR ANO
const proximosPorAno = {};
proximos.forEach(item => {
  const ano = new Date(item.data).getFullYear();
  if (!proximosPorAno[ano]) proximosPorAno[ano] = [];
  proximosPorAno[ano].push(item);
});

// MOSTRAR COM HEADERS DE ANO
Object.keys(proximosPorAno).sort().forEach(ano => {
  const header = document.createElement('div');
  header.className = 'timeline-year-header';
  header.textContent = ano;
  proximosTimeline.appendChild(header);
  
  proximosPorAno[ano].forEach(item => {
    proximosTimeline.appendChild(item.elemento);
  });
});


    // =====================================================
    // MOSTRAR PASSADOS
    // =====================================================

// AGRUPAR POR ANO
const passadosPorAno = {};
passados.forEach(item => {
  const ano = new Date(item.data).getFullYear();
  if (!passadosPorAno[ano]) passadosPorAno[ano] = [];
  passadosPorAno[ano].push(item);
});

// MOSTRAR COMO LISTA
Object.keys(passadosPorAno).sort((a, b) => b - a).forEach(ano => {
  const header = document.createElement('div');
  header.className = 'timeline-year-header';
  header.textContent = ano;
  passadosCardsGrid.appendChild(header);
  
  passadosPorAno[ano].forEach(item => {
    const listItem = document.createElement('div');
    listItem.className = 'event-list-item';
    listItem.innerHTML = item.elemento.innerHTML;
    passadosCardsGrid.appendChild(listItem);
  });
});

    // =====================================================
    // SE NÃO HOUVER PRÓXIMOS EVENTOS
    // =====================================================

    if (proximos.length === 0) {

        document.getElementById('tab-passados').checked = true;

    }

}


// =========================================================
// OBTER TEXTO NO IDIOMA ATUAL
// =========================================================

function obterTexto(valor, idioma) {

    // Se for um objeto PT/EN
    if (
        valor &&
        typeof valor === 'object'
    ) {

        return valor[idioma] || valor.pt || '';

    }

    // Compatibilidade com eventos antigos
    return valor || '';
}


// =========================================================
// INICIALIZAÇÃO
// =========================================================

document.addEventListener(
    'DOMContentLoaded',
    organizarEventos
);


// =========================================================
// ATUALIZAR QUANDO MUDA O IDIOMA
// =========================================================

document.addEventListener(
    'languageChanged',
    organizarEventos
);
