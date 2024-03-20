var publicKey = '8d2bc57ce15d6a17eeca97819795c187';
var baseUrl = 'https://gateway.marvel.com/v1/public/';


function quizCharacters() {
    var offset = Math.floor(Math.random() * 1490);
    var url = `${baseUrl}characters?apikey=${publicKey}&offset=${offset}&limit=1`;

    fetch(url)
    .then(response => response.json())
        .then(data => {
            var currentCharacter = data.data.results[0];
            var characterName = currentCharacter.name;
            var image = `${currentCharacter.thumbnail.path}.${currentCharacter.thumbnail.extension}`;
            displayQuiz(characterName, image);
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


