const path = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('nav a').forEach(a => {
  const href = a.getAttribute('href');
  const isHome = path === 'index.html' && href === './';
  if (href === path || isHome) a.setAttribute('aria-current', 'page');
});
