import Player from './player';

const TEAMS = [
    "red",
    "green",
    "blue",
    "yellow",
]

class Players {

    constructor(){
        this.array = [];

        for (let i = 0; i < 4; i++){
            this.array.push(new Player(TEAMS[i]));
        }
    }

}

export default Players;