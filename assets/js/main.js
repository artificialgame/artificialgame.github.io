(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle?.querySelector('.theme-icon');
  const menuToggle = document.getElementById('menuToggle');
  const primaryNav = document.getElementById('primaryNav');

  const savedTheme = localStorage.getItem('ag-theme');
  const preferredTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  const activeTheme = savedTheme || preferredTheme;

  const setTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('ag-theme', theme);
    if (themeToggle) themeToggle.setAttribute('aria-pressed', String(theme === 'light'));
    if (themeIcon) themeIcon.textContent = theme === 'light' ? '☀️' : '🌙';
  };

  setTheme(activeTheme);

  themeToggle?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    setTheme(next);
  });

  menuToggle?.addEventListener('click', () => {
    const isOpen = primaryNav?.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
  });

  const searchInput = document.getElementById('gameSearch');
  const cards = [...document.querySelectorAll('.game-card')];
  const filterButtons = [...document.querySelectorAll('#categoryFilters button')];
  let activeCategory = 'all';

  const applyFilters = () => {
    const term = (searchInput?.value || '').toLowerCase().trim();
    cards.forEach((card) => {
      const category = card.dataset.category || '';
      const hay = (card.dataset.search || '').toLowerCase();
      const categoryOk = activeCategory === 'all' || category === activeCategory;
      const searchOk = !term || hay.includes(term);
      card.classList.toggle('hidden', !(categoryOk && searchOk));
    });
  };

  searchInput?.addEventListener('input', applyFilters);
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      activeCategory = btn.dataset.category || 'all';
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
  });
})();
