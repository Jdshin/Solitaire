// div holders and drop areas
const $drawPile = $("#drawPile");
const $activePile = $("#activePile");
const $scorePiles = $('.scorePile');
const $rePiles = $('.rePile');

const $piles = $(".pile");
const $cards = $("img");

const ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
const suits = ["H", "S", "D", "C"];

// Set empty image as undraggable
$cards.each(function(){this.draggable = false});

function createCardElem(rank, suit){
    const $card = $(`<img class="card" id="${rank}${suit}" src="assets/back.svg">`);
    $card.faceup = false;
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

const deck = createCards();
console.log(deck[0].faceup);
deck[0].appendTo($drawPile);


