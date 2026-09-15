document.addEventListener('DOMContentLoaded', function () {
  const members = [
    {
      nameKey: 'about.memberAlexandre',
      bioKey: 'about.bioAlexandre',
      img: 'imagens/membro1.png',
      alt: 'Alexandre Silva'
    },
    {
      nameKey: 'about.memberDaniel',
      bioKey: 'about.bioDaniel',
      img: 'imagens/membro2.jpg',
      alt: 'Daniel Araújo'
    },
    {
      nameKey: 'about.memberJorge',
      bioKey: 'about.bioJorge',
      img: 'imagens/membro3.jpg',
      alt: 'Jorge Pereira'
    }
  ];

  const buttons = document.querySelectorAll('.member-btn');
  const memberDetail = document.getElementById('member-detail');
  if (!memberDetail || !buttons.length) return;

  let currentMember = 0;

  function getLanguage() {
    return localStorage.getItem('language') || 'en';
  }

  function getText(key, lang) {
    if (!translations) return '';
    const [section, ...keyParts] = key.split('.');
    const finalKey = keyParts.join('.');
    if (!translations[section] || !translations[section][lang]) return '';
    return translations[section][lang][finalKey] || '';
  }

  function showMember(index) {
    const member = members[index];
    if (!member) return;

    const lang = getLanguage();
    const name = getText(member.nameKey, lang);
    const bio = getText(member.bioKey, lang);
    const paragraphs = bio.split(/\n\s*\n/).filter(Boolean).map(p => `<p>${p}</p>`).join('');

    memberDetail.innerHTML = `<img src="${member.img}" alt="${member.alt}"><h3>${name || member.alt}</h3>${paragraphs}`;

    buttons.forEach((button, i) => {
      button.classList.toggle('active', i === index);
      button.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });

    currentMember = index;
  }

buttons.forEach(button => {
    button.addEventListener('click', function () {
      const index = Number(this.dataset.member);
      if (Number.isInteger(index) && index >= 0 && index < members.length) {
        // Se já está ativo, esconde
        if (this.classList.contains('active')) {
          memberDetail.innerHTML = '';
          this.classList.remove('active');
          this.setAttribute('aria-selected', 'false');
        } else {
          showMember(index);
        }
      }
    });
  });

  document.addEventListener('languageChanged', () => showMember(currentMember));
});
