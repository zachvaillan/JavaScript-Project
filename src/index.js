import Game from './game';

document.addEventListener("DOMContentLoaded", () => {  

    let game = new Game();
    game.assignEventListeners();
    game.updateInfoDisplay();
    
});
