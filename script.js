const bank = document.getElementById('bank');
const popup = document.querySelector('.pop_overlay');
const popup_balance = document.getElementById('popup_balance');


class player
{
    constructor(name, job, total, product, debuff) 
    {
        this.name = name;
        this.job = job;
        this.total = total;
        this.product = product;
        this.debuff = debuff;
    }
}
const name = ["Adam", "Frank", "Sunny", "Ethan"];
const job = ["Lawyer", "Computer Engineer", "Dentist", "Robber"];
const total = [1000, 20000, 300, 0];
const product = ["None", "House", "Car"];
const debuff = ["None", "Broken leg"];

player1 = new player(name[Math.floor(Math.random() * 4)], job[Math.floor(Math.random() * 4)], total[Math.floor(Math.random() * 4)], product[Math.floor(Math.random() * 3)], debuff[Math.floor(Math.random() * 2)]);
player2 = new player(name[Math.floor(Math.random() * 4)], job[Math.floor(Math.random() * 4)], total[Math.floor(Math.random() * 4)], product[Math.floor(Math.random() * 3)], debuff[Math.floor(Math.random() * 2)]);
player3 = new player(name[Math.floor(Math.random() * 4)], job[Math.floor(Math.random() * 4)], total[Math.floor(Math.random() * 4)], product[Math.floor(Math.random() * 3)], debuff[Math.floor(Math.random() * 2)]);
player4 = new player(name[Math.floor(Math.random() * 4)], job[Math.floor(Math.random() * 4)], total[Math.floor(Math.random() * 4)], product[Math.floor(Math.random() * 3)], debuff[Math.floor(Math.random() * 2)]);
player5 = new player(name[Math.floor(Math.random() * 4)], job[Math.floor(Math.random() * 4)], total[Math.floor(Math.random() * 4)], product[Math.floor(Math.random() * 3)], debuff[Math.floor(Math.random() * 2)]);


function load()
{
    document.getElementById("name1").innerHTML = player1.name;
    document.getElementById("job1").innerHTML = player1.job;
    document.getElementById("total1").innerHTML = "$" + player1.total;
    document.getElementById("product1").innerHTML = player1.product;
}

function bankc() {
    popup.classList.remove('hidden');
    popup_balance.innerHTML = player1.total;
}

function closePopup() {
    popup.classList.add('hidden');
}
//give hidden class to all element, how much number input, for loop and remove the hidden element