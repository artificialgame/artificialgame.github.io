(() => {
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('ag-theme');
  if (savedTheme === 'light') root.classList.add('light');

  document.getElementById('themeToggle')?.addEventListener('click', () => {
    root.classList.toggle('light');
    localStorage.setItem('ag-theme', root.classList.contains('light') ? 'light' : 'dark');
  });

  const searchInput = document.getElementById('gameSearch');
  const cards = [...document.querySelectorAll('.game-card')];
  const filterButtons = [...document.querySelectorAll('#categoryFilters button')];
  let activeCategory = 'all';

  const applyFilters = () => {
    const term = (searchInput?.value || '').toLowerCase().trim();
    cards.forEach(card => {
      const category = card.dataset.category || '';
      const hay = (card.dataset.search || '').toLowerCase();
      const categoryOk = activeCategory === 'all' || category === activeCategory;
      const searchOk = !term || hay.includes(term);
      card.classList.toggle('hidden', !(categoryOk && searchOk));
    });
  };

  searchInput?.addEventListener('input', applyFilters);
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategory = btn.dataset.category;
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
  });
})();
