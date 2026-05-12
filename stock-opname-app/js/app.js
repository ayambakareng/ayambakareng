// State Management: Menyimpan data ke dalam array (mirip list of dictionaries)
// Mengambil data dari localStorage jika ada, jika kosong gunakan array []
let inventory = JSON.parse(localStorage.getItem('fnb_inventory')) || [];

// Inisialisasi saat halaman pertama kali dimuat
document.addEventListener('DOMContentLoaded', () => {
    renderTable();
});

// Fungsi untuk menyimpan data ke Local Storage
function saveToStorage() {
    localStorage.setItem('fnb_inventory', JSON.stringify(inventory));
    updateSummary();
}

// Fungsi untuk menambahkan item baru
function addItem() {
    const nameInput = document.getElementById('item-name');
    const stockInput = document.getElementById('system-stock');
    const categoryInput = document.getElementById('category');

    // Validasi input kosong
    if (nameInput.value.trim() === '' || stockInput.value === '') {
        alert('Mohon isi nama barang dan stok sistem!');
        return;
    }

    // Membuat ID unik sederhana dengan timestamp
    const newItem = {
        id: 'ITEM-' + Date.now(),
        nama: nameInput.value,
        stokSistem: parseInt(stockInput.value),
        stokFisik: 0, // Default awal
        selisih: -parseInt(stockInput.value), // Selisih awal sebelum opname fisik
        kategori: categoryInput.value
    };

    // Menambahkan object ke dalam array inventory
    inventory.push(newItem);
    
    // Reset form input
    nameInput.value = '';
    stockInput.value = '';
    
    saveToStorage();
    renderTable();
}

// Fungsi untuk menghitung dan mengupdate stok fisik
function updateFisik(id, value) {
    const itemIndex = inventory.findIndex(item => item.id === id);
    
    if (itemIndex !== -1) {
        const fisik = parseInt(value) || 0;
        inventory[itemIndex].stokFisik = fisik;
        // Rumus Opname: Stok Fisik - Stok Sistem
        inventory[itemIndex].selisih = fisik - inventory[itemIndex].stokSistem; 
        
        saveToStorage();
        renderTable();
    }
}

// Fungsi untuk menghapus item
function deleteItem(id) {
    if (confirm('Apakah Anda yakin ingin menghapus item ini?')) {
        inventory = inventory.filter(item => item.id !== id);
        saveToStorage();
        renderTable();
    }
}

// Fungsi untuk menampilkan data ke tabel HTML (DOM Manipulation)
function renderTable() {
    const tbody = document.getElementById('inventory-list');
    tbody.innerHTML = ''; // Kosongkan tabel sebelum render ulang

    inventory.forEach(item => {
        // Menentukan warna badge berdasarkan kategori
        let badgeClass = '';
        if (item.kategori === 'Dry') badgeClass = 'badge-dry';
        else if (item.kategori === 'Chiller') badgeClass = 'badge-chiller'; // Tambahkan CSS nya nanti jika perlu
        else badgeClass = 'badge-beverage';

        // Menentukan warna selisih (merah jika minus, hijau jika balance/lebih)
        let selisihClass = item.selisih < 0 ? 'text-danger' : 'text-success';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.nama}</td>
            <td><span class="badge ${badgeClass}">${item.kategori}</span></td>
            <td class="text-center">${item.stokSistem}</td>
            <td class="text-center">
                <input type="number" 
                       class="input-fisik" 
                       value="${item.stokFisik}" 
                       onchange="updateFisik('${item.id}', this.value)"
                       onkeyup="if(event.key === 'Enter') updateFisik('${item.id}', this.value)">
            </td>
            <td class="text-center"><span class="${selisihClass}">${item.selisih}</span></td>
            <td class="text-center">
                <button class="btn-icon" onclick="deleteItem('${item.id}')">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    updateSummary();
}

// Fungsi untuk memperbarui ringkasan di Header
function updateSummary() {
    const summaryDiv = document.getElementById('summary-stats');
    summaryDiv.innerHTML = `Total Item: <span>${inventory.length}</span>`;
}