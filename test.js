const categories = {
    animals: [
        "images/animals/tiger.png", "images/animals/tiger.png", "images/animals/dog.png", "images/animals/dog.png",
        "images/animals/cat.png", "images/animals/cat.png", "images/animals/monkey.png", "images/animals/monkey.png",
        "images/animals/lion.png", "images/animals/lion.png", "images/animals/squirrel.png", "images/animals/squirrel.png",
        "images/animals/panda.png", "images/animals/panda.png", "images/animals/rabbit.png", "images/animals/rabbit.png"
    ],
    anime: [
        "images/anime/naruto.png", "images/anime/naruto.png", "images/anime/luffy.png", "images/anime/luffy.png",
        "images/anime/goku.png", "images/anime/goku.png", "images/anime/sasuke.png", "images/anime/sasuke.png",
        "images/anime/tanjiro.png", "images/anime/tanjiro.png", "images/anime/nezuko.png", "images/anime/nezuko.png",
        "images/anime/zoro.png", "images/anime/zoro.png", "images/anime/yamato.png", "images/anime/yamato.png"
    ],
    flags: [
        "images/flags/australia.png", "images/flags/australia.png",
        "images/flags/france.png", "images/flags/france.png",
        "images/flags/germany.png", "images/flags/germany.png",
        "images/flags/italy.png", "images/flags/italy.png",
        "images/flags/japan.png", "images/flags/japan.png",
        "images/flags/portugal.png", "images/flags/portugal.png",
        "images/flags/usa.png", "images/flags/usa.png",
        "images/flags/vietnam.png", "images/flags/vietnam.png"
    ]
};

let cards = [];
let flippedCards = [];
let moves = 0;
let score = 100;
let highScore = localStorage.getItem("highScore") || 0;

// 🔹 Trộn mảng hình ảnh (Shuffle)
function shuffle(array) {
    return array.sort(() => 0.5 - Math.random());
}

// 🔹 Khởi động trò chơi
function startGame() {
    let selectedCategory = document.getElementById("categorySelect").value;
    let images = categories[selectedCategory];

    // if (!images) {
    //     alert("Lỗi: Không tìm thấy danh mục hình ảnh!");
    //     return;
    // }

    moves = 0;
    score = 100;
    flippedCards = [];

    // ⚡ Lấy điểm cao từ localStorage và cập nhật giao diện
    highScore = localStorage.getItem("highScore") || 0;
    document.getElementById("moves").innerText = moves;
    document.getElementById("score").innerText = score;
    document.getElementById("highScore").innerText = highScore;
    let board = document.getElementById("gameBoard");
    board.innerHTML = "";
    document.getElementById("winMessage").style.display = "none";
    cards = shuffle([...images]);

    cards.forEach((imgSrc) => {
        let card = document.createElement("div");
        card.classList.add("card");
        card.dataset.image = imgSrc;

        let img = document.createElement("img");
        img.src = "images/back.png"; // Hình nền mặc định
        img.alt = "card";
        img.classList.add("card-img");

        card.appendChild(img);
        card.addEventListener("click", flipCard);
        board.appendChild(card);
    });
}

// 🔹 Xử lý khi lật thẻ
function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains("flipped")) {
        this.classList.add("flipped");
        let imgSrc = this.dataset.image;
        this.innerHTML = `<img src="${imgSrc}" alt="memory card">`;
        flippedCards.push(this);
        
        if (flippedCards.length === 2) {
            checkMatch();
        }
    }
}

// 🔹 Kiểm tra cặp thẻ
function checkMatch() {
    moves++;
    document.getElementById("moves").innerText = moves;

    let [card1, card2] = flippedCards;
    if (card1.dataset.image === card2.dataset.image) {
        flippedCards = [];
    } else {
        setTimeout(() => {
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
            
            // Đổi lại ảnh mặt sau
            card1.querySelector("img").src = "images/back.png";
            card2.querySelector("img").src = "images/back.png";

            flippedCards = [];
        }, 1000);
    }
}

function checkMatch() {
    moves++;
    document.getElementById("moves").innerText = moves;

    let [card1, card2] = flippedCards;
    if (card1.dataset.image === card2.dataset.image) {
        flippedCards = [];
        
        // Kiểm tra xem tất cả các thẻ đã mở chưa
        if (document.querySelectorAll(".card.flipped").length === cards.length) {
            setTimeout(showWinMessage, 500);
        }
    } else {
        // Nếu lật sai, trừ 5 điểm (nhưng không để điểm âm)
        score = Math.max(0, score - 5);
        document.getElementById("score").innerText = score;

        setTimeout(() => {
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");

            // Đổi lại ảnh mặt sau
            card1.querySelector("img").src = "images/back.png";
            card2.querySelector("img").src = "images/back.png";

            flippedCards = [];
        }, 800);
    }
}

// Hiển thị thông báo chiến thắng
function showWinMessage() {
    document.getElementById("winMessage").style.display = "block";
    document.getElementById("finalScore").innerText = score; // Hiển thị điểm số cuối cùng

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore); // Lưu vào localStorage
        document.getElementById("highScore").innerText = highScore; // Cập nhật giao diện
        document.getElementById("winHighScore").innerText = highScore; // Cập nhật điểm cao trong thông báo chiến thắng
    } else {
        // Nếu không phá kỷ lục, vẫn phải hiển thị điểm cao cũ trong hộp thoại
        document.getElementById("winHighScore").innerText = highScore;
    }
}

document.getElementById("categorySelect").addEventListener("change", startGame);

startGame();

