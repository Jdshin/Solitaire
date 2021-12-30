// div holders and drop areas
const $drawPile = $("#drawPile");
const $activePile = $("#activePile");
const $scorePiles = $('.scorePile');
const $rePiles = $('.rePile');

const $piles = $(".pile");
const $cards = $("img");

const ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const suits = ["H", "S", "D", "C"];

// Set empty image as undraggable
$cards.each(function(){this.draggable = false});

function createCardElem(rank, suit){
    const $card = $(`<img class="card" id="${rank}${suit}" src="assets/back.svg">`);
    $card.faceup = false;
    $card.rank = rank;
    $card.suit = suit;
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
function getFaceUpAssetPath($card){
    return `assets/${$card.rank}${$card.suit}.svg`;
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

const deck = createCards();


