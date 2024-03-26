// Define constants and variables
var publicKey = '319ffe5f11ca79ea417565bba90881bf';
var baseUrl = 'https://gateway.marvel.com/v1/public/';
var score = 0;
var questionCount = 0;

// Function to fetch character image
function fetchCharacterImage(character, retryCount) {
    // Construct image URL
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

function updateProgressBar() {
    var progressBar = document.getElementById("progressBar");
    if (progressBar) {
        progressBar.value += 10;
    }
}

// Function to quiz characters
function quizCharacters() {

    var restartQuizButton = document.getElementById("restartQuiz");
    var clearHighScoresButton = document.getElementById("clearHighScores");

    if (restartQuizButton !== null && restartQuizButton !== undefined) {
        restartQuizButton.classList.add("hiddenElement");
    }

    if (clearHighScoresButton !== null && clearHighScoresButton !== undefined) {
        clearHighScoresButton.classList.add("hiddenElement");
    }
  
    if (questionCount >= 10) {
        endQuiz();
        return; // Exit the function if the quiz has ended
    }

    // Construct URL for fetching a random character
    var offset = Math.floor(Math.random() * 1490);
    var url = `${baseUrl}characters?apikey=${publicKey}&offset=${offset}&limit=1`;

    // Fetch a random character
    fetch(url)
    .then(response => response.json())
        .then(data => {
            var currentCharacter = data.data.results[0];
            var characterName = currentCharacter.name;

            // If the character has a valid image, fetch the image and display the quiz
            if (!isPlaceholderImage(currentCharacter.thumbnail)) {
                fetchCharacterImage(currentCharacter, 0);
                displayQuiz(characterName);
                questionCount++; 
                updateProgressBar();
        }else{
            // If the character doesn't have a valid image, fetch another character
            quizCharacters();
        }
    })
        .catch(error => console.log('Error fetching character:', error));
};

// Function to display the quiz
function displayQuiz(characterName, characterDescription) {
    var choices = document.getElementById('choices');
    var results = document.getElementById('results');

    // Clear previous results and choices
    results.textContent = '';
    choices.innerHTML = '';

    // Construct URL for fetching other characters
    var offset = Math.floor(Math.random() * 1490);
    var apiUrl = `${baseUrl}characters?apikey=${publicKey}&offset=${offset}&limit=3`;

    // Fetch other characters
    fetch(apiUrl)
    .then(response => response.json())
        .then(data => {
            // Get the names of the other characters
            var otherCharacters = data.data.results.map(character => character.name);
            // Combine the names of the other characters with the name of the current character
            var options = otherCharacters.concat(characterName);
            // Shuffle the options and keep only the first 4
            options = shuffleArray(options);
            options = options.slice(0, 4);

            // Create a button for each option
            options.forEach(option => {
                var choiceButtons = document.createElement('button');
                choiceButtons.classList.add('choices');
                choiceButtons.textContent = option;
                choiceButtons.onclick = function() {
                // If the chosen option is correct, increment the score and fetch the next character
                if (option === characterName) {
                    results.textContent = 'Correct!';
                    score++;
                    quizCharacters();
                } else {
                    // If the chosen option is incorrect, decrement the score
                    results.textContent = 'Incorrect. Try again!';
                    score--;
                }
            };
            // Add the button to the choices element
            choices.appendChild(choiceButtons);
        });
    })
    .catch(error => console.log('Error fetching options:', error));
}

// Function to shuffle an array
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to save the high score
function saveHighScore(name, score) {
    // Get the current high scores from local storage
    let highScores = localStorage.getItem('highScores') ? JSON.parse(localStorage.getItem('highScores')) : [];
    // Add the new score to the high scores
    highScores.push({ name, score });
    // Sort the high scores in descending order
    highScores.sort((a, b) => b.score - a.score);
    // Keep only the top 10 scores
    highScores = highScores.slice(0, 10);
    // Save the high scores back to local storage
    localStorage.setItem('highScores', JSON.stringify(highScores));
}

// Function to get the high scores
function getHighScores() {
    return localStorage.getItem('highScores') ? JSON.parse(localStorage.getItem('highScores')) : [];
}

// Function to display the high scores
function displayHighScores() {
    var highScores = getHighScores();
    var highScoresHtml = '<h3>High Scores</h3><ul>';
    highScores.forEach(score => {
        highScoresHtml += `<li>${score.name} : ${score.score}</li>`;
    });
    highScoresHtml += '</ul>';
    document.getElementById('quiz-container').innerHTML += highScoresHtml;
}

// Function to check if an image is a placeholder
function isPlaceholderImage(thumbnail) {
    return thumbnail.path.includes("image_not_available") || thumbnail.path.includes("placeholder");
}

// Function to restart the quiz
function restartQuiz() {
    score = 0; // Reset the score
    questionCount = 0; // Reset the question count

    window.location.reload();
}

// Function to end the quiz
function endQuiz() {
    var quizContainer = document.getElementById('quiz-container');
    // Prompt the user for their name
    var name = prompt("Enter your name for the high score table:", "Your Name Here");
    // Save the high score
    saveHighScore(name, score);
    // Display the final score
    quizContainer.innerHTML = `<h2>Quiz ended</h2><p>Your score: ${score}</p>`;
   
    // Display the high scores
    displayHighScores();

    document.getElementById("restartQuiz").classList.remove("hiddenElement");
    document.getElementById("clearHighScores").classList.remove("hiddenElement");
}

function clearHighScores() {
    localStorage.removeItem('highScores');
    
    var quizContainer = document.getElementById('quiz-container');
    if (quizContainer) {
        quizContainer.innerHTML = ''; // Clear the quiz container's content
    }

}

document.getElementById("restartQuiz").addEventListener("click", restartQuiz);
document.getElementById("clearHighScores").addEventListener("click", clearHighScores);

// Load a random character when the page loads
quizCharacters();
