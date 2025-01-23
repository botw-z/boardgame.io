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

let root = document.documentElement;

let propertyData = {
    cars: [],
    houses: []
};

class player {
    constructor(job, wage, total, cars = [], houses = []) {
        this.job = job;
        this.wage = parseInt(wage);
        this.total = parseInt(total);
        this.bankBalance = 0;
        this.cars = Array.isArray(cars) ? cars : [];
        this.houses = Array.isArray(houses) ? houses : [];
    }
}

const players = [];
let activePlayerCount = 0;
let selectedPlayer = null;
let events = [];

async function loadGameData() {
    try {
        const response = await fetch('./jobs.json');
        const data = await response.json();
        
        players.length = 0;
        
        for (let i = 0; i < 15; i++) {
            const randomJob = data.jobs[Math.floor(Math.random() * data.jobs.length)];
            players.push(new player(
                randomJob.job,
                randomJob.wage,
                randomJob.total,
                [],  // empty cars array
                []   // empty houses array
            ));
        }
        
        selectedPlayer = players[0];
        initializeGame();
        
    } catch (error) {
        console.error('Error loading game data:', error);
    }
}

async function loadPropertyData() {
    try {
        const response = await fetch('./properties.json');
        const data = await response.json();
        propertyData = data;
    } catch (error) {
        console.error('Error loading property data:', error);
    }
}

