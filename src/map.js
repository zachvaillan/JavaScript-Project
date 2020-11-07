import Tile from './tile.js';

class Map {
    
    constructor(){
        this.mapElement = document.createElement('div');
        this.mapElement.classList.add('map');
        this.hashOfTiles = {};
        this.keyMaker = 0;
        for (let row = 0; row < 4; row++){
            let rowElement = document.createElement("div");
            rowElement.classList.add("row");

            for (let col = 0; col < 8; col++){
                let pos = [row, col];
                let newTile = new Tile(pos);
                this.hashOfTiles[this.keyMaker] = newTile;
                this.keyMaker += 1;

                let tileContainer = document.createElement("div");
                tileContainer.classList.add("tile-container");
                tileContainer.appendChild(newTile.tileElement);
                rowElement.appendChild(tileContainer);

                this.createBonuses(newTile, tileContainer);
                this.turnToDeadSpace(newTile, pos);
            }
            this.mapElement.appendChild(rowElement);
        }

        this.size = Object.keys(this.hashOfTiles).length;
        
        // this.createDeadSpaces();
        // this.destroyUnreachableTiles();
    }

    getAdjacentEnemies(tile, currentPlayer){
        let adjacent = tile.grabAdjacentTiles();
        let enemies = [];

        Object.keys(this.hashOfTiles).forEach(pointer => {
            let compareTile = this.hashOfTiles[pointer];
            if(compareTile.color !== currentPlayer.team) {
                adjacent.forEach(adj => {
                    if(adj[0] === compareTile.pos[0] && adj[1] === compareTile.pos[1]){
                        enemies.push(compareTile);
                    }
                })
            }
        })
        return enemies;
    }

    getAdjacentFriendly(tile, currentPlayer){
        let adjacent = tile.grabAdjacentTiles();
        let friendlies = [];

        Object.keys(this.hashOfTiles).forEach(pointer => {
            let compareTile = this.hashOfTiles[pointer];
            if(compareTile.color === currentPlayer.team) {
                adjacent.forEach(adj => {
                    if(adj[0] === compareTile.pos[0] && adj[1] === compareTile.pos[1]){
                        friendlies.push(compareTile);
                    }
                })
            }
        })
        return friendlies;
    }

    turnToDeadSpace(tile, pos){
        if(pos[0] === 3 && pos[1] === 1){
            tile.tileElement.id = "dead-space";
            tile.deadSpace = true;
            tile.tileElement.classList.remove("clickable");
        } else if(pos[0] === 1 && pos[1] === 3){
            tile.tileElement.id = "dead-space";
            tile.deadSpace = true;
            tile.tileElement.classList.remove("clickable");
        } else if(pos[0] === 2 && pos[1] === 5){
            tile.tileElement.id = "dead-space";
            tile.deadSpace = true;
            tile.tileElement.classList.remove("clickable");
        } else if(pos[0] === 2 && pos[1] === 6){
            tile.tileElement.id = "dead-space";
            tile.deadSpace = true;
            tile.tileElement.classList.remove("clickable");
        } else if(pos[0] === 3 && pos[1] === 3){
            tile.tileElement.id = "dead-space";
            tile.deadSpace = true;
            tile.tileElement.classList.remove("clickable");
        } else if(pos[0] === 0 && pos[1] === 5){
            tile.tileElement.id = "dead-space";
            tile.deadSpace = true;
            tile.tileElement.classList.remove("clickable");
        }
    }

    getAdjacentTileInstances(tile){
        let adjacentPos = tile.grabAdjacentTiles();
        let adjacentInstances = [];
        Object.keys(this.hashOfTiles).forEach(pointer => {
            let hashTile = this.hashOfTiles[pointer];
            adjacentPos.forEach(adj => {
                if (hashTile.pos === adj){
                    adjacentInstances.push(hashTile);
                }
            })
        })
        return adjacentInstances;
    }

    createBonuses(tile, tileContainer){
        if ( (tile.pos[0] === 0 && tile.pos[1] === 0) || (tile.pos[0] === 0 && tile.pos[1] === 1) 
                || (tile.pos[0] === 0 && tile.pos[1] === 2) || (tile.pos[0] === 1 && tile.pos[1] === 0) 
                || (tile.pos[0] === 1 && tile.pos[1] === 1) || (tile.pos[0] === 1 && tile.pos[1] === 2)
                || (tile.pos[0] === 2 && tile.pos[1] === 0) || (tile.pos[0] === 2 && tile.pos[1] === 1) 
                || (tile.pos[0] === 2 && tile.pos[1] === 2) ){
            tile.battleGrounds = true;
            tileContainer.classList.add("battle-grounds");
        } else if ( (tile.pos[0] === 1 && tile.pos[1] === 4) 
                    || (tile.pos[0] === 2 && tile.pos[1] === 4) ){
            tile.bridge = true;
            tileContainer.classList.add("bridge");
        } else if ( (tile.pos[0] === 3 && tile.pos[1] === 4)
                    || (tile.pos[0] === 3 && tile.pos[1] === 5)
                    || (tile.pos[0] === 3 && tile.pos[1] === 6)
                    || (tile.pos[0] === 3 && tile.pos[1] === 7)){
            tile.theBelt = true;
            tileContainer.classList.add("the-belt");
        } else if ( (tile.pos[0] === 0 && tile.pos[1] === 6)
                    || (tile.pos[0] === 0 && tile.pos[1] === 7)
                    || (tile.pos[0] === 1 && tile.pos[1] === 6)
                    || (tile.pos[0] === 1 && tile.pos[1] === 7)){
            tile.hideAway = true;
            tileContainer.classList.add("hide-away");
        }
    }

}

export default Map;