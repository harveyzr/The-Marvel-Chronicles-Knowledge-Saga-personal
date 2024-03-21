var publicKey = '8d2bc57ce15d6a17eeca97819795c187';
var baseUrl = 'https://gateway.marvel.com/v1/public/';
var score = 0;
var questionCount = 0;

function fetchCharacterImage(character, retryCount) {
    var image = `${character.thumbnail.path}.${character.thumbnail.extension}`;
    var imageDisplay = document.getElementById('imageDisplay');
    imageDisplay.src = '';

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
            var characterDescription = currentCharacter.description;
            fetchCharacterImage(currentCharacter, 0);
            displayQuiz(characterName, characterDescription);
            questionCount++; 
        })
        .catch(error => console.log('Error fetching character:', error));
};

function displayQuiz(characterName, characterDescription) {
    var descriptionDisplay = document.getElementById('descriptionDisplay');
    var choices = document.getElementById('choices');
    var results = document.getElementById('results');

    results.textContent = '';
    choices.innerHTML = '';

    descriptionDisplay.textContent = characterDescription;

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
                } else {
                    results.textContent = 'Incorrect. Try again!';
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

function endQuiz() {
    var quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = `<h2>Quiz ended</h2><p>Your score: ${score}</p>`;
}

    document.getElementById('next-btn').addEventListener('click', quizCharacters);


// Load a random character when the page loads
quizCharacters();



