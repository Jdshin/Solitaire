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


class Card {
    constructor(rank, suit){
        this.rank = rank;
        this.suit = suit;
        this.htmlId = `#${rank}${suit}`;
        this._faceup = false;
        this._faceUpPath = `assets/${rank}${suit}.svg`;
    }
    isFaceUp(){
        return this._faceup;
    }
    flipCard(){
        this._faceup = true;
        const $thisCard = $(`${this.htmlId}`);
        $thisCard.attr('src', this._faceUpPath);
    }
}

class GameController{
    constructor(){
        this.deck = [];
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
    shuffleDeck(){
        for (let i = this.deck.length-1; i > 0; i--){
            const rand = Math.floor(Math.random()*i);
            const temp = this.deck[i];
            this.deck[i] = this.deck[rand];
            this.deck[rand] = temp;
        }
    }
    createDeck(){
        for (let i = 0; i < suits.length; i++){
            for (let j = 0; j < ranks.length; j++){
                this.deck.push(this.createCardHtmlElem(ranks[j], suits[i]));
            }
        }
    }
    createCardHtmlElem(rank, suit){
        const $card = $(`<img class="card" id="${rank}${suit}" src="assets/back.svg">`);
        return $card;
    }
    populateBoard(){
        
    }
}

const gameController = new GameController();

gameController.createDeck();
gameController.shuffleDeck();
console.log(gameController.deck);