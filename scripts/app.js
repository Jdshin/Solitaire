// div holders and drop areas
const $drawPile = $(".drawPile");
const $drawPileImg = $(".drawPile img");
const $activePileImg = $(".activePile img");
const $scorePileImgs = $('.scorePile img');
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
        this.parentPileClass = 'drawPile'
        this.pileId = 'dP0';
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
        this.drawPile = {
            'dP0': []
        };
        this.activePile = {
            'aP0': []
        };
        this.scorePile = {
            'sP0': [],
            'sP1': [],
            'sP2': [],
            'sP3': [],
        };
        this.rePile = {
            'rP0': [],
            'rP1': [],
            'rP2': [],
            'rP3': [],
            'rP4': [],
            'rP5': [],
            'rP6': []
        };
        this.cardToPlace = undefined;
    }
    checkOppSuit(cardToPlace, cardToReceive){
        if ((cardToPlace.suit == "H" || cardToPlace.suit == "D") && (cardToReceive.suit == "C" || cardToReceive.suit == "S")){
            return true;
        } else if ((cardToPlace.suit == "S" || cardToPlace.suit == "C") && (cardToReceive.suit == "H" || cardToReceive.suit == "D")){
            return true;
        }
        return false;
    }
    //Uses Fisher-Yates algo
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
        if (cardObj.isFaceUp()){
            return $(`<img class="card" id="${cardObj.rank}${cardObj.suit}" src="${cardObj.getImgSrc()}">`);
        } else {
            return $(`<img class="card" id="${cardObj.rank}${cardObj.suit}" src="${backCardImgPath}">`);
        }
    }
    populateBoard(){
        // populate rearranging piles
        let currIdx = 0;
        for (let rPileNum = 0; rPileNum <  $rePiles.length; rPileNum++){
            for (let k = 0; k <= rPileNum; k++){
                const currCard = this.deck[currIdx];
                if (k == rPileNum){
                    currCard.flipCard();
                }
                currCard.parentPileClass = 'rePile';
                currCard.pileId = `rP${rPileNum}`;
                this.rePile[`rP${rPileNum}`].push(currCard);

                const $cardHtml = this.createCardHtmlElem(currCard);
                $cardHtml.appendTo(`#rP${rPileNum}`);
                currIdx += 1;
            }
        }

        // populate draw pile
        for (let drawPileNum = currIdx; drawPileNum < this.deck.length; drawPileNum ++){
            this.drawPile['dP0'].push(this.deck[drawPileNum]);
        }
        this.setDrawPileFace();
    }
    setDrawPileFace(){
        if (this.drawPile['dP0'].length == 0){
            $drawPileImg.attr('src', `${emptyCardImgPath}`);
        } else {
            $drawPileImg.attr('src', `${backCardImgPath}`);
        }
    }
    drawCard(){
        if (this.drawPile['dP0'].length > 0){
            this.cardToPlace = undefined;
            const drawnCard = this.drawPile['dP0'].shift();
            drawnCard.parentPileClass = 'activePile';
            drawnCard.pileId = 'aP0';

            this.activePile['aP0'].push(drawnCard);
            drawnCard.flipCard();
            
            $activePileImg.attr('src', drawnCard.getImgSrc());
            $activePileImg.attr('id', drawnCard.id);
            $activePileImg.attr('class', 'card');

            if (this.drawPile['dP0'].length == 0){
                this.setDrawPileFace();
            }

        } else {

            this.drawPile['dP0'] = this.activePile['aP0'];
            this.activePile['aP0'] = [];

            this.drawPile['dP0'].forEach(card => {
                card.parentPileClass = 'drawPile';
                card.pileId = 'dP0';
            });
            
            $drawPileImg.attr('src', backCardImgPath);
            $activePileImg.attr('src', emptyCardImgPath);

        }
    }
    checkValidRearrangeMove(cardToPlace, cardToReceive){
        if ((cardToPlace.rank == cardToReceive.rank - 1) && this.checkOppSuit(cardToPlace, cardToReceive)){
            console.log(`valid rearrange move, card to receive parent class: ${cardToReceive.parentPileClass} ${cardToReceive.pileId}`);
            this.moveCard(cardToReceive.parentPileClass, cardToReceive.pileId);
            return true;
        } else {
            console.log("invalid rearrange move");
            this.cardToPlace = undefined;
            console.log(`RESET`);
            return false;
        }
    }
    checkValidScoreMove(cardToPlace, cardToReceive){
        console.log(`Score Move: PlaceCardRank: ${cardToPlace.rank} ReceiveCardRank: ${cardToReceive.rank}`);
        console.log(`Score Move: PlaceCardSuit: ${cardToPlace.suit} ReceiveCardSuit: ${cardToReceive.suit}`);
        if ((cardToPlace.rank == cardToReceive.rank + 1) && (cardToPlace.suit == cardToReceive.suit)){
            this.moveCard(cardToReceive.parentPileClass, cardToReceive.pileId);
            return true;
        } else {
            console.log("invalid scoring move");
            this.cardToPlace = undefined;
            console.log(`RESET`);
            return false;
        }
    }
    moveCard(newParentPileClass, newParentPileId){

        // Remove card obj from old pile
        const fromParentPileClass = this.cardToPlace.parentPileClass;
        const fromParentPileId = this.cardToPlace.pileId;
        const poppedCards = this[fromParentPileClass][fromParentPileId].splice(this.cardToPlace.index);

        poppedCards.forEach(card => {
            this.cardToPlace = card;
            // REMOVE HTML ELEMENT OF OLD CARD
            switch(fromParentPileClass){
                case 'rePile':
                    $(this.cardToPlace.htmlId).remove();
                    const fromRePileLen = this[fromParentPileClass][fromParentPileId].length;

                    // FLIP CARD IF TOPMOST REPILE CARD IS FACEDOWN
                    if (fromRePileLen > 0){
                        this[fromParentPileClass][fromParentPileId][fromRePileLen-1].flipCard();
                    } else {
                        $(`#${fromParentPileId} img`).attr('src', emptyCardImgPath);
                        $(`#${fromParentPileId} img`).attr('id', "");
                    }

                case 'activePile':
                    const activePileLength = this.activePile.aP0.length;
                    // console.log(`SIZE OF OLD REPILE: ${this.activePile.aP0.length}`);

                    if (activePileLength > 0){
                        $activePileImg.attr('src', this.activePile.aP0[activePileLength-1].getImgSrc());
                        $activePileImg.attr('id', this.activePile.aP0[activePileLength-1].id);
                    } else {
                        $activePileImg.attr('src', emptyCardImgPath);
                    }
                    break;
                default:
                    break;
            }

            // UPDATE NEW PILE PROPERTIES
            this.cardToPlace.parentPileClass = `${newParentPileClass}`;
            this.cardToPlace.pileId = newParentPileId;

            // Move card obj to new pile
            this[newParentPileClass][newParentPileId].push(this.cardToPlace);

            // Update HTML at new card location
            switch(newParentPileClass){
                case 'rePile':
                    const newCardHtmlElem = this.createCardHtmlElem(this.cardToPlace);
                    newCardHtmlElem.appendTo($(`#${this.cardToPlace.pileId}`));
                    $(`${this.cardToPlace.htmlId}`).on('click', handleClick);
                    break;
                case 'scorePile':
                    const $clickedScorePileImg = $(`#${newParentPileId} img`);
                    $clickedScorePileImg.attr('src', this.cardToPlace.getImgSrc());
                    $clickedScorePileImg.attr('id', this.cardToPlace.id);
                    break;
                default:
                    console.log("Invalid image update");
                    break;
            }
        });
            
        this.cardToPlace = undefined;
        console.log(`RESET`);
    }
}

