document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone_number = document.getElementById('phone').value;
    const budget = parseFloat(document.getElementById('budget').value);
    const password = document.getElementById('password').value;
  
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone_number, budget, password }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        alert('Registration successful!');
        window.location.href = 'index.html';
      } else {
        alert(data.message || 'Registration failed!');
      }
    } catch (err) {
      alert('Server error. Try again later.');
    }
  });
  