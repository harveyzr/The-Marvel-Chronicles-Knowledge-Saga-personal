var publicKey = '8d2bc57ce15d6a17eeca97819795c187';
var baseUrl = 'https://gateway.marvel.com/v1/public/';

function fetchCharacterImage(character, retryCount) {
    var image = `${character.thumbnail.path}.${character.thumbnail.extension}`;
    var imageDisplay = document.getElementById('imageDisplay');

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
            imageDisplay.src = './assets/images/placeholder.avif';
        }
    };

    // Set the source of the temporary image to trigger loading
    tempImage.src = image;
}


function quizCharacters() {
    var offset = Math.floor(Math.random() * 1490);
    var url = `${baseUrl}characters?apikey=${publicKey}&offset=${offset}&limit=1`;

    fetch(url)
    .then(response => response.json())
        .then(data => {
            var currentCharacter = data.data.results[0];
            var characterName = currentCharacter.name;
            displayQuiz(characterName);
        })
        .catch(error => console.log('Error fetching character:', error));
};

function displayQuiz(characterName, image) {
    var imageDisplay= document.getElementById('imageDisplay');
    var choices = document.getElementById('choices');
    var results = document.getElementById('results');

    results.textContent = '';
    imageDisplay.src = image;


    var apiUrl = `${baseUrl}characters?apikey=${publicKey}&limit=3`;
    fetch(apiUrl)
    .then(response => response.json())
        .then(data => {
            var othercharacters = data.data.results;
            var options = [];
            othercharacters.forEach(character => {
                options.push(character.name);
            });
            options.push(characterName); // Add correct name to options
            options.sort(() => Math.random() - 0.5);

            choices.innerHTML = '';
            options.forEach(option => {
                var choiceButtons = document.createElement('button');
                choiceButtons.classList.add('choices');
                choiceButtons.textContent = option;
                choiceButtons.onclick = function() {
                if (option === characterName) {
                    results.textContent = 'Correct!';
                } else {
                    results.textContent = 'Incorrect. Try again!';
                }
            };
            choices.appendChild(choiceButtons);
        });
    })
    .catch(error => console.log('Error fetching options:', error));
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('next-btn').addEventListener('click', quizCharacters);


// Load a random character when the page loads
quizCharacters();


});


