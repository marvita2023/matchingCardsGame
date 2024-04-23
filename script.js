document.addEventListener('DOMContentLoaded', function () { // Wait for the DOM content to be fully loaded before executing the script
    const gridContainer = document.querySelector(".game-board"); // Select the game board container element
    const movesDisplay = document.querySelector(".moves"); // Select the element for displaying the number of moves
    const restartButton = document.querySelector(".actions button"); // Select the restart button element
    let firstCard, secondCard; // Declare variables to store the first and second cards flipped
    let lockBoard = false; // Initialize a variable to control whether the board is locked to prevent additional card flips
    let moves = 0; // Variable to keep track of the moves/clicks

    // Update moves display
    movesDisplay.textContent = moves;

    // Array of card objects. Images include the url link
    let cards = [
        { name: "turtle", image: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
        { name: "blueBird", image: "https://images.unsplash.com/photo-1574068468668-a05a11f871da?q=80&w=2250&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
        { name: "eagle", image: "https://images.unsplash.com/photo-1486578077620-8a022ddd481f?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { name: "cat", image: "https://images.unsplash.com/photo-1529778873920-4da4926a72c2?q=80&w=2536&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { name: "bulldog", image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { name: "jiraffe", image: "https://images.unsplash.com/photo-1574870111867-089730e5a72b?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { name: "fox", image: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?q=80&w=2672&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { name: "flamingo", image: "https://images.unsplash.com/photo-1497206365907-f5e630693df0?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }
    ];
    

    const duplicatedCards = [...cards, ...cards]; // Duplicate the array of cards to create a pair for each card

    // Shuffle cards before generating
    shuffleCards();
    generateCards();

    // Event listener for restart button
    restartButton.addEventListener("click", restart);

    // Shuffle the cards array
    function shuffleCards() {
        let currentIndex = duplicatedCards.length;
        let temporaryValue, randomIndex;

        // Loop through the array to shuffle the cards
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex); // Pick a random index
            currentIndex--;

            // Swap the current element with the randomly selected one
            temporaryValue = duplicatedCards[currentIndex];
            duplicatedCards[currentIndex] = duplicatedCards[randomIndex];
            duplicatedCards[randomIndex] = temporaryValue;
        }
    }

    // Function to generate card elements on the game board
    function generateCards() {
        for (let card of duplicatedCards) { // Loop through the duplicated array of cards to create card elements
            const cardElement = document.createElement("div"); // Create a new div element for each card
            cardElement.classList.add("card"); // Add the 'card' class to the card element
            cardElement.setAttribute("data-name", card.name); // Set the 'data-name' attribute to store the card name
            // Set the inner HTML of the card element to include front and back sides
            cardElement.innerHTML = `
                <div class="front">
                    <img class="front-image" src=${card.image} />
                </div>
                <div class="back"></div>
            `;
            gridContainer.appendChild(cardElement); // Append the card element to the grid container
            cardElement.addEventListener("click", flipCard); // Ensures event listener is attached here
        }
    }

    // Flip card when clicked
    function flipCard() {
        // Check if the board is locked or if the clicked card is the same as the first card
        if (lockBoard || this === firstCard) return;

        // Add the 'flipped' class to the clicked card
        this.classList.add("flipped");

        // If no first card is selected, set the clicked card as the first card
        if (!firstCard) {
            firstCard = this;
            return;
        }

        // If a second card is selected, set the clicked card as the second card
        secondCard = this;

        // Increment the moves counter and update the display
        moves++;
        document.querySelector(".moves").textContent = moves;

        // Lock the board to prevent further card flipping
        lockBoard = true;

        // Check for a match after a short delay
        setTimeout(checkForMatch, 500);
    }

   //Check for match cards
    function checkForMatch() {
        let isMatch = firstCard.dataset.name === secondCard.dataset.name;
        isMatch ? disableCards() : unflipCards();  // If it's a match, disable the cards, otherwise, unflip them
    }

    // Function to check if all cards have been matched
    function checkForWin() {
        // Check if the number of matched cards equals twice the number of cards in the deck
        //(cards are doubled when they are duplicated)
        if (document.querySelectorAll('.matched').length  === cards.length * 2) {
            // Display "You won" message
            const winMessage = document.querySelector('.win-message');
            winMessage.style.display = 'block';
        }
    }

    // Disable matched cards
    function disableCards() {
        // Remove the click event listener from the matched cards
        firstCard.removeEventListener("click", flipCard);
        secondCard.removeEventListener("click", flipCard);

        // Add a CSS class to the matched cards to keep them flipped
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');

         // Check for win condition
         checkForWin();

        // Reset the board after a short delay
        setTimeout(resetBoard, 1000); 
    }

    // Unflip unmatched cards
    function unflipCards() {
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            resetBoard();
        }, 1000);
    }

    // Reset the board after each turn
    function resetBoard() {
        // Reset the first and second cards
        firstCard = null;
        secondCard = null;

        // Reset the lockBoard variable
        lockBoard = false;

        // Clear the 'flipped' class from all unmatched cards
        const flippedCards = document.querySelectorAll('.card:not(.matched)');
        flippedCards.forEach(card => card.classList.remove('flipped'));
    }

    // Restart the game
    function restart() {
        // Reset the board and shuffle the cards
        resetBoard();
        shuffleCards();
        // Reset moves counter to 0 and update display
        moves = 0;
        document.querySelector(".moves").textContent = moves;
        // Clear the grid container and generate new cards
        gridContainer.innerHTML = "";
        generateCards();
        // Hide the "You won" message
        const winMessage = document.querySelector('.win-message');
        winMessage.style.display = 'none';

    }

    //const restartButton = document.querySelector("button");
    restartButton.addEventListener("click", restart);
});