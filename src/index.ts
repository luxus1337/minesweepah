import GameState from './states/Game';

//for now this is the only state...
new GameState();

//remove the context menu
document.oncontextmenu = function(e) {
    e.preventDefault();
}