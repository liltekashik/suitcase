// Элементы DOM
const incomeList = document.getElementById('income-list');
const walletList = document.getElementById('wallet-list');
const expenseList = document.getElementById('expense-list');

const modal = document.getElementById('modal');
const entryForm = document.getElementById('entry-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');

let currentType = null; // Тип текущего добавления: 'income', 'wallet', 'expense'

// Загрузка данных из localStorage или пустые массивы
let data = JSON.parse(localStorage.getItem('suitcase-data')) || {
  income: [],
  wallet: [],
  expense: []
};

function saveData() {
  localStorage.setItem('suitcase-data', JSON.stringify(data));
}

function render() {
  // Очистка списков
  incomeList.innerHTML = '';
  walletList.innerHTML = '';
  expenseList.innerHTML = '';

  // Рендер доходов
  data.income.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = `${item.description}: ${item.amount.toFixed(2)} BYN`;
    li.onclick = () => {
      data.income.splice(index, 1);
      saveData();
      render();
    };
    incomeList.appendChild(li);
  });

  // Рендер кошельков
  data.wallet.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = item.description;
    li.onclick = () => {
      data.wallet.splice(index, 1);
      saveData();
      render();
    };
    walletList.appendChild(li);
  });

  // Рендер расходов
  data.expense.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = `${item.description}: ${item.amount.toFixed(2)} BYN`;
    li.onclick = () => {
      data.expense.splice(index, 1);
      saveData();
      render();
    };
    expenseList.appendChild(li);
  });
}

// Функция открытия формы с указанием типа
function openForm(type) {
  currentType = type;
  descriptionInput.value = '';
  amountInput.value = '';
  
  // Для кошельков сумма не нужна — скрываем поле суммы
  if (type === 'wallet') {
    amountInput.style.display = 'none';
  } else {
    amountInput.style.display = 'block';
  }

  modal.classList.remove('hidden');
  descriptionInput.focus();
}

// Закрыть форму
function closeForm() {
  modal.classList.add('hidden');
}

// Обработка отправки формы
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

// Инициализация
render();