function initializeGame() {

    playerRowsContainer.innerHTML = '';
    
    for (let i = 0; i < 15; i++) {
        const row = document.createElement('div');
        row.className = 'player-row hidden';
        row.innerHTML = `
            <div class="column name">Player ${i + 1}</div>
            <div class="column career">${players[i].job}</div>
            <div class="column wage">$${players[i].wage}</div>
            <div class="column money">$${players[i].total}</div>
            <div class="column cars">Cars: ${players[i].cars.length}</div>
            <div class="column houses">Houses: ${players[i].houses.length}</div>
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
            row.querySelector('.name').textContent = `Player ${index + 1}`;
            row.querySelector('.career').textContent = player.job;
            row.querySelector('.money').textContent = '$' + player.total.toLocaleString();
            
            // Update cars display
            const carsText = player.cars && player.cars.length > 0 ? 
                player.cars.map(car => car.name).join(', ') : 
                'No cars';
            row.querySelector('.cars').textContent = carsText;
            
            // Update houses display
            const housesText = player.houses && player.houses.length > 0 ? 
                player.houses.map(house => house.name).join(', ') : 
                'No houses';
            row.querySelector('.houses').textContent = housesText;
            
            row.classList.remove('hidden');
        } else {
            row.classList.add('hidden');
        }
    });
}

function propertyc() {
    propertyPopup.classList.remove('hidden');
    
    // Update property lists
    const carsList = document.getElementById('cars-list');
    const housesList = document.getElementById('houses-list');
    const carSelector = document.getElementById('car-selector');
    const houseSelector = document.getElementById('house-selector');
    
    // Reset selectors
    carSelector.innerHTML = '<option value="">Select a car</option>';
    houseSelector.innerHTML = '<option value="">Select a house</option>';
    
    // Display owned properties
    carsList.innerHTML = `
        <h4>Cars Owned:</h4>
        <div class="owned-properties">
            ${selectedPlayer.cars && selectedPlayer.cars.length > 0 ? 
                selectedPlayer.cars.map(car => `
                    <div class="owned-property-item">
                        ${car.name}
                        <div class="property-value">Current value: $${car.currentSellPrice?.toLocaleString() || 0}</div>
                    </div>
                `).join('') : '<p>No cars owned</p>'}
        </div>
    `;
    
    housesList.innerHTML = `
        <h4>Houses Owned:</h4>
        <div class="owned-properties">
            ${selectedPlayer.houses && selectedPlayer.houses.length > 0 ? 
                selectedPlayer.houses.map(house => `
                    <div class="owned-property-item">
                        ${house.name}
                        <div class="property-value">Current value: $${house.currentSellPrice?.toLocaleString() || 0}</div>
                    </div>
                `).join('') : '<p>No houses owned</p>'}
        </div>
    `;
    
    // Add available properties to selectors
    propertyData.cars.forEach(car => {
        const option = new Option(
            `${car.name} ($${car.currentBuyPrice.toLocaleString()})`,
            car.name
        );
        carSelector.add(option);
    });
    
    propertyData.houses.forEach(house => {
        const option = new Option(
            `${house.name} ($${house.currentBuyPrice.toLocaleString()})`,
            house.name
        );
        houseSelector.add(option);
    });
    
    // Reset buttons
    updatePropertyPrice('car');
    updatePropertyPrice('house');
}

function updatePropertyPrice(type) {
    const selector = document.getElementById(`${type}-selector`);
    const buyBtn = document.getElementById(`${type}-buy-btn`);
    const sellBtn = document.getElementById(`${type}-sell-btn`);
    
    const selectedValue = selector.value;
    
    if (selectedValue) {
        const property = propertyData[type + 's'].find(p => p.name === selectedValue);
        const ownedProperty = selectedPlayer[type + 's']?.find(p => p.name === selectedValue);
        
        buyBtn.textContent = `Buy: $${property.currentBuyPrice.toLocaleString()}`;
        buyBtn.disabled = false;
        
        if (ownedProperty) {
            sellBtn.textContent = `Sell: $${property.currentSellPrice.toLocaleString()}`;
            sellBtn.disabled = false;
        } else {
            sellBtn.textContent = 'Sell: $0';
            sellBtn.disabled = true;
        }
    } else {
        buyBtn.textContent = 'Buy: $0';
        sellBtn.textContent = 'Sell: $0';
        buyBtn.disabled = true;
        sellBtn.disabled = true;
    }
}

function buyProperty(type) {
    const selector = document.getElementById(`${type}-selector`);
    const propertyName = selector.value;
    const property = propertyData[type + 's'].find(p => p.name === propertyName);
    
    if (!property) return;

    if (selectedPlayer.total >= property.currentBuyPrice) {
        selectedPlayer.total -= property.currentBuyPrice;
        
        if (!selectedPlayer[type + 's']) {
            selectedPlayer[type + 's'] = [];
        }
        
        selectedPlayer[type + 's'].push({
            name: property.name,
            currentSellPrice: property.currentSellPrice,
            purchasePrice: property.currentBuyPrice
        });
        
        updateDisplayedInfo();
        propertyc(); // Refresh the property display
        showNotification(`Successfully purchased ${property.name}!`);
    } else {
        showNotification("Not enough money!");
    }
}

function sellProperty(type) {
    const selector = document.getElementById(`${type}-selector`);
    const propertyName = selector.value;
    const propertyIndex = selectedPlayer[type + 's']?.findIndex(p => p.name === propertyName);
    
    if (propertyIndex === -1) return;

    const property = propertyData[type + 's'].find(p => p.name === propertyName);
    selectedPlayer.total += property.currentSellPrice;
    selectedPlayer[type + 's'].splice(propertyIndex, 1);
    
    updateDisplayedInfo();
    propertyc(); // Refresh the property display
    showNotification(`Successfully sold ${property.name}!`);
}

function bankc() {
    bankPopup.classList.remove('hidden');
    // Update bank popup displays
    document.getElementById('popup_balance').textContent = selectedPlayer.total.toLocaleString();
    document.getElementById('popup_bank_balance').textContent = (selectedPlayer.bankBalance || 0).toLocaleString();
}

function deposit() {
    const amount = parseInt(prompt(`How much would you like to deposit?\nCurrent Balance: $${selectedPlayer.total.toLocaleString()}`));
    
    if (!amount || amount <= 0) {
        showNotification("Please enter a valid amount!");
        return;
    }
    
    if (amount > selectedPlayer.total) {
        showNotification("You don't have enough money!");
        return;
    }
    
    selectedPlayer.total -= amount;
    selectedPlayer.bankBalance = (selectedPlayer.bankBalance || 0) + amount;
    
    // Update displays
    updateDisplayedInfo();
    bankc();
    showNotification(`Successfully deposited $${amount.toLocaleString()}`);
}

function withdraw() {
    const amount = parseInt(prompt(`How much would you like to withdraw?\nBank Balance: $${selectedPlayer.bankBalance.toLocaleString()}`));
    
    if (!amount || amount <= 0) {
        showNotification("Please enter a valid amount!");
        return;
    }
    
    if (amount > selectedPlayer.bankBalance) {
        showNotification("You don't have enough money in the bank!");
        return;
    }
    
    selectedPlayer.bankBalance -= amount;
    selectedPlayer.total += amount;
    
    // Update displays
    updateDisplayedInfo();
    bankc();
    showNotification(`Successfully withdrew $${amount.toLocaleString()}`);
}

function stockc() {
    stockPopup.classList.remove('hidden');
    popupStockBalance.textContent = selectedPlayer.total;
}

function loansc() {
    loansPopup.classList.remove('hidden');
    updateLoanInfo();
}

// Stock functions
let stockPrices = {
    Mitsubishi: 270.33,
    Amazon: 4.4583,
    Walmart: 14.3483,
    Microsoft: 23.5817,
    Apple: 135.8683,
    Tesla: 675.5833,
    Google: 2350.8333,
    Facebook: 300.5833,
    Netflix: 500.8333,
    Disney: 150.3333
};

function updateStockPrices() {
    Object.keys(stockPrices).forEach(stock => {
        const change = Math.random() > 0.5 ? 1.1 : 0.9;
        stockPrices[stock] = Math.round(stockPrices[stock] * change);
        document.getElementById(`${stock}-price`).textContent = stockPrices[stock];
    });
}

function buyStock(stock) {
    const amount = parseInt(prompt(`How many ${stock} stocks to buy?`));
    const total = amount * stockPrices[stock];
    
    if (amount && amount > 0 && total <= selectedPlayer.total) {
        selectedPlayer.total -= total;
        selectedPlayer[`${stock}Stocks`] = (selectedPlayer[`${stock}Stocks`] || 0) + amount;
        updateDisplayedInfo();
        closePopup('stock_popup');
    } else {
        showNotification("Invalid amount or insufficient funds!");
    }
}

function sellStock(stock) {
    const maxAmount = selectedPlayer[`${stock}Stocks`] || 0;
    if (maxAmount === 0) {
        showNotification("No stocks to sell!");
        return;
    }
    
    const amount = parseInt(prompt(`How many ${stock} stocks to sell? (You have ${maxAmount})`));
    if (amount && amount > 0 && amount <= maxAmount) {
        const total = amount * stockPrices[stock];
        selectedPlayer.total += total;
        selectedPlayer[`${stock}Stocks`] -= amount;
        updateDisplayedInfo();
        closePopup('stock_popup');
    } else {
        showNotification("Invalid amount!");
    }
}

// Loan functions
function updateLoanInfo() {
    const loanAmount = selectedPlayer.loan || 0;
    document.getElementById('current-loan').textContent = loanAmount;
}

function takeLoan() {
    const amount = parseInt(prompt("Enter loan amount:"));
    if (amount && amount > 0) {
        selectedPlayer.loan = (selectedPlayer.loan || 0) + amount;
        selectedPlayer.total += amount;
        updateDisplayedInfo();
        updateLoanInfo();
    } else {
        showNotification("Invalid amount!");
    }
}

function payLoan() {
    const currentLoan = selectedPlayer.loan || 0;
    if (currentLoan === 0) {
        showNotification("No loan to pay!");
        return;
    }
    
    const amount = parseInt(prompt(`Enter amount to pay (Current loan: ${currentLoan}):`));
    if (amount && amount > 0 && amount <= selectedPlayer.total) {
        if (amount > currentLoan) {
            showNotification("Payment amount larger than loan!");
            return;
        }
        selectedPlayer.loan -= amount;
        selectedPlayer.total -= amount;
        updateDisplayedInfo();
        updateLoanInfo();
    } else {
        showNotification("Invalid amount or insufficient funds!");
    }
}

function closePopup(popupId) {
    document.getElementById(popupId).classList.add('hidden');
}

// Add age tracking
let currentAge = 20;

function nextRound() {
    if (currentAge < 80) {
        currentAge++;
        document.querySelector('.age').textContent = `AGE: ${currentAge}`;
        
        updatePropertyPrices();
        
        // Add wage and calculate bank interest for each player
        for (let i = 0; i < activePlayerCount; i++) {
            // Add wage
            players[i].total += players[i].wage;
            
            // Calculate bank interest (0.5% per round)
            if (players[i].bankBalance > 0) {
                const interest = Math.floor(players[i].bankBalance * 0.005); // 0.5% interest
                players[i].bankBalance += interest;
                console.log(`Player ${i + 1} earned $${interest} in bank interest`);
            }
            
            // Update property values
            if (players[i].cars) {
                players[i].cars.forEach(car => {
                    const baseCar = propertyData.cars.find(c => c.name === car.name);
                    if (baseCar) {
                        car.currentSellPrice = baseCar.currentSellPrice;
                    }
                });
            }
            if (players[i].houses) {
                players[i].houses.forEach(house => {
                    const baseHouse = propertyData.houses.find(h => h.name === house.name);
                    if (baseHouse) {
                        house.currentSellPrice = baseHouse.currentSellPrice;
                    }
                });
            }
        }
        
        // Update all displays
        updateDisplayedInfo();
        updateStockPrices();
        if (!document.getElementById('bank_popup').classList.contains('hidden')) {
            bankc();
        }
        if (!document.getElementById('property_popup').classList.contains('hidden')) {
            propertyc();
        }
    } else {
        showNotification("Game Over! Maximum age reached!");
    }
}

// Add next round button event listener when window loads
window.addEventListener('load', () => {
    const nextRoundBtn = document.createElement('button');
    nextRoundBtn.className = 'button next-round-btn';
    nextRoundBtn.textContent = 'Next Round';
    nextRoundBtn.onclick = nextRound;
    document.querySelector('.container').appendChild(nextRoundBtn);
    
    // Set initial age
    document.querySelector('.age').textContent = `AGE: ${currentAge}`;
});

// Load events data
async function loadEvents() {
    try {
        const response = await fetch('./events.json');
        const data = await response.json();
        events = data.events;
    } catch (error) {
        console.error('Error loading events:', error);
    }
}

// Add event search functionality
const searchInput = document.querySelector('.event-search input');
const searchResults = document.createElement('div');
searchResults.className = 'search-results';
searchInput.parentNode.insertBefore(searchResults, searchInput.nextSibling);

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    if (searchTerm.length < 1) {
        searchResults.innerHTML = '';
        searchResults.style.display = 'none';  // Hide when no search term
        return;
    }

    const matchingEvents = events.filter(event => 
        event.name.toLowerCase().includes(searchTerm)
    );

    if (matchingEvents.length > 0) {
        searchResults.style.display = 'flex';  // Show when there are results
        searchResults.innerHTML = matchingEvents
            .map(event => `
                <button class="event-button" onclick="applyEvent('${event.name}')">
                    ${event.name}
                    <span class="event-tooltip">${event.description}</span>
                </button>
            `).join('');
    } else {
        searchResults.style.display = 'none';  // Hide when no matches
        searchResults.innerHTML = '';
    }
});

function applyEvent(eventName) {
    const event = events.find(e => e.name === eventName);
    if (!event) return;

    const playerIndex = parseInt(playerSelect.value) - 1;
    selectedPlayer = playerIndex;

    switch (event.effect) {
        case 'split_money':
            // Divorce effect
            players[selectedPlayer].total = Math.floor(players[selectedPlayer].total / 2);
            break;
        case 'increase_wage':
            // Job Promotion effect
            players[selectedPlayer].wage = Math.floor(players[selectedPlayer].wage * 1.2);
            break;
        case 'reduce_money':
            // Market Crash effect
            players[selectedPlayer].total = Math.floor(players[selectedPlayer].total * 0.7);
            break;
    }

    // Update display
    updateDisplayedInfo();
    
    // Clear search and hide results
    searchInput.value = '';
    searchResults.style.display = 'none';
    searchResults.innerHTML = '';
}

// Load events when the page loads
window.addEventListener('load', () => {
    loadEvents();
    loadGameData();
    loadPropertyData();
});

window.addEventListener('mousemove', (e) => {
    root.style.setProperty('--mouse-x', e.clientX + 'px');
    root.style.setProperty('--mouse-y', e.clientY + 'px');
});

function showNotification(message) {
    document.getElementById('notification-message').textContent = message;
    document.getElementById('notification_popup').classList.remove('hidden');
}

function closeNotification() {
    document.getElementById('notification_popup').classList.add('hidden');
}

function updatePropertyPrices() {
    propertyData.cars.forEach(car => {
        const change = 1 + (Math.random() * 0.025 - 0.005); // -0.5% to +2%
        car.currentBuyPrice = Math.round(car.currentBuyPrice * change);
        car.currentSellPrice = Math.round(car.currentSellPrice * change);
    });

    propertyData.houses.forEach(house => {
        const change = 1 + (Math.random() * 0.025 - 0.005); // -0.5% to +2%
        house.currentBuyPrice = Math.round(house.currentBuyPrice * change);
        house.currentSellPrice = Math.round(house.currentSellPrice * change);
    });
}

// Add debug logging
function debugPlayerData() {
    console.log("Active Player Count:", activePlayerCount);
    players.forEach((player, index) => {
        console.log(`Player ${index + 1}:`, {
            job: player.job,
            wage: player.wage,
            total: player.total,
            cars: player.cars,
            houses: player.houses
        });
    });
}