import Map from './map';
import Players from './players';

class Game {

    constructor(map = new Map(), players = new Players()){
        this.mapGrid = map;
        this.gameWindowElement = document.getElementById('game-window');

        this.players = players;
        this.turn = 0;
        this.currentPlayer = this.players.array[this.turn]; 
        this.currentAttackable = null;

        this.claimTerritoryPhase = true; // for beginning of game, once off does not come back
        this.initialPlacementPhase = false; // for beginning of game, once turned on then off does not come back
        this.armyPlacementPhase = false;
        this.battlePhase = false;
        this.territorySelected = false;
        this.fortifyPhase = false;

        this.createMap();
    }

    createMap(){
        this.gameWindowElement.appendChild(this.mapGrid.mapElement);
    }

    // Add event listener to every div

    assignEventListeners(){
        Object.keys(this.mapGrid.hashOfTiles).forEach(pointer => {
            let tile = this.mapGrid.hashOfTiles[pointer];
            tile.tileElement.addEventListener("click", () => this.clickableAction(tile))
        })
    }

    // Evaluate the current state to see what a click on the div is responsible for doing

    clickableAction(tile){
        if(this.claimTerritoryPhase === true){
            this.handleClaimTerritory(tile);
        } else if(this.initialPlacementPhase === true){
            this.placeTroopsOnClick(tile);
        } else if(this.battlePhase === true){
            if (tile.owner === this.currentPlayer && this.territorySelected === false){
                this.getAttackableTerritories(tile);
                console.log(this.currentAttackable)
            } else if(this.territorySelected === true && this.currentAttackable.includes(tile)){
                console.log("second click!")
            } 
        } 
    }

    makeOwnedTerritoriesClickable(){
        this.currentPlayer.territories.forEach(territory => {
            territory.tileElement.classList.add("clickable");
        })
    }

    // claim a territory in claim territory phase, then check to see if all 
    // territories are claimed


    handleClaimTerritory(tile){
        if (!tile.status){
            tile.claimTile(this.currentPlayer.team);
            tile.receiveOwner(this.currentPlayer);


            this.currentPlayer.addTerritory(tile);

            tile.status = true;
            tile.claimable();
            
            this.allTerritoriesClaimed();
            
            this.nextPlayer();
        }   
    }

    // check to see if claim territory phase is over, then update the current phase
    // Also set

    allTerritoriesClaimed(){
        let claimedCount = 0;
        Object.keys(this.mapGrid.hashOfTiles).forEach( pointer => {
            let tile = this.mapGrid.hashOfTiles[pointer];
            if (tile.status === true){
                claimedCount += 1;
            }
        })
        if (claimedCount === this.mapGrid.size){
            this.claimTerritoryPhase = false; // this will NOT be REACTIVATED
            this.initialPlacementPhase = true; 
            this.addEndTurnButton();
        } 
    }

    placeTroopsOnClick(tile){
        if (this.currentPlayer === tile.owner && this.currentPlayer.availabeUnits > 0){
            this.currentPlayer.placeUnit();
            tile.receiveUnits();
        }
    }

    initialPlacementOverCheck(){
        let countCheck = 0;
        this.players.array.forEach(player => {
            if (player.availabeUnits === 0){
                countCheck += 1;
            }
        })
        console.log(countCheck)
        if (countCheck === this.players.array.length){
            this.initialPlacementPhase = false; // this will NOT be REACTIVATED
            this.battlePhase = true;
            this.addEndAttackButton();
        }
    }

    getAttackableTerritories(tile){
        this.currentAttackable = this.mapGrid.getAdjacentEnemies(tile, this.currentPlayer);
        tile.tileElement.classList.add("selected");
        this.territorySelected = true;
    }

    // switch player, and reset this.currentPlayer 

    nextPlayer(){
        if (this.turn === 3){
            this.turn = 0;
        }
        else {
            this.turn += 1;
        }

        if(this.initialPlacementPhase === true){
            this.initialPlacementOverCheck();
        }

        this.currentPlayer = this.players.array[this.turn];
        console.log(this.currentPlayer.team);
    }

    endAttack(){
        this.battlePhase = false;
        this.fortifyPhase = true;
    }

    addEndTurnButton(){
        let endTurnButton = document.createElement("button");
        endTurnButton.innerHTML = "End Turn";
        endTurnButton.onclick = () => this.nextPlayer();
        endTurnButton.classList.add("end-turn-btn");
        this.gameWindowElement.appendChild(endTurnButton);
    }

    addEndAttackButton(){
        let endTurnButton = document.createElement("button");
        endTurnButton.innerHTML = "End Attack";
        endTurnButton.onclick = () => this.endAttack();
        endTurnButton.classList.add("end-attack-btn");
        this.gameWindowElement.appendChild(endTurnButton);
    }

  
}

export default Game;