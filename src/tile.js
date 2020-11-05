class Tile {

    constructor(pos){
        this.pos = pos;
        this.status = false;

        this.owner = null;
        this.units = 0;
        this.color = null;

        this.tileElement = document.createElement('div');
        this.tileElement.classList.add('tile');

        this.unitsElement = document.createElement('div');
        this.unitsElement.classList.add('units')
        this.tileElement.appendChild(this.unitsElement);

        this.moveableTiles = [];

        this.claimable();
    }

    claimTile(team){
        this.tileElement.classList.add(team);
    }

    claimable(){
        if (!this.status) {
            this.tileElement.classList.add('clickable')
        } else {
            this.tileElement.classList.remove('clickable');
        }
    }

    receiveOwner(player){
        this.owner = player;
        this.color = player.team;
    }

    receiveUnits(count = 1){
        this.units += count;
        this.unitsElement.innerHTML = this.units;
    }

    removeUnits(count = 1){
        this.units -= count;
        this.unitsElement.innerHTML = this.units;
    }

    isValidPos(pos){
        if ((pos[0] >= 0 && pos[0] < 4) && (pos[1] >= 0 && pos[1] < 4)){
            return true;
        } else {
            return false;
        }
    }

    grabAdjacentTiles(){
        let possibles = [];
        let validMoves = [];

        let right = ([this.pos[0] + 1, this.pos[1]]);
        let left = ([this.pos[0] - 1, this.pos[1]]);
        let up = ([this.pos[0], this.pos[1] + 1]);
        let down = ([this.pos[0], this.pos[1] - 1]);
        possibles.push(right, left, up, down, this.pos);

        possibles.forEach(possibility => {
            if(this.isValidPos(possibility)){
                validMoves.push(possibility);
            }
        })
        this.moveableTiles = validMoves;
        return this.moveableTiles;
    }

}

export default Tile;