let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function updateSummary() {
    let inc = 0;
    let exp = 0;
    
    transactions.forEach(t => {
        if (t.amount > 0) {
            inc += t.amount;
        } else {
            exp += Math.abs(t.amount);
        }
    });

    const balance = inc - exp;
    document.getElementById('balance').innerText = "₹" + balance.toFixed(2);
    document.getElementById('income').innerText = "+₹" + inc.toFixed(2);
    document.getElementById('expense').innerText = "-₹" + exp.toFixed(2);
}

function addTransaction() {
    const desc = document.getElementById('description').value.trim();
    const amt = parseFloat(document.getElementById('amount').value);
    const cat = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    if (!desc || isNaN(amt) || !date) {
        alert("Please fill all fields properly");
        return;
    }

    const newTransaction = {
        id: Date.now(),
        desc: desc,
        amount: amt,
        category: cat,
        date: date
    };

    transactions.push(newTransaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    // Reset Form inputs
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('date').value = '';

    renderTransactions();
    updateSummary();
}

function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    renderTransactions();
    updateSummary();
}

function renderTransactions() {
    const list = document.getElementById('transactionList');
    const filter = document.getElementById('filterCategory').value;
    list.innerHTML = '';
    
    transactions.forEach(t => {
        if (filter !== "All" && t.category !== filter) return;
        
        const li = document.createElement('li');
        li.innerHTML = `
            <span><strong>${t.desc}</strong> (${t.date}) - ${t.category}</span>
            <span>₹${t.amount} <i class="fa fa-trash delete-btn" onclick="deleteTransaction(${t.id})"></i></span>
        `;
        list.appendChild(li);
    });
}

// Initial Load
renderTransactions();
updateSummary();