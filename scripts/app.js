// div holders and drop areas
const $drawPile = $("#drawPile");
const $activePile = $("#activePile");
const $scorePiles = $('.scorePile');
const $rePiles = $('.rePile');

const $piles = $(".pile");
const $emptyCards = $("img");

const ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const suits = ["H", "S", "D", "C"];

// Global to keep track of game state
let numFaceUp = 0;

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
        if (this._faceup == false){
            this._faceup = true;
            const $thisCard = $(`${this.htmlId}`);
            $thisCard.attr('src', this._faceUpPath);
            numFaceUp += 1;
        }
    }
}

class GameController{
    constructor(){
        this.deck = [];
        this.drawPile = [];
        this.discPile = [];
        this.scorePiles = {
            0: [],
            1: [],
            2: [],
            3: [],
        };
        this.rePiles = {
            0: [],
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
            6: []
        };
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
                this.deck.push(new Card(ranks[j], suits[i]));
            }
        }
    }
    createCardHtmlElem(cardObj){
        const $card = $(`<img class="card" id="${cardObj.rank}${cardObj.suit}" src="assets/back.svg">`);
        return $card;
    }
    populateBoard(){
        let numRePileCards = 0;
        for (let i = $rePiles.length; i > 0; i--){
            numRePileCards += i;
        }
        // populate rearranging piles
        let currIdx = 0;
        for (let rPileNum = 0; rPileNum <  $rePiles.length; rPileNum++){
            for (let k = 0; k <= rPileNum; k++){
                const currCard = this.deck[currIdx];
                const $cardHtml = this.createCardHtmlElem(currCard);
                $cardHtml.appendTo(`#rP${rPileNum}`);
                currIdx += 1;
                if (k == rPileNum){
                    currCard.flipCard();
                }
            }
        }
        // populate draw pile
        for (let drawPileNum = currIdx; drawPileNum < this.deck.length; drawPileNum ++){
            this.drawPile.push(this.deck[drawPileNum]);
        }
        this.setDrawPileFace();
    }
    setDrawPileFace(){
        if (this.drawPile.length == 0){
            $('#drawPile img').attr('src', 'assets/empty.svg');
        } else {
            $('#drawPile img').attr('src', 'assets/back.svg');
        }
    }
}

const gameController = new GameController();

gameController.createDeck();
gameController.shuffleDeck();
gameController.populateBoard();

const $cards = $('.card');
$cards.on('click', function(){console.log(this.id)});
