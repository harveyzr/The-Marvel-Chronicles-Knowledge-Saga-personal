var publicKey = '8d2bc57ce15d6a17eeca97819795c187';
var baseUrl = 'https://gateway.marvel.com/v1/public/';
var score = 0;
var questionCount = 0;

function fetchCharacterImage(character, retryCount) {
    var image = `${character.thumbnail.path}.${character.thumbnail.extension}`;
    var imageDisplay = document.getElementById('imageDisplay');
    imageDisplay.src = '';

    // Check if the image URL contains "image_not_available"
    if (image.includes("image_not_available")) {
        // Display a placeholder image
        imageDisplay.src = 'assets/images/placeholder.avif';
        return; // Exit the function
    }

    // Create an image element to pre-load the image and check for errors
    var tempImage = new Image();
    tempImage.onload = function() {
        // Image loaded successfully, display it
        imageDisplay.src = image;
    };
    tempImage.onerror = function() {
        // Image failed to load, handle error
        if (retryCount < 3) {
            // Retry fetching the image
            var retryDelay = Math.pow(2, retryCount) * 1000; 
            setTimeout(function() {
                fetchCharacterImage(character, retryCount + 1);
            }, retryDelay);
        } else {
            // Display a placeholder image if retries fail
            imageDisplay.src = 'assets/images/placeholder.avif';
        }
    };

    // Set the source of the temporary image to trigger loading
    tempImage.src = image;
}


function quizCharacters() {

    if (questionCount >= 10) {
        endQuiz();
        return; // Exit the function if the quiz has ended
    }

    var offset = Math.floor(Math.random() * 1490);
    var url = `${baseUrl}characters?apikey=${publicKey}&offset=${offset}&limit=1`;

    fetch(url)
    .then(response => response.json())
        .then(data => {
            var currentCharacter = data.data.results[0];
            var characterName = currentCharacter.name;

            if (!isPlaceholderImage(currentCharacter.thumbnail)) {
                fetchCharacterImage(currentCharacter, 0);
                displayQuiz(characterName);
                questionCount++; 
        }else{
            quizCharacters();
        }
    })
        .catch(error => console.log('Error fetching character:', error));
};

function displayQuiz(characterName, characterDescription) {
    var choices = document.getElementById('choices');
    var results = document.getElementById('results');

    results.textContent = '';
    choices.innerHTML = '';


    var offset = Math.floor(Math.random() * 1490);

    var apiUrl = `${baseUrl}characters?apikey=${publicKey}&offset=${offset}&limit=3`;
    fetch(apiUrl)
    .then(response => response.json())
        .then(data => {
            var otherCharacters = data.data.results.map(character => character.name);
            var options = otherCharacters.concat(characterName);
            options = shuffleArray(options);
            options = options.slice(0, 4);

            options.forEach(option => {
                var choiceButtons = document.createElement('button');
                choiceButtons.classList.add('choices');
                choiceButtons.textContent = option;
                choiceButtons.onclick = function() {
                if (option === characterName) {
                    results.textContent = 'Correct!';
                    score++;
                    quizCharacters();
                } else {
                    results.textContent = 'Incorrect. Try again!';
                    score--;
                }
            };
            choices.appendChild(choiceButtons);
        });
    })
    .catch(error => console.log('Error fetching options:', error));
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function saveHighScore(name, score) {
    let highScores = localStorage.getItem('highScores') ? JSON.parse(localStorage.getItem('highScores')) : [];
    highScores.push({ name, score });
    highScores.sort((a, b) => b.score - a.score); // Sort scores in descending order
    highScores = highScores.slice(0, 10); // Keep only top 10 scores
    localStorage.setItem('highScores', JSON.stringify(highScores));
}

function getHighScores() {
    return localStorage.getItem('highScores') ? JSON.parse(localStorage.getItem('highScores')) : [];
}

function displayHighScores() {
    var highScores = getHighScores();
    var highScoresHtml = '<h3>High Scores</h3><ul>';
    highScores.forEach(score => {
        highScoresHtml += `<li>${score.name} - ${score.score}</li>`;
    });
    highScoresHtml += '</ul>';
    document.getElementById('quiz-container').innerHTML += highScoresHtml;
}

function restartQuiz() {
    score = 0; // Reset the score
    questionCount = 0; // Reset the question count
    quizCharacters(); // Start the quiz again
}


function isPlaceholderImage(thumbnail) {
    return thumbnail.path.includes("image_not_available") || thumbnail.path.includes("placeholder");
}

function endQuiz() {
    var quizContainer = document.getElementById('quiz-container');
    var name = prompt("Enter your name for the high score table:", "Your Name Here");
    saveHighScore(name, score);
    quizContainer.innerHTML = `<h2>Quiz ended</h2><p>Your score: ${score}</p>`;
    quizContainer.innerHTML += `<button id="restart-button">Restart Quiz</button>`;
    displayHighScores();

    document.getElementById('restart-button').addEventListener('click', restartQuiz);

}


// Load a random character when the page loads
quizCharacters();




