import Tile from './tile.js';

class Map {
    
    constructor(){
        this.mapElement = document.createElement('div');
        this.mapElement.classList.add('map');
        this.hashOfTiles = {};
        this.keyMaker = 0;

        for (let row = 0; row < 2; row++){
            for (let col = 0; col < 2; col++){
                let pos = [row, col];
                let newTile = new Tile(pos);
                this.hashOfTiles[this.keyMaker] = newTile;
                this.keyMaker += 1;
                this.mapElement.appendChild(newTile.tileElement);
            }
        }

        console.log(this.hashOfTiles);
        this.size = Object.keys(this.hashOfTiles).length;
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

    

}

export default Map;