function handleClick(){
    const clickedCardElem = $(this);
    const parentElem = clickedCardElem.parent();
    
    const parentPileClass = parentElem[0].className.split(" ")[1];
    const parentPileId = parentElem[0].id;
    const clickedPile = gameController[parentPileClass][parentPileId];

    // SET THE CARD TO PLACE
    if (gameController.cardToPlace == undefined){
        if (this.id != "" && parentPileClass != 'scorePile'){
            const cardToPlace = clickedPile.find(obj => obj.id == this.id);
            cardToPlace.index = clickedPile.indexOf(cardToPlace);

            if (cardToPlace.isFaceUp()){
                gameController.cardToPlace = cardToPlace;
                console.log(`CARD TO PLACE: ${this.id}`);
            }
        }
    } 
    
    // SET THE CARD TO RECEIVE
    else {
        // IF NEW PILE IS EMPTY
        if (this.id == ""){
            switch (parentPileClass){
                case 'rePile': // Only valid move is to place king on empty rearrange pile
                    if (gameController.cardToPlace.rank == 13){
                        gameController.moveCard(parentPileClass, parentPileId);     
                    } 
                    break;
                case 'scorePile': // only valid move is to place ace on empty score pile
                    if (gameController.cardToPlace.rank == 1){
                        gameController.moveCard(parentPileClass, parentPileId);
                    }
                    break;
                default: // no other valid moves
                    this.cardToPlace = undefined;
                    break;
            }
        } 
        
        // IF NEW PILE HAS CARDS
        else if (this.id != gameController.cardToPlace.id && parentPileClass != 'activePile') {
            const cardToReceive = clickedPile.find(obj => obj.id == this.id);

            if (cardToReceive.isFaceUp()){
                switch (parentPileClass){
                    case 'rePile': 
                        gameController.checkValidRearrangeMove(gameController.cardToPlace, cardToReceive); 
                        break;
                    case 'scorePile':
                        const cardToPlaceParentPileLen = gameController[gameController.cardToPlace.parentPileClass][gameController.cardToPlace.pileId].length;
                        if (gameController.cardToPlace.index == cardToPlaceParentPileLen - 1){
                            gameController.checkValidScoreMove(gameController.cardToPlace, cardToReceive);
                        }
                        break;
                    default:
                        this.cardToPlace = undefined;
                        break;
                }
            }
        }
    }
}

const gameController = new GameController();

gameController.createDeck();
gameController.shuffleDeck();
gameController.populateBoard();

const $cards = $('.pile img');

$cards.on('click', handleClick);
$activePileImg.on('click', handleClick);
$drawPile.on('click', function(){gameController.drawCard()});
