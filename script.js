const incomeList = document.getElementById('income-list');
const walletList = document.getElementById('wallet-list');
const expenseList = document.getElementById('expense-list');

const modal = document.getElementById('modal');
const entryForm = document.getElementById('entry-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');

let currentType = null;

let data = JSON.parse(localStorage.getItem('suitcase-data')) || {
  income: [],
  wallet: [],
  expense: []
};

function saveData() {
  localStorage.setItem('suitcase-data', JSON.stringify(data));
}

function render() {
  incomeList.innerHTML = '';
  walletList.innerHTML = '';
  expenseList.innerHTML = '';

  data.income.forEach((item, i) => {
    const li = document.createElement('li');
    li.textContent = `${item.description}: ${item.amount.toFixed(2)} BYN`;
    li.onclick = () => {
      data.income.splice(i, 1);
      saveData();
      render();
    };
    incomeList.appendChild(li);
  });

  data.wallet.forEach((item, i) => {
    const li = document.createElement('li');
    li.textContent = item.description;
    li.onclick = () => {
      data.wallet.splice(i, 1);
      saveData();
      render();
    };
    walletList.appendChild(li);
  });

  data.expense.forEach((item, i) => {
    const li = document.createElement('li');
    li.textContent = `${item.description}: ${item.amount.toFixed(2)} BYN`;
    li.onclick = () => {
      data.expense.splice(i, 1);
      saveData();
      render();
    };
    expenseList.appendChild(li);
  });
}

function openForm(type) {
  currentType = type;
  descriptionInput.value = '';
  amountInput.value = '';

  if (type === 'wallet') {
    amountInput.style.display = 'none';
    amountInput.required = false;
  } else {
    amountInput.style.display = 'block';
    amountInput.required = true;
  }

  modal.classList.remove('hidden');
  descriptionInput.focus();
}

function closeForm() {
  modal.classList.add('hidden');
}

entryForm.onsubmit = function (e) {
  e.preventDefault();
  const description = descriptionInput.value.trim();
  let amount = parseFloat(amountInput.value.replace(',', '.'));

  if (!description) return alert('Введите описание');
  if (currentType !== 'wallet' && (isNaN(amount) || amount <= 0)) return alert('Введите корректную сумму');

  if (currentType === 'wallet') {
    data.wallet.push({ description });
  } else {
    data[currentType].push({ description, amount });
  }

  saveData();
  render();
  closeForm();
};

render();
