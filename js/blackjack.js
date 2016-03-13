// Lets Play Blackjack!
// All cards, arranged by suit
var deckMaster = [['♥','A','2','3','4','5','6','7','8','9','10','J','Q','K'],
				  ['♦','A','2','3','4','5','6','7','8','9','10','J','Q','K'],
				  ['♣','A','2','3','4','5','6','7','8','9','10','J','Q','K'],
				  ['♠','A','2','3','4','5','6','7','8','9','10','J','Q','K']];
var activeDeck = [];
var playerHand = [];
var dealerHand = [];
var playerValue = 0;
var dealerValue = 0;
var gameOver = false;


// Initialize a 'fresh' deck
function deckReset() {
	activeDeck = [];
	for (var i = 0; i < deckMaster.length; i++) {
		activeDeck[i] = deckMaster[i].concat();
	}
};


// Get a random card from the active deck
function getCard() {
	var suit = Math.floor(Math.random() *  activeDeck.length);
	var card = Math.floor((Math.random() * (activeDeck[suit].length - 1)) + 1);
	var card_s = activeDeck[suit][card] + ' ' + activeDeck[suit][0];

	// If we get a card that has already been played, shuffle that suit back into the deck, and try again
	if (activeDeck[suit][card] === undefined) {
		activeDeck[suit] = [].concat(deckMaster[suit]);
		card = Math.floor((Math.random() * (activeDeck[suit].length - 1)) + 1);
		card_s = activeDeck[suit][card] + ' ' + activeDeck[suit][0];
	} else {
		activeDeck[suit].splice(card, 1);
	}
	return card_s;
};


// Assign initial cards to the dealer and player
function dealHands() {

	// Reset these elements first
	document.getElementById('player-hand').innerHTML = '';
	document.getElementById('player-score').innerHTML = '';
	document.getElementById('dealer-hand').innerHTML = '';
	document.getElementById('dealer-score').innerHTML = '';
	document.getElementById('results').innerHTML = '';
	document.querySelector('.controls:nth-of-type(1)').disabled = false;
	document.querySelector('.controls:nth-of-type(2)').disabled = false;
	document.querySelector('.controls:nth-of-type(3)').disabled = true;

	// Get player cards, evaluate, then display
	playerHand = [getCard(), getCard()];
	playerValue = evalHand(playerHand);
	updatePlayer();

	// The second dealer card is hidden until after the player's turn
	dealerHand = [getCard(), getCard()];
	dealerValue = (function() {
		var number = dealerHand[0].split(' ')[0];
		if (number == 'A') {
			return 11;
		} else if ((number == 'J' || number == 'Q' || number == 'K' )) {
			return 10;
		} else {
			return number;
		}
	})();
	var d_value = dealerHand[0].split(' ')[0];
	var d_suit  = dealerHand[0].split(' ')[1];
	document.getElementById('dealer-hand').innerHTML = ("<img class='card' src='img/" + d_value + "-" + d_suit + ".png' />");
	document.getElementById('dealer-hand').innerHTML += ("<img class='card' src='img/b2fv.png' />");
	document.getElementById('dealer-score').innerHTML = dealerValue;
};

// Convert's a hand of card values to an integer
function evalHand(hand) {
	var handValue = 0;
	var aceFound = 0;

	for (var i = 0; i < hand.length; i++) {
		cardValue = hand[i].split(' ')[0];
		
		if (cardValue == 'A' ) {
			aceFound++;
			cardValue = 11;
		} 
		else if (cardValue == 'J' || cardValue == 'Q' || cardValue == 'K' ) {
			cardValue = 10;
		} 
		else {
			cardValue = parseInt(cardValue);
		}
		handValue += cardValue;

		// If we bust but have an ace, reduce to smaller-ace
		for (var a = 0; a < aceFound; a++) {
			if (handValue > 21) {
				aceFound--;
				handValue -= 10;
			}
		}
	}
	return handValue;
};

// If the player busted, the dealer automatically wins
function dealerLoop() {
	dealerHand[1] = getCard();
	dealerValue = evalHand(dealerHand);
	updateDealer();
	if (playerValue <= 21) { 
		while (dealerValue <= 17) {
			dealerHand.push(getCard());
			dealerValue = evalHand(dealerHand);
			updateDealer();
		}
	}
	resolveWin();
};

// After the dealer's turn, determine who wins
function resolveWin() {	
	var results = '';
	if (playerValue > 21) {
		results = 'Player busts with ' + playerValue + ', Dealer wins.';
	} else if (dealerValue > 21) {
		results = 'Dealer busts with ' + dealerValue + ', Player wins.';
	} else if (dealerValue >= playerValue) {
		results = 'Dealer wins with ' + dealerValue;
	} else {
		results = 'Player wins with ' + playerValue;
	}

	gameOver = true;
	document.getElementById('results').innerHTML = results;
	document.querySelector('.controls:nth-of-type(1)').disabled = true;
	document.querySelector('.controls:nth-of-type(2)').disabled = true;
	document.querySelector('.controls:nth-of-type(3)').disabled = false;
};

// Update the DOM with player data
function updatePlayer() {
	document.getElementById('player-hand').innerHTML = '';
	for (var i = 0; i < playerHand.length; i++) {
		var value = playerHand[i].split(' ')[0];
		var suit  = playerHand[i].split(' ')[1];
		document.getElementById('player-hand').innerHTML += ("<img class='card' src='img/" + value + "-" + suit + ".png' />");
	}
	document.getElementById('player-score').innerHTML = playerValue;
};

// Update the DOM with dealer data
function updateDealer() {
	document.getElementById('dealer-hand').innerHTML = '';
	for (var i = 0; i < dealerHand.length; i++) {
		var value = dealerHand[i].split(' ')[0];
		var suit  = dealerHand[i].split(' ')[1];
		document.getElementById('dealer-hand').innerHTML += ("<img class='card' src='img/" + value + "-" + suit + ".png' />");
	}
	document.getElementById('dealer-score').innerHTML = dealerValue;
};

// Force 'shingled' cards to overlap
function alignDeck() {
	var sideCards = document.querySelectorAll('#deck img');
	for (var i = 0; i < sideCards.length; i++) {
		sideCards[i].style.left = '' + (i * -6) + 'px';
		console.log(sideCards[i].style.left);
	}
};

$(document).ready(function() {
	alignDeck()
	deckReset();
	dealHands();
	// Hit me!
	$('.controls:nth-of-type(1)').click(function() {
		if (!gameOver) {
			playerHand.push(getCard());
			playerValue = evalHand(playerHand);
			updatePlayer();

			if (playerValue > 21) { 
				dealerLoop();
			}
		}
	});

	// I'll stay
	$('.controls:nth-of-type(2)').click(function() {
		if (!gameOver) {
			dealerLoop();
		}
	});

	// Play it again
	$('.controls:nth-of-type(3)').click(function() {
		gameOver = false;
		dealHands();
	});
});


