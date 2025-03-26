document.addEventListener('DOMContentLoaded', () => {
    // =====================
    // DOM Elements
    // =====================
    const splashScreen = document.getElementById('splash-screen');
    const splashText = document.getElementById('splash-text');
    const gameContainer = document.getElementById('game-container');
    const modeSelectionScreen = document.getElementById('mode-selection-screen');
    const nameInputScreen = document.getElementById('name-input-screen');
    const gameScreen = document.getElementById('game-screen');
    const scoreboardScreen = document.getElementById('scoreboard-screen');
    const achievementsScreen = document.getElementById('achievements-screen');
    const dailyChallengeScreen = document.getElementById('daily-challenge-screen');
    const resultsScreen = document.getElementById('results-screen');
    
    // Input elements
    const playerNameInput = document.getElementById('player-name');
    const player1NameInput = document.getElementById('player1-name');
    const player2NameInput = document.getElementById('player2-name');
    const startGameBtn = document.getElementById('start-game-btn');
    const difficultySelect = document.getElementById('difficulty');
    const numberStyleSelect = document.getElementById('number-style');
    
    // Game elements
    const currentPlayerSpan = document.getElementById('current-player');
    const currentLevelSpan = document.getElementById('current-level');
    const currentScoreSpan = document.getElementById('current-score');
    const player2ScoreSpan = document.getElementById('player2-score');
    const player2Info = document.getElementById('player2-info');
    const numberDisplay = document.getElementById('number-display');
    const userInput = document.getElementById('user-input');
    const submitBtn = document.getElementById('submit-btn');
    const aiSubmitBtn = document.getElementById('ai-submit-btn');
    const feedback = document.getElementById('feedback');
    const timeAttackTimer = document.getElementById('time-attack-timer');
    const timerDisplay = document.getElementById('timer');
    
    // Powerups
    const peekBtn = document.getElementById('peek-btn');
    const slowmoBtn = document.getElementById('slowmo-btn');
    const doubleBtn = document.getElementById('double-btn');
    
    // AI elements
    const aiThinking = document.getElementById('ai-thinking');
    const aiProgress = document.querySelector('.ai-progress');
    
    // Navigation buttons
    const classicModeBtn = document.getElementById('classic-mode-btn');
    const timeAttackBtn = document.getElementById('time-attack-btn');
    const multiplayerBtn = document.getElementById('multiplayer-btn');
    const dailyChallengeBtn = document.getElementById('daily-challenge-btn');
    const aiChallengeBtn = document.getElementById('ai-challenge-btn');
    const scoreboardBtn = document.getElementById('scoreboard-btn');
    const achievementsBtn = document.getElementById('achievements-btn');
    const backToMenuBtn = document.getElementById('back-to-menu-btn');
    const backToMenuBtn2 = document.getElementById('back-to-menu-btn-2');
    const backToMenuBtn3 = document.getElementById('back-to-menu-btn-3');
    const startChallengeBtn = document.getElementById('start-challenge-btn');
    
    // Results screen
    const resultsTitle = document.getElementById('results-title');
    const resultsContent = document.getElementById('results-content');
    const playAgainBtn = document.getElementById('play-again-btn');
    const shareBtn = document.getElementById('share-btn');
    const menuBtn = document.getElementById('menu-btn');
    
    // Audio elements
    const correctSound = document.getElementById('correct-sound');
    const wrongSound = document.getElementById('wrong-sound');
    const bgMusic = document.getElementById('bg-music');
    const levelUpSound = document.getElementById('level-up-sound');
    const powerupSound = document.getElementById('powerup-sound');
    const countdownSound = document.getElementById('countdown-sound');
    const soundBtn = document.getElementById('sound-btn');
    
    // Social share
    const twitterShareBtn = document.getElementById('twitter-share');
    const facebookShareBtn = document.getElementById('facebook-share');
    const qrBtn = document.getElementById('qr-btn');
    const qrModal = document.getElementById('qr-modal');
    const qrCodeElement = document.getElementById('qr-code');
    const closeModal = document.querySelector('.close');
    
    // Confetti canvas
    const confettiCanvas = document.getElementById('confetti-canvas');
    
    // =====================
    // Game Variables
    // =====================
    let gameState = {
        mode: 'classic', // 'classic', 'timeattack', 'multiplayer', 'daily', 'ai'
        difficulty: 1000, // ms to display number
        numberStyle: 'decimal', // 'decimal', 'binary', 'hex', 'matrix'
        players: [
            { name: '', score: 0, powerups: { peek: 3, slowmo: 1, double: 1 } },
            { name: '', score: 0, powerups: { peek: 3, slowmo: 1, double: 1 } }
        ],
        currentPlayerIndex: 0,
        currentNumber: '',
        currentLevel: 1,
        gameStartTime: 0,
        gameActive: false,
        displayTimeout: null,
        timeLeft: 60,
        timerInterval: null,
        aiInterval: null,
        isPeeking: false,
        isDoublePoints: false,
        isSlowMo: false,
        dailyChallenge: null,
        achievements: {
            firstGame: { name: "First Game", desc: "Complete your first game", unlocked: false, icon: "🎮" },
            perfect10: { name: "Perfect 10", desc: "Reach 10 digits without mistakes", unlocked: false, icon: "🔟" },
            speedster: { name: "Speedster", desc: "Solve 5 numbers in under 10 seconds", unlocked: false, icon: "⚡" },
            powerUser: { name: "Power User", desc: "Use all powerups in one game", unlocked: false, icon: "💎" },
            dailyPlayer: { name: "Daily Player", desc: "Complete 5 daily challenges", unlocked: false, icon: "📅" },
            aiMaster: { name: "AI Master", desc: "Beat the AI 3 times", unlocked: false, icon: "🤖" },
            memoryMaster: { name: "Memory Master", desc: "Reach 20 digits", unlocked: false, icon: "🧠" },
            sharer: { name: "Sharer", desc: "Share your score", unlocked: false, icon: "📤" }
        },
        stats: {
            gamesPlayed: 0,
            digitsMemorized: 0,
            powerupsUsed: 0,
            dailyChallengesCompleted: 0,
            aiBattlesWon: 0
        }
    };

    // =====================
    // Initialization
    // =====================
    // Initialize splash screen sequence
    setTimeout(() => {
        splashText.textContent = "Loading.....";
    }, 500);

    setTimeout(() => {
        splashScreen.style.opacity = '0';
        setTimeout(() => {
            splashScreen.classList.add('hidden');
            gameContainer.classList.remove('hidden');
            loadGame();
        }, 500);
    }, 1000);

    // Initialize local storage
    function loadGame() {
        // Load scores
        if (!localStorage.getItem('memoryGameScores')) {
            localStorage.setItem('memoryGameScores', JSON.stringify({
                classic: [],
                timeattack: [],
                daily: []
            }));
        }

        // Load stats
        if (localStorage.getItem('memoryGameStats')) {
            gameState.stats = JSON.parse(localStorage.getItem('memoryGameStats'));
        }

        // Load achievements
        if (localStorage.getItem('memoryGameAchievements')) {
            const savedAchievements = JSON.parse(localStorage.getItem('memoryGameAchievements'));
            for (const key in savedAchievements) {
                if (gameState.achievements[key]) {
                    gameState.achievements[key].unlocked = savedAchievements[key];
                }
            }
        }

        // Set up daily challenge
        setupDailyChallenge();

        // Start background music
        bgMusic.volume = 0.3;
        bgMusic.play().catch(e => console.log("Autoplay prevented:", e));
    }

    // =====================
    // Event Listeners
    // =====================
    // Mode selection
    classicModeBtn.addEventListener('click', () => {
        gameState.mode = 'classic';
        showNameInputScreen();
    });

    timeAttackBtn.addEventListener('click', () => {
        gameState.mode = 'timeattack';
        showNameInputScreen();
    });

    multiplayerBtn.addEventListener('click', () => {
        gameState.mode = 'multiplayer';
        showNameInputScreen(true);
    });

    dailyChallengeBtn.addEventListener('click', () => {
        gameState.mode = 'daily';
        dailyChallengeScreen.classList.remove('hidden');
        modeSelectionScreen.classList.add('hidden');
    });

    aiChallengeBtn.addEventListener('click', () => {
        gameState.mode = 'ai';
        showNameInputScreen();
    });

    startChallengeBtn.addEventListener('click', () => {
        dailyChallengeScreen.classList.add('hidden');
        showNameInputScreen();
    });

    backToMenuBtn3.addEventListener('click', () => {
        dailyChallengeScreen.classList.add('hidden');
        modeSelectionScreen.classList.remove('hidden');
    });

    // Name input
    startGameBtn.addEventListener('click', startGame);

    // Game controls
    submitBtn.addEventListener('click', checkAnswer);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnswer();
    });

    aiSubmitBtn.addEventListener('click', () => {
        if (gameState.gameActive) {
            userInput.value = gameState.currentNumber;
            checkAnswer();
        }
    });

    // Powerups
    peekBtn.addEventListener('click', usePeekPowerup);
    slowmoBtn.addEventListener('click', useSlowmoPowerup);
    doubleBtn.addEventListener('click', useDoublePowerup);

    // Navigation
    scoreboardBtn.addEventListener('click', showScoreboard);
    achievementsBtn.addEventListener('click', showAchievements);
    backToMenuBtn.addEventListener('click', returnToMenu);
    backToMenuBtn2.addEventListener('click', returnToMenu);
    playAgainBtn.addEventListener('click', playAgain);
    menuBtn.addEventListener('click', returnToMenu);

    // Sound control
    soundBtn.addEventListener('click', toggleSound);

    // Social sharing
    twitterShareBtn.addEventListener('click', shareOnTwitter);
    facebookShareBtn.addEventListener('click', shareOnFacebook);
    qrBtn.addEventListener('click', showQRCode);
    closeModal.addEventListener('click', () => qrModal.classList.add('hidden'));

    // Window click for modal
    window.addEventListener('click', (e) => {
        if (e.target === qrModal) {
            qrModal.classList.add('hidden');
        }
    });

    // Difficulty and style changes
    difficultySelect.addEventListener('change', (e) => {
        gameState.difficulty = parseInt(e.target.value);
    });

    numberStyleSelect.addEventListener('change', (e) => {
        gameState.numberStyle = e.target.value;
        if (gameState.numberStyle === 'matrix') {
            startMatrixRain();
        } else {
            stopMatrixRain();
        }
    });

    // =====================
    // Game Functions
    // =====================
    function showNameInputScreen(multiplayer = false) {
        modeSelectionScreen.classList.add('hidden');
        nameInputScreen.classList.remove('hidden');
        
        if (multiplayer) {
            document.getElementById('single-player-input').classList.add('hidden');
            document.getElementById('multiplayer-input').classList.remove('hidden');
        } else {
            document.getElementById('single-player-input').classList.remove('hidden');
            document.getElementById('multiplayer-input').classList.add('hidden');
        }
    }

    function startGame() {
        // Set player names
        if (gameState.mode === 'multiplayer') {
            gameState.players[0].name = player1NameInput.value.trim() || "Player 1";
            gameState.players[1].name = player2NameInput.value.trim() || "Player 2";
            player2Info.classList.remove('hidden');
        } else {
            gameState.players[0].name = playerNameInput.value.trim() || "Player";
            player2Info.classList.add('hidden');
        }

        if (!gameState.players[0].name) {
            alert('Please enter your name');
            return;
        }

        // Reset game state
        gameState.currentPlayerIndex = 0;
        gameState.currentLevel = 1;
        gameState.players[0].score = 0;
        gameState.players[1].score = 0;
        gameState.players[0].powerups = { peek: 3, slowmo: 1, double: 1 };
        gameState.players[1].powerups = { peek: 3, slowmo: 1, double: 1 };
        gameState.isDoublePoints = false;
        gameState.isSlowMo = false;
        
        // Update UI
        currentPlayerSpan.textContent = gameState.players[0].name;
        currentLevelSpan.textContent = gameState.currentLevel;
        currentScoreSpan.textContent = gameState.players[0].score;
        player2ScoreSpan.textContent = gameState.players[1].score;
        
        // Show game screen
        nameInputScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        
        // Start the game
        gameState.gameActive = true;
        gameState.gameStartTime = Date.now();
        
        // Special modes
        if (gameState.mode === 'timeattack') {
            timeAttackTimer.classList.remove('hidden');
            gameState.timeLeft = 60;
            timerDisplay.textContent = gameState.timeLeft;
            gameState.timerInterval = setInterval(updateTimer, 1000);
        } else {
            timeAttackTimer.classList.add('hidden');
        }
        
        if (gameState.mode === 'ai') {
            aiSubmitBtn.classList.remove('hidden');
        } else {
            aiSubmitBtn.classList.add('hidden');
        }
        
        // Start first round
        startRound();
    }

    function startRound() {
        // Generate number based on current level
        gameState.currentNumber = generateNumber(gameState.currentLevel);
        
        // Apply number style
        displayNumber(gameState.currentNumber);
        
        // Reset input
        userInput.value = '';
        userInput.disabled = true;
        submitBtn.disabled = true;
        feedback.textContent = '';
        
        // Hide number after delay
        let displayTime = gameState.isSlowMo ? gameState.difficulty * 1.5 : gameState.difficulty;
        
        if (gameState.displayTimeout) clearTimeout(gameState.displayTimeout);
        gameState.displayTimeout = setTimeout(() => {
            numberDisplay.textContent = '';
            userInput.disabled = false;
            submitBtn.disabled = false;
            userInput.focus();
            
            // Start AI thinking if in AI mode
            if (gameState.mode === 'ai' && gameState.currentPlayerIndex === 1) {
                startAIThinking();
            }
        }, displayTime);
    }

    function generateNumber(digits) {
        let number = '';
        for (let i = 0; i < digits; i++) {
            number += Math.floor(Math.random() * 10);
        }
        return number;
    }

    function displayNumber(number) {
        switch (gameState.numberStyle) {
            case 'binary':
                numberDisplay.textContent = parseInt(number).toString(2).padStart(number.length * 4, '0');
                numberDisplay.classList.add('binary-digit');
                numberDisplay.classList.remove('hex-digit', 'matrix-style');
                break;
            case 'hex':
                numberDisplay.textContent = parseInt(number).toString(16).toUpperCase();
                numberDisplay.classList.add('hex-digit');
                numberDisplay.classList.remove('binary-digit', 'matrix-style');
                break;
            case 'matrix':
                numberDisplay.textContent = number.split('').map(d => Math.random() > 0.3 ? d : String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
                numberDisplay.classList.add('matrix-style');
                numberDisplay.classList.remove('binary-digit', 'hex-digit');
                break;
            default: // decimal
                numberDisplay.textContent = number;
                numberDisplay.classList.remove('binary-digit', 'hex-digit', 'matrix-style');
        }
        
        // Add animation
        numberDisplay.classList.add('animate__animated', 'animate__fadeIn');
        setTimeout(() => {
            numberDisplay.classList.remove('animate__animated', 'animate__fadeIn');
        }, 500);
    }

    function checkAnswer() {
        if (!gameState.gameActive) return;

        const userAnswer = userInput.value.trim();
        const currentPlayer = gameState.players[gameState.currentPlayerIndex];
        
        if (userAnswer === gameState.currentNumber) {
            // Correct answer
            handleCorrectAnswer(currentPlayer);
        } else {
            // Wrong answer
            handleWrongAnswer(currentPlayer);
        }
    }

    function handleCorrectAnswer(player) {
        // Play correct sound
        correctSound.currentTime = 0;
        correctSound.play();
        
        // Calculate points (double if powerup active)
        let points = gameState.isDoublePoints ? gameState.currentLevel * 2 : gameState.currentLevel;
        player.score += points;
        
        // Update UI
        feedback.textContent = 'Correct! +' + points;
        feedback.className = 'correct-feedback animate__animated animate__bounce';
        currentScoreSpan.textContent = gameState.players[0].score;
        player2ScoreSpan.textContent = gameState.players[1].score;
        
        // Check for achievements
        checkForAchievements();
        
        // Level up
        gameState.currentLevel++;
        currentLevelSpan.textContent = gameState.currentLevel;
        
        // Play level up sound every 5 levels
        if (gameState.currentLevel % 5 === 0) {
            levelUpSound.currentTime = 0;
            levelUpSound.play();
            
            // Add celebration for every 10 levels
            if (gameState.currentLevel % 10 === 0) {
                triggerConfetti();
            }
        }
        
        // Reset double points if active
        if (gameState.isDoublePoints) {
            gameState.isDoublePoints = false;
            doubleBtn.classList.remove('powerup-active');
        }
        
        // Next round or switch player
        if (gameState.mode === 'multiplayer') {
            switchPlayer();
        } else {
            startRound();
        }
    }

    function handleWrongAnswer(player) {
        // Play wrong sound
        wrongSound.currentTime = 0;
        wrongSound.play();
        
        // Update UI
        feedback.textContent = 'Wrong! The number was: ' + gameState.currentNumber;
        feedback.className = 'wrong-feedback animate__animated animate__shakeX';
        numberDisplay.textContent = gameState.currentNumber;
        
        // Screen shake effect
        gameScreen.classList.add('screen-shake');
        setTimeout(() => {
            gameScreen.classList.remove('screen-shake');
        }, 500);
        
        // End game or switch player
        if (gameState.mode === 'timeattack') {
            // In time attack, just deduct time
            gameState.timeLeft = Math.max(0, gameState.timeLeft - 5);
            timerDisplay.textContent = gameState.timeLeft;
            
            // Next round
            setTimeout(() => {
                if (gameState.gameActive) startRound();
            }, 1000);
        } else if (gameState.mode === 'multiplayer') {
            setTimeout(() => {
                if (gameState.gameActive) switchPlayer();
            }, 1000);
        } else {
            endGame();
        }
    }

    function switchPlayer() {
        gameState.currentPlayerIndex = gameState.currentPlayerIndex === 0 ? 1 : 0;
        currentPlayerSpan.textContent = gameState.players[gameState.currentPlayerIndex].name;
        
        // Update powerups display
        updatePowerupsDisplay();
        
        // Start next round
        setTimeout(() => {
            if (gameState.gameActive) startRound();
        }, 1000);
    }

    function endGame() {
        gameState.gameActive = false;
        userInput.disabled = true;
        submitBtn.disabled = true;
        
        // Clear any intervals
        if (gameState.timerInterval) clearInterval(gameState.timerInterval);
        if (gameState.aiInterval) clearInterval(gameState.aiInterval);
        
        // Calculate duration
        const duration = Math.floor((Date.now() - gameState.gameStartTime) / 1000);
        
        // Update stats
        gameState.stats.gamesPlayed++;
        gameState.stats.digitsMemorized += gameState.currentLevel - 1;
        
        // Save stats
        localStorage.setItem('memoryGameStats', JSON.stringify(gameState.stats));
        
        // Show results screen
        showResults(duration);
    }

    function showResults(duration) {
        // Prepare results content based on game mode
        let title = "Game Over!";
        let content = `
            <p>Player: ${gameState.players[0].name}</p>
            <p>Level Reached: ${gameState.currentLevel - 1} digits</p>
            <p>Score: ${gameState.players[0].score}</p>
            <p>Duration: ${duration}s</p>
        `;
        
        if (gameState.mode === 'multiplayer') {
            title = "Game Complete!";
            content = `
                <p>${gameState.players[0].name}: ${gameState.players[0].score} points</p>
                <p>${gameState.players[1].name}: ${gameState.players[1].score} points</p>
                <p>Winner: ${gameState.players[0].score > gameState.players[1].score ? 
                    gameState.players[0].name : 
                    gameState.players[1].name}</p>
                <p>Total digits: ${gameState.currentLevel - 1}</p>
            `;
        } else if (gameState.mode === 'timeattack') {
            title = "Time's Up!";
            content = `
                <p>Player: ${gameState.players[0].name}</p>
                <p>Digits memorized: ${gameState.currentLevel - 1}</p>
                <p>Final score: ${gameState.players[0].score}</p>
            `;
        } else if (gameState.mode === 'ai') {
            title = gameState.players[0].score > gameState.players[1].score ? 
                "You Won!" : "AI Won!";
            content = `
                <p>Your score: ${gameState.players[0].score}</p>
                <p>AI score: ${gameState.players[1].score}</p>
                <p>Digits reached: ${gameState.currentLevel - 1}</p>
            `;
            
            if (gameState.players[0].score > gameState.players[1].score) {
                gameState.stats.aiBattlesWon++;
                unlockAchievement('aiMaster');
            }
        }
        
        // Save score if not AI mode
        if (gameState.mode !== 'ai') {
            saveScore(gameState.players[0].name, gameState.currentLevel - 1, duration, gameState.mode);
        }
        
        // Set results content
        resultsTitle.textContent = title;
        resultsContent.innerHTML = content;
        
        // Show results screen
        gameScreen.classList.add('hidden');
        resultsScreen.classList.remove('hidden');
        
        // Trigger confetti if high score
        if (gameState.currentLevel - 1 >= 10) {
            triggerConfetti();
        }
    }

    function saveScore(name, score, duration, mode) {
        const scoresData = JSON.parse(localStorage.getItem('memoryGameScores'));
        const newScore = {
            name,
            score,
            duration,
            date: new Date().toISOString(),
            level: score
        };
        
        scoresData[mode].push(newScore);
        
        // Sort and keep top 10
        scoresData[mode].sort((a, b) => b.score - a.score);
        scoresData[mode] = scoresData[mode].slice(0, 10);
        
        localStorage.setItem('memoryGameScores', JSON.stringify(scoresData));
    }

    function playAgain() {
        resultsScreen.classList.add('hidden');
        
        if (gameState.mode === 'daily') {
            dailyChallengeScreen.classList.remove('hidden');
        } else {
            gameScreen.classList.remove('hidden');
            startGame();
        }
    }

    function returnToMenu() {
        resultsScreen.classList.add('hidden');
        scoreboardScreen.classList.add('hidden');
        achievementsScreen.classList.add('hidden');
        dailyChallengeScreen.classList.add('hidden');
        gameScreen.classList.add('hidden');
        modeSelectionScreen.classList.remove('hidden');
    }

    // =====================
    // Powerup Functions
    // =====================
    function usePeekPowerup() {
        const player = gameState.players[gameState.currentPlayerIndex];
        
        if (player.powerups.peek > 0 && !gameState.isPeeking) {
            gameState.isPeeking = true;
            player.powerups.peek--;
            updatePowerupsDisplay();
            
            // Show number briefly
            numberDisplay.textContent = gameState.currentNumber;
            setTimeout(() => {
                numberDisplay.textContent = '';
                gameState.isPeeking = false;
            }, 1000);
            
            // Play sound
            powerupSound.currentTime = 0;
            powerupSound.play();
            
            // Update stats
            gameState.stats.powerupsUsed++;
            
            // Check for achievement
            checkForAchievements();
        }
    }

    function useSlowmoPowerup() {
        const player = gameState.players[gameState.currentPlayerIndex];
        
        if (player.powerups.slowmo > 0 && !gameState.isSlowMo) {
            gameState.isSlowMo = true;
            player.powerups.slowmo--;
            updatePowerupsDisplay();
            
            // Visual feedback
            slowmoBtn.classList.add('powerup-active');
            
            // Play sound
            powerupSound.currentTime = 0;
            powerupSound.play();
            
            // Update stats
            gameState.stats.powerupsUsed++;
            
            // Check for achievement
            checkForAchievements();
        }
    }

    function useDoublePowerup() {
        const player = gameState.players[gameState.currentPlayerIndex];
        
        if (player.powerups.double > 0 && !gameState.isDoublePoints) {
            gameState.isDoublePoints = true;
            player.powerups.double--;
            updatePowerupsDisplay();
            
            // Visual feedback
            doubleBtn.classList.add('powerup-active');
            
            // Play sound
            powerupSound.currentTime = 0;
            powerupSound.play();
            
            // Update stats
            gameState.stats.powerupsUsed++;
            
            // Check for achievement
            checkForAchievements();
        }
    }

    function updatePowerupsDisplay() {
        const player = gameState.players[gameState.currentPlayerIndex];
        
        peekBtn.title = `Peek (${player.powerups.peek} left)`;
        peekBtn.disabled = player.powerups.peek <= 0;
        
        slowmoBtn.title = `Slow Motion (${player.powerups.slowmo} left)`;
        slowmoBtn.disabled = player.powerups.slowmo <= 0;
        
        doubleBtn.title = `Double Points (${player.powerups.double} left)`;
        doubleBtn.disabled = player.powerups.double <= 0;
    }

    // =====================
    // Special Modes
    // =====================
    function updateTimer() {
        gameState.timeLeft--;
        timerDisplay.textContent = gameState.timeLeft;
        
        // Play countdown sound last 5 seconds
        if (gameState.timeLeft <= 5 && gameState.timeLeft > 0) {
            countdownSound.currentTime = 0;
            countdownSound.play();
        }
        
        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timerInterval);
            endGame();
        }
    }

    function startAIThinking() {
        aiThinking.classList.remove('hidden');
        userInput.disabled = true;
        submitBtn.disabled = true;
        
        let progress = 0;
        const aiSpeed = Math.max(300, 1000 - (gameState.currentLevel * 20));
        
        gameState.aiInterval = setInterval(() => {
            progress += 5;
            aiProgress.style.width = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(gameState.aiInterval);
                aiThinking.classList.add('hidden');
                
                // AI has a chance to make mistakes based on difficulty
                const mistakeChance = Math.min(0.3, gameState.currentLevel * 0.01);
                if (Math.random() < mistakeChance) {
                    // AI makes a mistake
                    const wrongNum = gameState.currentNumber.split('')
                        .map((d, i) => i === Math.floor(Math.random() * gameState.currentNumber.length) ? 
                            (parseInt(d) + 1) % 10 : d)
                        .join('');
                    userInput.value = wrongNum;
                } else {
                    // AI gets it right
                    userInput.value = gameState.currentNumber;
                }
                
                checkAnswer();
            }
        }, aiSpeed / 20);
    }

    function setupDailyChallenge() {
        const today = new Date().toISOString().split('T')[0];
        const challenges = [
            {
                name: "Reverse Day",
                description: "Type the numbers backward!",
                modifiers: ["All numbers must be entered in reverse"],
                checkAnswer: (input, number) => input === number.split('').reverse().join('')
            },
            {
                name: "No Mistakes Allowed",
                description: "One wrong answer and it's game over!",
                modifiers: ["Single life"],
                checkAnswer: null // Uses standard checking
            },
            {
                name: "Lucky 7s",
                description: "Every 7 gives you bonus points!",
                modifiers: ["+5 points for each 7 in the number"],
                checkAnswer: null // Uses standard checking with bonus
            },
            {
                name: "Binary Challenge",
                description: "Numbers displayed in binary format",
                modifiers: ["Decimal numbers displayed in binary"],
                checkAnswer: null // Uses standard checking
            },
            {
                name: "Speed Round",
                description: "Numbers flash twice as fast!",
                modifiers: ["Display time halved"],
                checkAnswer: null // Uses standard checking
            }
        ];
        
        // Select challenge based on day of month
        const dayOfMonth = new Date().getDate();
        gameState.dailyChallenge = challenges[dayOfMonth % challenges.length];
        
        // Special case for binary challenge
        if (gameState.dailyChallenge.name === "Binary Challenge") {
            gameState.numberStyle = 'binary';
            numberStyleSelect.value = 'binary';
        }
        
        // Update UI
        document.getElementById('challenge-name').textContent = gameState.dailyChallenge.name;
        document.getElementById('challenge-description').textContent = gameState.dailyChallenge.description;
        
        const modifiersEl = document.getElementById('challenge-modifiers');
        modifiersEl.innerHTML = '';
        gameState.dailyChallenge.modifiers.forEach(mod => {
            const span = document.createElement('span');
            span.className = 'challenge-modifier';
            span.textContent = mod;
            modifiersEl.appendChild(span);
        });
    }

    // =====================
    // Scoreboard & Achievements
    // =====================
    function showScoreboard() {
        const scoresData = JSON.parse(localStorage.getItem('memoryGameScores'));
        
        // Set up tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                displayScores(btn.dataset.tab);
            });
        });
        
        // Display initial scores
        displayScores('classic');
        
        // Show scoreboard
        gameScreen.classList.add('hidden');
        nameInputScreen.classList.add('hidden');
        scoreboardScreen.classList.remove('hidden');
    }

    function displayScores(mode) {
        const scoresData = JSON.parse(localStorage.getItem('memoryGameScores'));
        const scores = scoresData[mode] || [];
        scoreboardTable.innerHTML = '';
        
        if (scores.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="5">No scores yet</td>';
            scoreboardTable.appendChild(row);
        } else {
            scores.forEach((score, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${score.name}</td>
                    <td>${score.score}</td>
                    <td>${score.duration}s</td>
                    <td>${new Date(score.date).toLocaleDateString()}</td>
                `;
                scoreboardTable.appendChild(row);
            });
        }
    }

    function showAchievements() {
        const achievementsGrid = document.getElementById('achievements-grid');
        achievementsGrid.innerHTML = '';
        
        for (const key in gameState.achievements) {
            const achievement = gameState.achievements[key];
            const card = document.createElement('div');
            card.className = `achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`;
            card.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.desc}</div>
                <div class="achievement-status">${achievement.unlocked ? '✔ Unlocked' : '🔒 Locked'}</div>
            `;
            achievementsGrid.appendChild(card);
        }
        
        // Show achievements screen
        gameScreen.classList.add('hidden');
        nameInputScreen.classList.add('hidden');
        achievementsScreen.classList.remove('hidden');
    }

    function checkForAchievements() {
        // First game
        if (gameState.stats.gamesPlayed === 1 && !gameState.achievements.firstGame.unlocked) {
            unlockAchievement('firstGame');
        }
        
        // Perfect 10
        if (gameState.currentLevel >= 10 && !gameState.achievements.perfect10.unlocked) {
            unlockAchievement('perfect10');
        }
        
        // Power User (used all powerups)
        const player = gameState.players[gameState.currentPlayerIndex];
        if (player.powerups.peek === 0 && player.powerups.slowmo === 0 && player.powerups.double === 0 && 
            !gameState.achievements.powerUser.unlocked) {
            unlockAchievement('powerUser');
        }
        
        // Memory Master
        if (gameState.currentLevel >= 20 && !gameState.achievements.memoryMaster.unlocked) {
            unlockAchievement('memoryMaster');
        }
    }

    function unlockAchievement(key) {
        if (gameState.achievements[key] && !gameState.achievements[key].unlocked) {
            gameState.achievements[key].unlocked = true;
            
            // Save to localStorage
            const savedAchievements = {};
            for (const k in gameState.achievements) {
                savedAchievements[k] = gameState.achievements[k].unlocked;
            }
            localStorage.setItem('memoryGameAchievements', JSON.stringify(savedAchievements));
            
            // Show notification
            showAchievementNotification(gameState.achievements[key]);
        }
    }

    function showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification animate__animated animate__bounceInRight';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-text">
                <div class="achievement-title">Achievement Unlocked!</div>
                <div class="achievement-name">${achievement.name}</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('animate__bounceInRight');
            notification.classList.add('animate__fadeOutRight');
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }

    // =====================
    // Sound & Effects
    // =====================
    function toggleSound() {
        if (bgMusic.paused) {
            bgMusic.play();
            soundBtn.textContent = "🔊";
        } else {
            bgMusic.pause();
            soundBtn.textContent = "🔇";
        }
    }

    function triggerConfetti() {
        const canvas = confettiCanvas;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const ctx = canvas.getContext('2d');
        const particles = [];
        const particleCount = 150;
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                size: Math.random() * 10 + 5,
                speed: Math.random() * 3 + 2,
                color: `hsl(${Math.random() * 60 + 100}, 100%, 50%)`,
                angle: Math.random() * Math.PI * 2
            });
        }
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            let stillActive = false;
            particles.forEach(p => {
                p.y += p.speed;
                p.angle += 0.01;
                p.x += Math.sin(p.angle) * 1;
                
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                
                if (p.y < canvas.height) {
                    stillActive = true;
                }
            });
            
            if (stillActive) {
                requestAnimationFrame(animate);
            }
        }
        
        animate();
    }

    function startMatrixRain() {
        stopMatrixRain();
        
        const canvas = document.createElement('canvas');
        canvas.className = 'matrix-rain';
        document.body.appendChild(canvas);
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const ctx = canvas.getContext('2d');
        const columns = Math.floor(canvas.width / 20);
        const drops = Array(columns).fill(1);
        
        function draw() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#00ff00';
            ctx.font = '15px monospace';
            
            drops.forEach((y, i) => {
                const text = String.fromCharCode(Math.random() * 128);
                ctx.fillText(text, i * 20, y * 20);
                
                if (y * 20 > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            });
        }
        
        const interval = setInterval(draw, 33);
        
        // Store reference to stop later
        canvas.dataset.interval = interval;
        
        // Handle resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    function stopMatrixRain() {
        const existingCanvas = document.querySelector('.matrix-rain');
        if (existingCanvas) {
            clearInterval(parseInt(existingCanvas.dataset.interval));
            existingCanvas.remove();
        }
    }

    // =====================
    // Social Sharing
    // =====================
    function shareOnTwitter() {
        const text = `I scored ${gameState.players[0].score} points in shanecore_systems™ Memory Game! Can you beat me?`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
        
        unlockAchievement('sharer');
    }

    function shareOnFacebook() {
        const text = `I scored ${gameState.players[0].score} points in shanecore_systems™ Memory Game!`;
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
        
        unlockAchievement('sharer');
    }

    function showQRCode() {
        QRCode.toCanvas(qrCodeElement, window.location.href, { width: 200 }, (error) => {
            if (error) console.error(error);
            qrModal.classList.remove('hidden');
        });
    }

    // =====================
    // Initial Achievements Check
    // =====================
    function checkInitialAchievements() {
        // Daily Player
        if (gameState.stats.dailyChallengesCompleted >= 5 && !gameState.achievements.dailyPlayer.unlocked) {
            unlockAchievement('dailyPlayer');
        }
        
        // AI Master
        if (gameState.stats.aiBattlesWon >= 3 && !gameState.achievements.aiMaster.unlocked) {
            unlockAchievement('aiMaster');
        }
    }

    // Run initial checks
    checkInitialAchievements();
});