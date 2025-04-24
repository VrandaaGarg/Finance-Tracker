const token = localStorage.getItem('token');
if (!token) {
    alert('You are not logged in.');
    window.location.href = 'index.html';
}

const filter = document.getElementById('filter');
const totalBudget = document.getElementById('totalBudget');
const totalSpent = document.getElementById('totalSpent');
const remaining = document.getElementById('remaining');
const expenseItems = document.getElementById('expenseItems');

let expenses = [];
let budget = 0;

filter.addEventListener('change', loadReport);

async function loadReport() {
    const selected = filter.value;

    try {
        const res = await fetch('http://localhost:5000/api/expenses/all', {
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        expenses = data;

        const filtered = selected === 'month'
            ? filterByMonth(expenses)
            : filterByYear(expenses);

        updateCharts(filtered);
        updateSummary(filtered);
        updateList(filtered);
    } catch (err) {
        alert('Error loading report');
    }
}

function filterByMonth(exp) {
    const thisMonth = new Date().getMonth();
    return exp.filter(e => new Date(e.date).getMonth() === thisMonth);
}

function filterByYear(exp) {
    const thisYear = new Date().getFullYear();
    return exp.filter(e => new Date(e.date).getFullYear() === thisYear);
}

function updateSummary(filtered) {
    const spent = filtered.reduce((acc, e) => acc + e.amount, 0);
    totalSpent.textContent = spent;
    totalBudget.textContent = budget;
    remaining.textContent = Math.max(0, budget - spent);
}

function updateList(filtered) {
    expenseItems.innerHTML = '';
    filtered.forEach(e => {
        const li = document.createElement('li');
        li.textContent = `${e.date} - ₹${e.amount} (${e.payment_method}) - ${e.description}`;
        expenseItems.appendChild(li);
    });
}

function updateCharts(filtered) {
    const spent = filtered.reduce((acc, e) => acc + e.amount, 0);
    const ctx1 = document.getElementById('budgetChart').getContext('2d');
    const ctx2 = document.getElementById('trendChart').getContext('2d');

    // Donut chart for current budget
    new Chart(ctx1, {
        type: 'doughnut',
        data: {
          labels: ['Spent', 'Remaining'],
          datasets: [{
            data: [spent, Math.max(0.001, budget - spent)],
            backgroundColor: ['#ff6384', '#36a2eb'],
          }],
        },
      });
      

    // ✅ Initialize monthly totals (Jan to Dec)
    const monthlyTotals = Array(12).fill(0);
    const currentYear = new Date().getFullYear();

    expenses.forEach(e => {
        const date = new Date(e.date);
        if (date.getFullYear() === currentYear) {
            const monthIndex = date.getMonth();
            monthlyTotals[monthIndex] += e.amount;
        }
    });

    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: monthLabels,
            datasets: [{
                label: 'Monthly Expenses',
                data: monthlyTotals,
                backgroundColor: '#0077cc',
            }],
        },
    });

    // === Weekly Breakdown ===
const weeklyTotals = Array(7).fill(0); // Sunday to Saturday
const today = new Date();
const weekStart = new Date(today.setDate(today.getDate() - today.getDay())); // Sunday

expenses.forEach(e => {
  const date = new Date(e.date);
  const diff = Math.floor((date - weekStart) / (1000 * 60 * 60 * 24)); // Days since week start
  if (diff >= 0 && diff < 7) {
    weeklyTotals[date.getDay()] += e.amount;
  }
});

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const ctx3 = document.getElementById('weeklyChart').getContext('2d');
new Chart(ctx3, {
  type: 'bar',
  data: {
    labels: dayLabels,
    datasets: [{
      label: 'Weekly Expenses',
      data: weeklyTotals,
      backgroundColor: '#28a745',
    }]
  },
});

}


// Fetch user profile to get budget
async function fetchBudget() {
    const res = await fetch('http://localhost:5000/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    budget = data.budget || 0;
    loadReport();
}

fetchBudget();
