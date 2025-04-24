const token = localStorage.getItem('token');
if (!token) {
  alert('You are not logged in.');
  window.location.href = 'index.html';
}

document.getElementById('accountForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const month = document.getElementById('month').value;
  const income = parseFloat(document.getElementById('income').value);
  const budget = parseFloat(document.getElementById('budget').value);

  if (!month || isNaN(income) || isNaN(budget)) {
    alert('Please fill in all fields correctly.');
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/user/setup', {
        method: 'POST',
      
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        budget,           // we'll use this for budget field in DB
        income,           // optional: you can store in future table
        month             // optional: for month-based budget system
      })
    });

    const data = await res.json();
    if (res.ok) {
      alert('Account setup saved!');
      window.location.href = 'dashboard.html';
    } else {
      alert(data.message || 'Failed to save account info');
    }
  } catch (err) {
    alert('Server error. Try again later.');
  }
});
