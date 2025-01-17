const bankButton = document.getElementById('bank');
const popupOverlay = document.querySelector('.pop_overlay');
const popupBalance = document.getElementById('popup_balance');
const playerCountOverlay = document.getElementById('player_count_overlay');
const playerCountInput = document.getElementById('player_count_input');
const playerSelect = document.getElementById('player-select');
const playerRows = document.querySelectorAll('.player-row');
const playerRowsContainer = document.querySelector('.player-rows');
const propertyPopup = document.getElementById('property_popup');
const popupProperty = document.getElementById('popup_property');
const bankPopup = document.getElementById('bank_popup');
const stockPopup = document.getElementById('stock_popup');
const popupStockBalance = document.getElementById('popup_stock_balance');
const loansPopup = document.getElementById('loans_popup');







class player {
    constructor(name, job, total, product, debuff) {
        this.name = name;
        this.job = job;
        this.total = total;
        this.product = product;
        this.debuff = debuff;
    }
}

const players = [];
let activePlayerCount = 0;
let selectedPlayer = null;

async function loadGameData() {
    try {
        const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vS_UfHOtMDSXFBISoWiUahDbKxKHKFd9aiWQFQDEEuXHfjGze17jFt-DtRigL9UGX-ap29XzHAggKRg/pub?gid=0&single=true&output=csv');

        const csvText = await response.text();
        
        const rows = csvText.split('\n').slice(1);
        const gameData = rows.map(row => {
            const [name, job, total, product, debuff] = row.split(',');
            return new player(name, job, parseInt(total), product, debuff);
        });
        
        players.length = 0;
        
        for (let i = 0; i < 15; i++) {
            const randomData = gameData[Math.floor(Math.random() * gameData.length)];
            players.push(new player(
                randomData.name,
                randomData.job,
                randomData.total,
                randomData.product,
                randomData.debuff
            ));
        }
        
        selectedPlayer = players[0];
        initializeGame();
        
    } catch (error) {
        console.error('Error loading game data:', error);
    }
}

function initializeGame() {

    playerRowsContainer.innerHTML = '';
    
    for (let i = 0; i < 15; i++) {
        const row = document.createElement('div');
        row.className = 'player-row hidden';
        row.innerHTML = `
            <div class="column name">${i + 1}.${players[i].name}</div>
            <div class="column career">${players[i].job}</div>
            <div class="column money">$${players[i].total}</div>
            <div class="column property">${players[i].product}</div>
        `;
        playerRowsContainer.appendChild(row);
    }
    
    playerCountOverlay.classList.remove('hidden');
}

function startGame() {
    const playerCount = parseInt(playerCountInput.value);
    
    if (playerCount < 2 || playerCount > 15 || isNaN(playerCount)) {
        alert('Please enter a number between 2 and 15');
        return;
    }
    
    activePlayerCount = playerCount;
    
    playerCountOverlay.classList.add('hidden');
    
    const allPlayerRows = document.querySelectorAll('.player-row');
    allPlayerRows.forEach((row, index) => {
        if (index < playerCount) {
            row.classList.remove('hidden');
        } else {
            row.classList.add('hidden');
        }
    });
    
    playerSelect.innerHTML = ''; 
    for (let i = 0; i < playerCount; i++) {
        const option = document.createElement('option');
        option.value = i + 1;
        option.textContent = `Player ${i + 1}`;
        playerSelect.appendChild(option);
    }
    
    selectedPlayer = players[0];
    updateDisplayedInfo();
}

function updateSelectedPlayer() {
    const playerNum = parseInt(playerSelect.value);
    selectedPlayer = players[playerNum - 1];
    updateDisplayedInfo();
}

function updateDisplayedInfo() {
    const allPlayerRows = document.querySelectorAll('.player-row');
    allPlayerRows.forEach((row, index) => {
        if (index < activePlayerCount) {
            const player = players[index];
            row.querySelector('.name').textContent = `${index + 1}.${player.name}`;
            row.querySelector('.career').textContent = player.job;
            row.querySelector('.money').textContent = '$' + player.total;
            row.querySelector('.property').textContent = player.product;
        }
    });
}

function propertyc() {
    propertyPopup.classList.remove('hidden');
    popupProperty.textContent = selectedPlayer.product;
}

function bankc() {
    bankPopup.classList.remove('hidden');
    popupBalance.textContent = selectedPlayer.total;
}

function stockc() {
    stockPopup.classList.remove('hidden');
    popupStockBalance.textContent = selectedPlayer.total;
}

function loansc() {
    loansPopup.classList.remove('hidden');
}

function closePopup(popupId) {
    document.getElementById(popupId).classList.add('hidden');
}

window.onload = loadGameData;