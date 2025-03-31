class MemoryGame {
    constructor() {
        this.categories = {
            animals: [
                "images/animals/tiger.png", "images/animals/dog.png",
                "images/animals/cat.png", "images/animals/monkey.png",
                "images/animals/lion.png", "images/animals/squirrel.png",
                "images/animals/panda.png", "images/animals/rabbit.png",
                "images/animals/turtle.png", "images/animals/hedgehog.png"
            ],
            anime: [
                "images/anime/naruto.png", "images/anime/luffy.png",
                "images/anime/goku.png",  "images/anime/sasuke.png",
                "images/anime/tanjiro.png", "images/anime/nezuko.png",
                "images/anime/zoro.png", "images/anime/yamato.png",
                "images/anime/hancock.png", "images/anime/robin.png"
            ],
            flags: [
                "images/flags/australia.png", "images/flags/france.png", 
                "images/flags/germany.png", "images/flags/italy.png", 
                "images/flags/japan.png", "images/flags/portugal.png", 
                "images/flags/usa.png", "images/flags/vietnam.png",
                "images/flags/spain.png", "images/flags/brazil.png"
            ]
        };
        this.difficultyLevels = {
            easy: 6,
            medium: 8,
            hard: 10
        };
        this.cards = [];
        this.flippedCards = [];
        this.moves = 0;
        this.score = 100;
        this.flippedCount = 0;
        const highScoreEasy = document.getElementById("highScoreEasy");
        const highScoreMedium = document.getElementById("highScoreMedium");
        const highScoreHard = document.getElementById("highScoreHard");
        this.highScore = {
            easy: localStorage.getItem("highScore_easy") || 0,
            medium: localStorage.getItem("highScore_medium") || 0,
            hard: localStorage.getItem("highScore_hard") || 0
        };
        document.getElementById("categorySelect").addEventListener("change", () => this.startGame());
        document.getElementById("level").addEventListener("change", () => this.startGame());
        document.getElementById("level").addEventListener("change", () => this.updateHighScore());
        document.getElementById("startButton").addEventListener("click", () => this.startGame());
        document.getElementById("restartButton").addEventListener("click", () => this.startGame());
        document.getElementById("rulesButton").addEventListener("click", () => this.toggleRules());
        document.getElementById("resetHighScore").addEventListener("click", () => this.resetHighScores());
        this.startGame();
    }
    toggleRules() {
        let rules = document.getElementById("rules");
        if (rules.style.display === "none" || rules.style.display === "") {
            rules.style.display = "block";
        } else {
            rules.style.display = "none";
        }
    }
    shuffle(array) {
        return array.sort(() => 0.5 - Math.random());
    }

    startGame() {
        let selectedCategory = document.getElementById("categorySelect").value;
        let selectedLevel = document.getElementById("level").value;
        // document.getElementById("highScore").innerText = this.highScore[selectedLevel];
        let imgCount = this.difficultyLevels[selectedLevel];
        let images = this.shuffle([...this.categories[selectedCategory]]).slice(0, imgCount);
        images = images.concat(images);
        if (!images) return;

        this.moves = 0;
        this.score = 100;
        this.flippedCards = [];
        this.flippedCount = 0;
        // this.highScore = localStorage.getItem("highScore") || 0;

        document.getElementById("moves").innerText = this.moves;
        document.getElementById("score").innerText = this.score;
        document.getElementById("currentHighScore").innerText = this.highScore[selectedLevel];
        // document.getElementById(`highScore${selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)}`).innerText = this.highScore[selectedLevel];
        document.getElementById("gameBoard").innerHTML = "";
        document.getElementById("winMessage").style.display = "none";
        
        this.cards = this.shuffle(images);
        this.cards.forEach(imgSrc => this.createCard(imgSrc));

        let columns = Math.ceil(Math.sqrt(images.length)); 
        document.getElementById("gameBoard").style.gridTemplateColumns = `repeat(${columns}, 100px)`;

        // this.updatesHighScore(selectedLevel);
    }   

    createCard(imgSrc) {
        let card = document.createElement("div");
        card.classList.add("card");
        card.dataset.image = imgSrc;
        
        let img = document.createElement("img");
        img.src = "images/back.png";
        img.alt = "Lêu Lêu";
        img.classList.add("card-img");
        
        card.appendChild(img);
        card.addEventListener("click", () => this.flipCard(card));
        document.getElementById("gameBoard").appendChild(card);
    }

    flipCard(card) {
        if (this.flippedCards.length < 2 && !card.classList.contains("flipped")) {
            card.classList.add("flipped");
            card.innerHTML = `<img src="${card.dataset.image}" alt="Lêu Lêu">`;
            this.flippedCards.push(card);
            if (this.flippedCards.length === 2) this.checkMatch();
        }
    }

    checkMatch() {
        this.moves++;
        document.getElementById("moves").innerText = this.moves;
        let [card1, card2] = this.flippedCards;
        
        if (card1.dataset.image === card2.dataset.image) {
            this.flippedCards = [];
            this.flippedCount ++;;
            // if (document.querySelectorAll(".card.flipped").length === this.cards.length) {
            if (this.flippedCount === this.cards.length / 2) {
                setTimeout(() => this.showWinMessage(), 300);
            }
        } else {
            this.score = Math.max(0, this.score - 5);
            document.getElementById("score").innerText = this.score;
            setTimeout(() => this.resetCards(card1, card2), 1000);
        }
    }
    

    resetCards(card1, card2) {
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        card1.innerHTML = '<img src="images/back.png" alt="memory card">'; 
        card2.innerHTML = '<img src="images/back.png" alt="memory card">';
        this.flippedCards = [];
    }

    updatesHighScore(selectedLevel) {
        this.highScore[selectedLevel] = localStorage.getItem(`highScore_${selectedLevel}`) || 0;
        document.getElementById(`highScore${selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)}`).innerText = this.highScore[selectedLevel];
    }

    showWinMessage() {
        document.getElementById("winMessage").style.display = "block";
        document.getElementById("finalScore").innerText = this.score;
        let selectedLevel = document.getElementById("level").value;
        
        if (this.score > this.highScore[selectedLevel]) {
            this.highScore[selectedLevel] = this.score;
            localStorage.setItem(`highScore_${selectedLevel}`, this.score);
            this.updateHighScoreDisplay();
        } else {
            document.getElementById("winHighScore").innerText = this.highScore[selectedLevel];
        }
    }

    resetHighScores() {
        if (confirm('Bạn có chắc chắn muốn reset điểm cao nhất không?')) {
            localStorage.clear();
            this.highScore = { easy: 0, medium: 0, hard: 0 };
            this.updateHighScore();
            alert('Điểm cao nhất đã được reset!');
        }
    }
}

new MemoryGame();
