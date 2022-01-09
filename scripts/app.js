// div holders and drop areas
const $drawPileImg = $(".drawPile img");
const $activePileImg = $(".activePile img");
const $scorePileImgs = $('.scorePile img');
const $rePiles = $('.rePile');
const $emptyCards = $("img");

const emptyCardImgPath = 'assets/empty.svg';
const backCardImgPath = 'assets/back.svg';

// Button references
const $newGameBut = $(`#newGameBut`);

const ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const suits = ["H", "S", "D", "C"];
const highlightBorderProp = '7px solid yellow';
const transparentBorderProp = '7px solid transparent';
const overlayYPercent = 80;

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
        this._highlighted = false;
    }
    isFaceUp(){
        return this._faceup;
    }
    flipCard(){
        if (this._faceup == false){
            this._faceup = true;
            const $thisCard = $(`${this.htmlId}`);
            $thisCard.attr('src', this._faceUpPath);
        }
    }
    getImgSrc(){
        return this._faceUpPath;
    }
    highlightToggle(){
        if (this._highlighted == false){
            this._highlighted = true;
            $(`${this.htmlId}`).css("border", highlightBorderProp);
        } else {
            this._highlighted = false;
            $(`${this.htmlId}`).css("border", transparentBorderProp);
        }
    }
    setFaceUp(){
        this._faceup = true;
    }
    enableHighlight(bool){
        this._highlighted = bool;
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
        this.clicksEnabled = false;
    }
    checkOppSuit(cardToPlace, cardToReceive){
        if ((cardToPlace.suit == "H" || cardToPlace.suit == "D") && (cardToReceive.suit == "C" || cardToReceive.suit == "S")){
            return true;
        } else if ((cardToPlace.suit == "S" || cardToPlace.suit == "C") && (cardToReceive.suit == "H" || cardToReceive.suit == "D")){
            return true;
        }
        return false;
    }
    shuffleDeck(){
        //Uses Fisher-Yates algo
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
                if (k == 0){
                    const bottomCardElem = $(`#rP${rPileNum} img`);
                    console.log(currCard.id);
                    bottomCardElem.attr('id', currCard.id);
                    bottomCardElem.attr('src', backCardImgPath);
                } else {
                    const $cardHtml = this.createCardHtmlElem(currCard);
                    $cardHtml.css("transform", `translateY(${k*-80}%)`);
                    $cardHtml.appendTo(`#rP${rPileNum}`);
                }

                if (k == rPileNum){
                    currCard.flipCard();
                }

                currCard.parentPileClass = 'rePile';
                currCard.pileId = `rP${rPileNum}`;
                this.rePile[`rP${rPileNum}`].push(currCard);
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
            drawnCard.enableHighlight(false);
            $activePileImg.css('border', transparentBorderProp);

            drawnCard.parentPileClass = 'activePile';
            drawnCard.pileId = 'aP0';

            drawnCard.flipCard();
            this.activePile['aP0'].push(drawnCard);
            
            
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
            this.moveCard(cardToReceive.parentPileClass, cardToReceive.pileId);
            return true;
        } else {
            this.resetCardToPlace();
            return false;
        }
    }
    checkValidScoreMove(cardToPlace, cardToReceive){
        if ((cardToPlace.rank == cardToReceive.rank + 1) && (cardToPlace.suit == cardToReceive.suit)){
            this.moveCard(cardToReceive.parentPileClass, cardToReceive.pileId);
            return true;
        } else {
            this.resetCardToPlace();
            return false;
        }
    }
    resetCardToPlace(){
        this.cardToPlace.highlightToggle();
        this.cardToPlace = undefined;
    }
    moveCard(newParentPileClass, newParentPileId){

        // Remove card obj from old pile
        const fromParentPileClass = this.cardToPlace.parentPileClass;
        const fromParentPileId = this.cardToPlace.pileId;
        const poppedCards = this[fromParentPileClass][fromParentPileId].splice(this.cardToPlace.index);
        const fromPileLen = this[fromParentPileClass][fromParentPileId].length;

        for (let i = 0; i < poppedCards.length; i++){
            this.cardToPlace = poppedCards[i];

            // REMOVE OLD HTML ELEMENT
            switch(fromParentPileClass){
                case 'rePile':
                    if (fromPileLen > 0){
                        $(this.cardToPlace.htmlId).remove();
                        console.log("LINE 233 REMOVE");
                    } else {
                        if (i == poppedCards.length - 1){
                            const newlyEmptyPileImg = $(`#${fromParentPileId} img`);
                            newlyEmptyPileImg.attr('src', emptyCardImgPath);
                            newlyEmptyPileImg.attr('id', "");
                            newlyEmptyPileImg.css('border', transparentBorderProp);
                            newlyEmptyPileImg.css('transform', 'translateY(0%)');
                        } else {
                            $(this.cardToPlace.htmlId).remove();
                            console.log("LINE 243 REMOVE");
                        }
                    }
                    break;
                case 'activePile':
                    const activePileLength = this.activePile.aP0.length;
                    if (activePileLength > 0){
                        $activePileImg.attr('src', this.activePile.aP0[activePileLength-1].getImgSrc());
                        $activePileImg.attr('id', this.activePile.aP0[activePileLength-1].id);
                        $activePileImg.css('border', transparentBorderProp);
                    } else {
                        $activePileImg.attr('src', emptyCardImgPath);
                        $activePileImg.attr('id', "");
                        $activePileImg.css('border', transparentBorderProp);
                    }
                    break;
                default:
                    break;
            }

            // UPDATE CARD TO PLACE PROPERTIES
            if (i == 0){
                this.cardToPlace.highlightToggle();
            }
            this.cardToPlace.parentPileClass = newParentPileClass;
            this.cardToPlace.pileId = newParentPileId;
            this[newParentPileClass][newParentPileId].push(this.cardToPlace);

            // UPDATE NEW HTML ELEMENT
            switch (newParentPileClass){
                case 'scorePile':
                    const $clickedScorePileImg = $(`#${newParentPileId} img`);
                    $clickedScorePileImg.attr('src', this.cardToPlace.getImgSrc());
                    $clickedScorePileImg.attr('id', this.cardToPlace.id);
                    break;
                case 'rePile':
                    let newRePileLen = this[newParentPileClass][newParentPileId].length;
                    if (newRePileLen == 1){
                        const prevEmptyRepileImg = $(`#${newParentPileId} img`);
                        prevEmptyRepileImg.attr('src', this.cardToPlace.getImgSrc());
                        prevEmptyRepileImg.attr('id', this.cardToPlace.id);
                    } else {
                        let $newCardHTMLElem = this.createCardHtmlElem(this.cardToPlace);
                        const newPileLen = this[newParentPileClass][newParentPileId].length;
                        $newCardHTMLElem.on('click', handleClick);
                        $newCardHTMLElem.css('transform', `translateY(${-(newPileLen-1)*overlayYPercent}%)`);
                        $newCardHTMLElem.appendTo($(`#${newParentPileId}`));
                        if (i == poppedCards.length - 1){
                            $newCardHTMLElem.css('border', transparentBorderProp);
                        }
                    }
                default:
                    break;
            }
            this.cardToPlace = undefined;
            this.checkWin();
        }

        // FLIP TOPMOST CARD IF FACEDOWN FROM OLD PILE
        if (fromPileLen > 0 && fromParentPileClass != 'activePile'){
            this[fromParentPileClass][fromParentPileId][fromPileLen-1].flipCard();
        }
    }
    toggleClicks(){
        const $cards = $('.pile img');
        $newGameBut.on('click', startNewGame);
        if (this.clicksEnabled == false){
            this.clicksEnabled = true;
            $cards.on('click', handleClick);
        } else {
            this.clicksEnabled = false;
            $cards.off('click', handleClick);
        }
    }
    checkWin(){
        let numFaceUp = 0;
        for (let i = 0; i < Object.keys(this.scorePile).length; i++){
            numFaceUp += this.scorePile[`sP${i}`].length;
        }
        if (numFaceUp == 52){
            console.log("YOU WIN!!");
        }
    }
}

