/* eslint-disable no-console */
import scoreboard from './modules/scoreboard.js';
import './index.css';

const submitButton = document.querySelector('.submit');
const nameInput = document.querySelector('.name');
const scoreInput = document.querySelector('.score');

// Define a function to store game ID in local storage
const setGameId = (gameId) => {
  localStorage.setItem('gameId', gameId);
};

// Define a function to get game ID from local storage
const getGameId = () => localStorage.getItem('gameId');

const createGame = async () => {
  try {
    const response = await fetch('https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'My cool new game',
      }),
    });
    const data = await response.json();
    const gameId = data.result.split(': ')[1];

    setGameId(gameId); // Store the game ID in local storage
  } catch (error) {
    console.error('Error creating game:', error);
  }
};
createGame();
// Define a function that fetches the scores for the game with the stored ID
const getScores = async () => {
  try {
    const gameId = getGameId();
    if (!gameId) {
      console.error('No game ID found');
      return;
    }
    const scoresEndpoint = `https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${gameId}/scores`;
    const response = await fetch(scoresEndpoint);
    const data = await response.json();
    // Clear the scoreboard first
    scoreboard.innerHTML = '';
    // Check if there are scores available
    if (data.result.length === 0) {
      const noScoresMessage = document.createElement('div');
      noScoresMessage.innerText = 'No scores available yet';
      scoreboard.appendChild(noScoresMessage);
    } else {
      // Iterate over the score data and create a new element for each score
      data.result.forEach((score) => {
        const scoreElement = document.createElement('div');
        scoreElement.innerText = `Player: ${score.user} - Score: ${score.score}`;
        scoreboard.appendChild(scoreElement);
      });
    }
  } catch (error) {
    console.error('Error fetching scores:', error);
  }
};

// Find the refresh button element and attach a click event handler to it
const refreshButton = document.querySelector('.refresh');
refreshButton.addEventListener('click', () => {
  getScores();
});

submitButton.addEventListener('click', (event) => {
  event.preventDefault(); // prevent the form from submitting

  const gameId = getGameId();
  if (!gameId) {
    console.error('No game ID found');
    return;
  }

  const playerName = nameInput.value;
  const playerScore = parseInt(scoreInput.value, 10);

  fetch(`https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${gameId}/scores`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user: playerName,
      score: playerScore,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Score submitted:', data);
      nameInput.value = '';
      scoreInput.value = '';
      getScores(); // refresh the scoreboard
    })
    .catch((error) => console.error('Error submitting score:', error));
});
