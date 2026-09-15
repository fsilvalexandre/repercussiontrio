// =========================================================
// INICIALIZAÇÃO - CARREGAR IDIOMA ANTES DE TUDO
// =========================================================
// Este ficheiro deve ser o PRIMEIRO script a carregar
// Evita flicker de PT → EN

(function() {
  // Obter idioma guardado ou PT por default
  const savedLanguage = localStorage.getItem('language') || 'en';
  
  // Aplicar idioma ao HTML IMEDIATAMENTE
  document.documentElement.lang = savedLanguage;
  
  // Guardar globalmente para outros scripts acederem
  window.currentLanguage = savedLanguage;
})();