function handleClick(){
    if (this.id == 'draw'){
        gameController.drawCard();
    } else {
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
                cardToPlace.htmlElem = $(cardToPlace.htmlId);

                if (cardToPlace.isFaceUp()){
                    gameController.cardToPlace = cardToPlace;
                    gameController.cardToPlace.highlightToggle();
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
                        gameController.resetCardToPlace();
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
                            this.resetCardToPlace();
                            break;
                    }
                }
            }
        }
    }
}

function startNewGame(){
    if (gameController != undefined){
        gameController.deck = [];
        gameController.clicksEnabled = false;
        gameController.drawPile.dP0 = [];
        gameController.activePile.aP0 = [];

        // Turn off all event listeners
        $activePileImg.off();
        $drawPileImg.off();
        $scorePileImgs.off();

        // Set empty image as undraggable
        $emptyCards.each(function(){this.draggable = false});

        for (let i = 0; i < Object.keys(gameController.scorePile).length; i++){
            gameController.scorePile[`sP${i}`] = [];
        }

        for (let j = 0; j < Object.keys(gameController.rePile).length; j++){
            gameController.rePile[`rP${j}`] = [];
        }

        gameController.setDrawPileFace();
        $activePileImg.attr('src', emptyCardImgPath);
        $activePileImg.attr('id', "");
        $scorePileImgs.attr('src', emptyCardImgPath);
        $scorePileImgs.attr('id', "");

        const $newEmptyImg = $(`<img src=${emptyCardImgPath}>`);
        const $rePileHtmlElems = $('.rePile');
        
        $rePileHtmlElems.children().remove();
        $newEmptyImg.appendTo($rePileHtmlElems);
        
        gameController.createDeck();
        // gameController.shuffleDeck();
        gameController.populateBoard();
        gameController.toggleClicks();

    } else {
        console.log("Game Controller Not Initialized");
    }
}

const gameController = new GameController();
startNewGame();