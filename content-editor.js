(() => {
  const pageByFile = {
    'tonovanie-autoskiel.html': 'tint', 'tonovanie-autoskiel-hu.html': 'tint',
    'ppf-ochrana-laku.html': 'ppf', 'ppf-ochrana-laku-hu.html': 'ppf',
    'dechrome-wrap.html': 'wrap', 'dechrome-wrap-hu.html': 'wrap',
    'folie-na-svetla.html': 'lights', 'folie-na-svetla-hu.html': 'lights',
    'folie-na-budovy.html': 'building', 'folie-na-budovy-hu.html': 'building'
  };

  const setText = (element, text) => { if (element && typeof text === 'string') element.textContent = text; };
  const page = pageByFile[location.pathname.split('/').pop()];
  if (!page) return;

  fetch('content/price-editor.json', { cache: 'no-cache' })
    .then((response) => response.ok ? response.json() : null)
    .then((allPrices) => {
      const prices = allPrices?.[page]?.[document.documentElement.lang === 'hu' ? 'hu' : 'sk'];
      if (!prices) return;

      if (page === 'tint') {
        document.querySelectorAll('.price-table-wrap tbody tr').forEach((row, index) => {
          const values = prices.rows[index];
          if (!values) return;
          [values.category, values.hp, values.ceramic, values.baby].forEach((value, cellIndex) => setText(row.querySelectorAll('th, td')[cellIndex], value));
        });
        document.querySelectorAll('.extras-grid article').forEach((card, index) => {
          const values = prices.extras[index];
          if (!values) return;
          setText(card.querySelector('span'), values.label);
          setText(card.querySelector('b'), values.price);
        });
      }

      if (page === 'ppf') {
        document.querySelectorAll('.ppf-package').forEach((card, index) => {
          const values = prices.items[index];
          if (!values) return;
          setText(card.querySelector('.package-label'), values.label);
          setText(card.querySelector('h3'), values.title);
          setText(card.querySelector('.package-price'), values.price);
        });
      }

      if (page === 'wrap') {
        document.querySelectorAll('.wrap-price-grid article').forEach((card, index) => {
          const values = prices.vehicles[index];
          if (!values) return;
          setText(card.querySelector('span'), values.label);
          setText(card.querySelector('strong'), values.price);
        });
        const [main, ...details] = prices.details;
        if (main) {
          setText(document.querySelector('.dechrome-price span'), main.label);
          setText(document.querySelector('.dechrome-price h3'), main.title);
          setText(document.querySelector('.dechrome-price strong'), main.price);
        }
        document.querySelectorAll('.dechrome-extras article').forEach((card, index) => {
          const values = details[index];
          if (!values) return;
          setText(card.querySelector('span'), values.label);
          setText(card.querySelector('h3'), values.title);
          setText(card.querySelector('strong'), values.price);
        });
      }

      if (page === 'lights') {
        document.querySelectorAll('.lights-price-card').forEach((card, index) => {
          const values = prices.items[index];
          if (!values) return;
          setText(card.querySelector('span'), values.label);
          setText(card.querySelector('h3'), values.title);
          [values.front, values.rear].forEach((value, priceIndex) => setText(card.querySelectorAll('dd')[priceIndex], value));
        });
      }

      if (page === 'building') {
        document.querySelectorAll('.building-price-grid article').forEach((card, index) => {
          const values = prices.items[index];
          if (!values) return;
          setText(card.querySelector('span'), values.label);
          setText(card.querySelector('h3'), values.title);
          setText(card.querySelector('strong'), values.price);
        });
      }
    })
    .catch(() => {});
})();
