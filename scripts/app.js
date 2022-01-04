// div holders and drop areas
const $drawPile = $("#drawPile");
const $drawPileImg = $("#drawPile img");
const $activePileImg = $("#activePile img");
const $scorePiles = $('.scorePile');
const $rePiles = $('.rePile');

const $piles = $(".pile");
const $emptyCards = $("img");

const emptyCardImgPath = 'assets/empty.svg';
const backCardImgPath = 'assets/back.svg';

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
        this.id = `${rank}${suit}`;
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
    getImgSrc(){
        return this._faceUpPath;
    }
}

class GameController{
    constructor(){
        this.deck = [];
        this.drawPile = [];
        this.activePile = [];
        this.scorePiles = {
            0: [],
            1: [],
            2: [],
            3: [],
        };
        this.rePiles = {
            'rP0': [],
            'rP1': [],
            'rP2': [],
            'rP3': [],
            'rP4': [],
            'rP5': [],
            'rP6': []
        };
        this.cardToPlace = undefined;
        this.cardToReceive = undefined;
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
        if ((cardToPlace.rank == cardToReceive.rank - 1) && this.checkOppSuit(cardToPlace, cardToReceive)){
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
        const $card = $(`<img class="card" id="${cardObj.rank}${cardObj.suit}" src="${backCardImgPath}">`);
        return $card;
    }
    populateBoard(){
        // populate rearranging piles
        let currIdx = 0;
        for (let rPileNum = 0; rPileNum <  $rePiles.length; rPileNum++){
            for (let k = 0; k <= rPileNum; k++){
                const currCard = this.deck[currIdx];
                this.rePiles[`rP${rPileNum}`].push(currCard);

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
    setCardToPlace(parentPileClass, parentPileId, cardId){
        let cardToPlace = "";

        if (parentPileId == 'activePile'){
            cardToPlace = this.activePile.find(obj => obj.id == cardId);
        } else {
            cardToPlace = this.rePiles[parentPileId].find(obj => obj.id == cardId);
        }
        // TODO add check for cards on top of chosen card
        if (cardToPlace.isFaceUp()){
            this.cardToPlace = cardToPlace;
            console.log(cardToPlace);
        }
        // console.log(clickedCardObj);
    }
    setCardToReceive(parentPileId, cardId){
        const cardToReceive = this.rePiles[parentPileId].find(obj => obj.id == cardId);
        if (cardToReceive.isFaceUp()){
            this.cardToReceive = cardToReceive;
            if (this.checkValidRearrangeMove(this.cardToPlace, this.cardToReceive)){
                console.log("Valid placement");
            } else {
                console.log("Invalid placement, resetting");
            }
            this.cardToPlace = undefined;
            this.cardToReceive = undefined;
        }
    }
    setDrawPileFace(){
        if (this.drawPile.length == 0){
            $drawPileImg.attr('src', `${emptyCardImgPath}`);
        } else {
            $drawPileImg.attr('src', `${backCardImgPath}`);
        }
    }
    drawCard(){
        if (this.drawPile.length > 0){
            const drawnCard = this.drawPile.shift();
            drawnCard.flipCard();
            this.activePile.push(drawnCard);
            $activePileImg.attr('src', drawnCard.getImgSrc());
            $activePileImg.attr('id', drawnCard.id);
            // add onclick listener here??
            $activePileImg.attr('class', 'card');
            if (this.drawPile.length == 0){
                this.setDrawPileFace();
            }
        } else {
            this.drawPile = this.activePile;
            this.activePile = [];
            $drawPileImg.attr('src', backCardImgPath);
            $activePileImg.attr('src', emptyCardImgPath);
        }
    }
}

const gameController = new GameController();

gameController.createDeck();
gameController.shuffleDeck();
gameController.populateBoard();

const $cards = $('.card');
const $activePile = $('#activePile');

$cards.on('click', function(){
    if (gameController.cardToPlace == undefined){
        const parentPile = $(`#${this.id}`).parent();
        gameController.setCardToPlace(parentPile[0].className, parentPile[0].id, this.id);
        
    } else {
        const parentPile = $(`#${this.id}`).parent();
        gameController.setCardToReceive(parentPile[0].id, this.id);
    }
});

$activePileImg.on('click', function(){
    if (gameController.cardToPlace == undefined){
        const parentPile = $(`#${this.id}`).parent();
        gameController.setCardToPlace(parentPile[0].className, parentPile[0].id, this.id);
    } else {
        const parentPile = $(`#${this.id}`).parent();
        gameController.setCardToReceive(parentPile[0].id, this.id);
    }
});
$scorePiles.on('click', function(){console.log(this)});

$drawPile.on('click', function(){gameController.drawCard()});
