// div holders and drop areas
const $drawPile = $("#drawPile");
const $activePile = $("#activePile");
const $scorePiles = $('.scorePile');
const $rePiles = $('.rePile');

const $piles = $(".pile");
const $emptyCards = $("img");

const ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const suits = ["H", "S", "D", "C"];

// Set empty image as undraggable
$emptyCards.each(function(){this.draggable = false});

function createCardElem(rank, suit){
    const $card = $(`<img class="card" id="${rank}${suit}" src="assets/back.svg">`);
    return $card;
}

function createCards(){
    const deck = [];
    for (let i = 0; i < suits.length; i++){
        for (let j = 0; j < ranks.length; j++){
            deck.push(createCardElem(ranks[j], suits[i]));
        }
    }
    return deck;
}

// takes in a jquery object
function getFaceUpAssetPath(rank, suit){
    return `assets/${rank}${suit}.svg`;
}

function shuffleDeck(deck){
    // Using Fisher-Yates Shuffling Algorithm
    for (let i = deck.length-1; i > 0; i--){
        const rand = Math.floor(Math.random()*i);
        const temp = deck[i];
        deck[i] = deck[rand];
        deck[rand] = temp;
    }
}

function populateBoard(deck){
    for (let i = 0; i < $rePiles.length; i++){
        for (let j = 0; j <= i; j++){
            const $drawnCard = deck.pop();
            $drawnCard.appendTo(`#rP${i+1}`);
        }
    }
}

class Card {
    constructor(rank, suit){
        this.rank = rank;
        this.suit = suit;
        this._faceup = false;
        this._faceUpPath = `assets/${rank}${suit}`;
    }
    isFaceUp(){
        return this._faceup;
    }
    flipCard(){
        this._faceup = true;
        return this._faceUpPath;
    }
}

class GameController{
    constructor(){
        this.drawPile = [];
        this.discPile = [];
        this.scorePiles = [];
        this.rePiles = [];
    }
    checkOppSuit(cardToPlace, cardToReceive){
        if ((cardToPlace.suit == "H" || cardToPlace.suit == "D") && (cardToReceive.suit == "C" || cardToReceive.suit == "S")){
            return true;
        } else if ((cardToPlace.suit == "S" || cardToPlace.suit == "C") && (cardToReceive.suit == "H" || cardToReceive.suit == "D")){
            return true;
        }
        return false;
    }
    checkValidRearrangeMove(cardToPlace, cardToReceive){
        if ((cardToPlace.rank < cardToReceive.rank) && this.checkOppSuit(cardToPlace, cardToReceive)){
            return true;
        } else {
            return false;
        }
    }
    checkValidScoreMove(cardToPlace, cardToReceive){
        if ((cardToPlace.rank > cardToReceive.rank) && (cardToPlace.suit == cardToReceive.suit)){
            return true;
        }
        return false;
    }
}


const deck = createCards();
shuffleDeck(deck);
populateBoard(deck);

// console.log($rePiles[1].childNodes);

// const $cards = $('.card');
// $cards.on('click', function(){
//     console.log($(this));
// });
// console.log(deck);