////////////////////////////////////
// Preload.
////////////////////////////////////
const images = [
    'Images/Background/ringBackground.jpg',
    'Images/Boxer1Element/idle/boxing1Idle.png',
    'Images/Boxer1Element/punchLeft/__Boxing04_PunchLeft_000.png',
  ];
  
function preloadImages(urls) {
    urls.forEach(function(url) {
        var img = new Image();
        img.src = url;
    });
};
preloadImages(images);
  

////////////////////////////////////
// Variables.
////////////////////////////////////

let score1 = 0;
let score2 = 0;
let maxScore = 100;
let gameEnded = false;
let decrementInterval;
let keyIsPressedPlayer1 = false;
let keyIsPressedPlayer2 = false;


////////////////////////////////////
// Récupération des éléments HTML.
////////////////////////////////////

playMusicButton.addEventListener('click', () => {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
        playMusicButton.src = 'Music/sound.png';
    } else {
        backgroundMusic.pause();
        playMusicButton.src = 'Music/sound--off.png';
    }
});


document.getElementById('player1').addEventListener('click', () => {
    if (!gameEnded) {
        score1++;
        updateScoreAndLifeBar(score1, 'score1', 'lifeBar1');
        resetDecrementInterval();
        checkGameOver();
    }
});

document.getElementById('player2').addEventListener('click', () => {
    if (!gameEnded) {
        score2++;
        updateScoreAndLifeBar(score2, 'score2', 'lifeBar2');
        resetDecrementInterval();
        checkGameOver();
    }
});

document.addEventListener('keydown', (event) => {
    if (!gameEnded) {
        if (event.key === 'q'  || event.key === 'Q') {
            if (!keyIsPressedPlayer1) {
                keyIsPressedPlayer1 = true;
                score1++;
                updateScoreAndLifeBar(score1, 'score1', 'lifeBar1');
                resetDecrementInterval();
                checkGameOver();
                playAnimation('player1');
            }
        } else if (event.key === 'm' || event.key === 'M') {
            if (!keyIsPressedPlayer2) {
                keyIsPressedPlayer2 = true;
                score2++;
                updateScoreAndLifeBar(score2, 'score2', 'lifeBar2');
                resetDecrementInterval();
                checkGameOver();
                playAnimation('player2');
            }
        }
    }
});

document.addEventListener('keyup', (event) => {
    // Réinitialise l'état de la touche pour le joueur 1 et 2 si keyisPressed
    if (event.key === 'q'  || event.key === 'Q') {
        keyIsPressedPlayer1 = false;
    } else if (event.key === 'm' || event.key === 'M') {
        keyIsPressedPlayer2 = false;
    }
});


////////////////////////////////////
// Fonction playAnimation.
////////////////////////////////////

const playAnimation = (playerId) => {
    // Animation du joueur spécifié.
    const player = document.getElementById(playerId);
    const playerImg = player.querySelector('.animation');
    
    playerImg.classList.add('playing-animation');
    
    setTimeout(() => {
        playerImg.classList.remove('playing-animation');
    }, 100);
};


////////////////////////////////////
// Fonction resetDecrementInterval.
////////////////////////////////////

const resetDecrementInterval = () => {
    clearInterval(decrementInterval);
    decrementInterval = setInterval(() => {
        if (!gameEnded) {
            if (score1 > 0) {
                score1--;
                updateScoreAndLifeBar(score1, 'score1', 'lifeBar1');
                checkGameOver();
            }
            if (score2 > 0) {
                score2--;
                updateScoreAndLifeBar(score2, 'score2', 'lifeBar2');
                checkGameOver();
            }
        }
    }, 250);
};


////////////////////////////////////
// Fonction updateScoreAndLifeBar.
////////////////////////////////////

const updateScoreAndLifeBar = (score, scoreElementId, lifeBarElementId) => {
    score = Math.max(score, 0);

    document.getElementById(scoreElementId).innerText = score;

    const lifeBar = document.getElementById(lifeBarElementId);
    const innerBar = lifeBar.querySelector('.inner-bar');
    const percentage = ((maxScore - score) / maxScore) * 100;

    // Ajouter une classe en fonction du pourcentage pour gérer le style en CSS
    lifeBar.classList.toggle('red', percentage <= 30);
    lifeBar.classList.toggle('yellow', percentage > 30 && percentage <= 60);
    lifeBar.classList.toggle('green', percentage > 60);

    innerBar.style.width = percentage + '%';
};


////////////////////////////////////
// Fonction checkGameOver.
////////////////////////////////////

const checkGameOver = () => {
    const lifeBar1 = document.getElementById('lifeBar1');
    const lifeBar2 = document.getElementById('lifeBar2');

    // Vérification si la barre de vie du joueur 1 et du joueur 2 est complètement déchargée.
    const isPlayer1Dead = parseInt(lifeBar1.querySelector('.inner-bar').style.width) <= 0;
    const isPlayer2Dead = parseInt(lifeBar2.querySelector('.inner-bar').style.width) <= 0;

    // Termine le jeu si l'un des joueurs atteint le score maximum et perd toute sa vie.
    if ((score1 >= maxScore && isPlayer1Dead) || (score2 >= maxScore && isPlayer2Dead)) {
        endGame();
    }
};


////////////////////////////////////
// Fonction endGame.
////////////////////////////////////

const endGame = () => {
    gameEnded = true;

    const winnerMessage = document.getElementById('winner-message');
    const overlay = document.getElementById('overlay');
    const playMusicButton = document.getElementById('playMusicButton');
    const backgroundMusic = document.getElementById('backgroundMusic');

    // Déterminer le gagnant en fonction des scores.
    if (score1 >= maxScore) {
        winnerMessage.innerText = 'Boxer 1 has won!';
    } else {
        winnerMessage.innerText = 'Boxer 2 has won!';
    }
    
    overlay.style.display = 'flex';

    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    playMusicButton.src = 'Music/sound--off.png';
};


////////////////////////////////////
// Fonction restartGame.
////////////////////////////////////

const restartGame = () => {
    score1 = 0;
    score2 = 0;
    gameEnded = false;
    document.querySelector('.container').style.filter = 'none';
    document.getElementById('overlay').style.display = 'none';
    updateScoreAndLifeBar(score1, 'score1', 'lifeBar1');
    updateScoreAndLifeBar(score2, 'score2', 'lifeBar2');
};