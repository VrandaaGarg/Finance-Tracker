const token = localStorage.getItem('token');
if (!token) {
  alert('You are not logged in.');
  window.location.href = 'index.html';
}

let monthlyBudget = 0;
let monthlyIncome = 0;
let dailyLimit = 0;
let spentThisMonth = 0;

window.onload = async () => {
  await fetchSetup();
  await fetchExpenses();
};

// 🚀 Fetch user setup from /api/user/setup
async function fetchSetup() {
  try {
    const res = await fetch('http://localhost:5000/api/user/setup', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (res.ok) {
      monthlyBudget = data.budget;
      monthlyIncome = data.income;

      const currentMonth = new Date().getMonth();
      const daysInMonth = new Date(new Date().getFullYear(), currentMonth + 1, 0).getDate();
      dailyLimit = Math.floor(monthlyBudget / daysInMonth);

      document.getElementById('budgetSummary').innerHTML = `
        <h3>📊 Financial Overview</h3>
        <p><strong>Monthly Budget:</strong> ₹${monthlyBudget}</p>
        <p><strong>Income:</strong> ₹${monthlyIncome}</p>
        <p><strong>Daily Spending Limit:</strong> ₹${dailyLimit}</p>
      `;
    } else {
      alert("Account setup not found. Redirecting to setup...");
      window.location.href = 'account.html';
    }
  } catch (err) {
    console.error(err);
    alert("Error fetching setup. Try again later.");
  }
}

// 💸 Calculate current month's expenses
async function fetchExpenses() {
  try {
    const res = await fetch('http://localhost:5000/api/expenses/all', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    const thisMonth = new Date().getMonth();
    spentThisMonth = data
      .filter(e => new Date(e.date).getMonth() === thisMonth)
      .reduce((acc, e) => acc + e.amount, 0);

    document.getElementById('budgetSummary').innerHTML += `
      <p><strong>Spent This Month:</strong> ₹${spentThisMonth}</p>
      <p><strong>Remaining Budget:</strong> ₹${Math.max(0, monthlyBudget - spentThisMonth)}</p>
    `;

    if (spentThisMonth > monthlyBudget) {
      alert("⚠️ Budget exceeded!");
    }
  } catch (err) {
    alert("Failed to load expenses");
  }
}

// ➕ Expense form submission
document.getElementById('expenseForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const payment_method = document.getElementById('payment_method').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const payment_id = document.getElementById('payment_id').value;
  const description = document.getElementById('description').value;
  const date = document.getElementById('date').value;

  try {
    const res = await fetch('http://localhost:5000/api/expenses/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ payment_method, amount, payment_id, description, date }),
    });

    const data = await res.json();

    if (res.ok) {
      alert('✅ Expense added!');
      document.getElementById('expenseForm').reset();
      await fetchExpenses(); // refresh data
    } else {
      alert(data.message || 'Failed to add expense.');
    }
  } catch (err) {
    alert('❌ Server error. Please try again.');
  }
});
