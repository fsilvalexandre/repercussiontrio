// =========================================================
// SISTEMA DE TRADUÇÃO
// =========================================================

let currentLanguage = localStorage.getItem('language') || 'en';

let translations = {};

// Tenta usar traduções já guardadas em cache,
// para aplicar de imediato sem esperar pelo fetch
try {

    const cached = localStorage.getItem('translationsCache');

    if (cached) {
        translations = JSON.parse(cached);
    }

} catch (error) {

    console.error('Erro ao ler cache de traduções:', error);

}


// =========================================================
// CARREGAR TRADUÇÕES
// =========================================================

async function loadTranslations() {

    // Se já há traduções em cache, aplica-as já mesmo
    // antes de o fetch terminar — evita o "flash"
    if (Object.keys(translations).length > 0) {

        document.documentElement.lang = currentLanguage;

        applyTranslations();

        updateLanguageSelector();

    }

    try {

        const response = await fetch('/data/translations.json');

        if (!response.ok) {
            throw new Error(`Erro HTTP ${response.status}`);
        }

        translations = await response.json();

        localStorage.setItem(
            'translationsCache',
            JSON.stringify(translations)
        );

        console.log('Traduções carregadas:', translations);

        document.documentElement.lang = currentLanguage;

        applyTranslations();

        updateLanguageSelector();

    } catch (error) {

        console.error('Erro ao carregar traduções:', error);

    }

}


// =========================================================
// APLICAR TRADUÇÕES
// =========================================================

function applyTranslations() {

    document
        .querySelectorAll('[data-translate]')
        .forEach(element => {

            const key =
                element.getAttribute('data-translate');

            const [section, ...keyParts] =
                key.split('.');

            const finalKey =
                keyParts.join('.');


            if (
                translations[section] &&
                translations[section][currentLanguage] &&
                translations[section][currentLanguage][finalKey]
            ) {

                const text =
                    translations[section]
                        [currentLanguage]
                        [finalKey];


                // Links
                if (element.tagName === 'A') {

                    element.textContent = text;

                }


                // Inputs e botões
                else if (
                    element.tagName === 'INPUT' ||
                    element.tagName === 'BUTTON'
                ) {

                    element.value = text;

                }


                // Elementos normais
                else {

                    element.textContent = text;

                }

            }

        });

}


// =========================================================
// MUDAR IDIOMA
// =========================================================

function changeLanguage(lang) {

    if (
        lang !== 'pt' &&
        lang !== 'en'
    ) {
        return;
    }


    currentLanguage = lang;

    localStorage.setItem(
        'language',
        lang
    );


    // Atualizar atributo HTML
    document.documentElement.lang =
        currentLanguage;


    // Atualizar textos da página
    applyTranslations();


    // Atualizar botões PT / EN
    updateLanguageSelector();


    // Avisar outros scripts
    // (Agenda, concerto flutuante, etc.)
    document.dispatchEvent(
        new CustomEvent('languageChanged', {
            detail: {
                language: currentLanguage
            }
        })
    );

}


// =========================================================
// ATUALIZAR SELETOR DE IDIOMA
// =========================================================

function updateLanguageSelector() {

    document
        .querySelectorAll('.language-btn')
        .forEach(button => {

            const buttonLanguage =
                button.getAttribute('data-lang');


            button.classList.toggle(
                'active',
                buttonLanguage === currentLanguage
            );


            button.setAttribute(
                'aria-pressed',
                buttonLanguage === currentLanguage
                    ? 'true'
                    : 'false'
            );

        });

}


// =========================================================
// FUNÇÃO t()
// =========================================================

function t(key) {

    const [section, ...keyParts] =
        key.split('.');

    const finalKey =
        keyParts.join('.');


    if (
        translations[section] &&
        translations[section][currentLanguage] &&
        translations[section][currentLanguage][finalKey]
    ) {

        return translations[section]
            [currentLanguage]
            [finalKey];

    }


    // Se não encontrar tradução,
    // devolve a própria chave
    return key;

}


// =========================================================
// INICIALIZAÇÃO
// =========================================================

document.addEventListener(
    'DOMContentLoaded',
    async function () {

        await loadTranslations();

        document.body.classList.add('i18n-ready');

    }
);
