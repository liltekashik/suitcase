const balanceEl = document.getElementById('balance');
const form = document.getElementById('transaction-form');
const list = document.getElementById('transaction-list');
const descInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');

let transactions = JSON.parse(localStorage.getItem('suitcase-transactions')) || [];

function updateLocalStorage() {
  localStorage.setItem('suitcase-transactions', JSON.stringify(transactions));
}

function updateBalance() {
  const total = transactions.reduce((acc, item) => {
    return item.type === 'income' ? acc + item.amount : acc - item.amount;
  }, 0);
  balanceEl.textContent = `${total.toFixed(2)} BYN`;
}

function renderTransactions() {
  list.innerHTML = '';
  transactions.forEach((item, index) => {
    const li = document.createElement('li');
    li.classList.add(item.type);
    li.innerHTML = `
      <span>${item.description}</span>
      <span>${item.amount.toFixed(2)} BYN</span>
    `;
    li.addEventListener('click', () => {
      transactions.splice(index, 1);
      updateLocalStorage();
      renderTransactions();
      updateBalance();
    });
    list.appendChild(li);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const description = descInput.value.trim();
  const amount = parseFloat(amountInput.value.replace(',', '.'));
  const type = typeInput.value;

  if (!description || isNaN(amount)) return;

  transactions.push({ description, amount, type });
  updateLocalStorage();
  renderTransactions();
  updateBalance();
  form.reset();
});

// init
renderTransactions();
updateBalance();
