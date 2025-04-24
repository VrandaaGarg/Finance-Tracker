// inject header and footer into each page
window.addEventListener('DOMContentLoaded', async () => {
    const header = await fetch('components/header.html').then(res => res.text());
    const footer = await fetch('components/footer.html').then(res => res.text());
  
    document.body.insertAdjacentHTML('afterbegin', header);
    document.body.insertAdjacentHTML('beforeend', footer);
  });
  
  // logout handler
  function logout() {
    localStorage.removeItem('token');
    alert('Logged out!');
    window.location.href = 'index.html';
  }
  