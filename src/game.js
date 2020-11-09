import Map from './map';
import Players from './players';

class Game {

    constructor(map = new Map(), players = new Players()){
        this.mapGrid = map;

        this.gameWindowElement = document.getElementById('game-window');
        this.phaseElement = document.getElementsByClassName('claim')[0];
        this.sidebar = document.createElement("div");
        this.turnImage = document.createElement("img");
        this.turnImageContainer = document.createElement("div");
        this.turn1 = document.createElement('div');
        this.turn2 = document.createElement('div');
        this.turn3 = document.createElement('div');
        this.turn4 = document.createElement('div');
        this.btnContainer = document.createElement("div");
        this.btnContainer.classList.add("end-turn-btn-container");
        this.button = null;

        this.players = players;
        this.turn = 0;
        this.currentPlayer = this.players.array[this.turn]; 
        this.currentAttackable = [];
        this.territorySelectedInstance = null;
        this.turnOrderArray = this.players;

        this.turnPlaceable = 3;

        this.currentMoveable = [];

        this.claimTerritoryPhase = true; // for beginning of game, once off does not come back
        this.initialPlacementPhase = false; // for beginning of game, once turned on then off does not come back
        this.placementPhase = false;
        this.battlePhase = false;
        this.territorySelected = false;
        this.fortifyPhase = false;
        this.turnPlaceableEvaluated = false;

        this.battleWonFortificationPhase = false;
        this.battleWonTerritoryInstance = null;

        this.buildLayout();
    }

    assignEventListeners(){
        Object.keys(this.mapGrid.hashOfTiles).forEach(pointer => {
            let tile = this.mapGrid.hashOfTiles[pointer];
            if (!tile.deadSpace){
                tile.tileElement.addEventListener("click", () => this.clickableAction(tile))
            }
        })
    }

    // Evaluate the current state to see what a click on the div is responsible for doing

    clickableAction(tile){
        if(this.claimTerritoryPhase === true){
            this.handleClaimTerritoryPhase(tile);
        } else if(this.initialPlacementPhase === true){
            this.handleInitialPlacementPhase(tile);
        } else if(this.placementPhase === true){
            // console.log("in placement phase")
            this.handlePlacementPhase(tile);
        } else if(this.battlePhase === true){
            // console.log("in battle phase")
           this.handleBattlePhase(tile);
        } else if (this.fortifyPhase === true){
            this.handleFortifyPhase(tile);
        }
        this.updateInfoDisplay();
    }

    handleClaimTerritoryPhase(tile){
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

    handleInitialPlacementPhase(tile){
        if (this.turnPlaceable > 0){
            this.placeTroopsOnClick(tile);
            if (this.turnPlaceable < 1){
                this.turnPlaceable = 3;
                this.nextPlayer();
            }
        } 
    }

    handlePlacementPhase(tile){
        // if (this.turnPlaceableEvaluated === false){
        //     this.turnPlaceable = this.currentPlayer.bonusUnits();
        //     this.turnPlaceableEvaluated = true;
        // } 
        this.placeTroopsOnClick(tile);
        this.updateInfoDisplay();
    }   

    handleBattlePhase(tile){
        if (tile.owner === this.currentPlayer && this.territorySelected === false && tile.units > 0){
            this.getAttackableTerritories(tile);
        } else if(this.territorySelected === true && this.currentAttackable.includes(tile) && this.battleWonFortificationPhase === false){
            this.handleAttackClick(tile);
        } else if(this.territorySelected === true && this.territorySelectedInstance === tile && this.battleWonFortificationPhase === false){
            tile.tileElement.classList.remove("selected");
            this.territorySelected = false;
            this.territorySelectedInstance = null;
        } else if (this.battleWonFortificationPhase === true && tile === this.battleWonTerritoryInstance){
            this.handleBattleFortification(tile);
        }
    }

    handleFortifyPhase(tile){
        if (tile.owner === this.currentPlayer && this.territorySelected === false && tile.units > 0){
            this.getMoveableTiles(tile);
        } else if (this.territorySelected === true && this.currentMoveable.includes(tile) && this.territorySelectedInstance !== tile){
            this.handleMoveClick(tile);
        } else if(this.territorySelected === true && this.territorySelectedInstance === tile){
            tile.tileElement.classList.remove("selected");
            this.territorySelected = false;
            this.territorySelectedInstance = null;
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
    
        if (claimedCount === this.mapGrid.size - 6){
            this.claimTerritoryPhase = false; // this will NOT be REACTIVATED
            this.initialPlacementPhase = true; 
        } 
    }

    placeTroopsOnClick(tile){
        if (this.currentPlayer === tile.owner && this.turnPlaceable > 0){
            this.currentPlayer.placeUnit();
            tile.receiveUnits();
            this.turnPlaceable -= 1;
            if (this.turnPlaceable < 1 && this.placementPhase === true){
                this.turnPlaceableEvaluated = false;
                this.placementPhase = false;
                this.battlePhase = true;
                this.button.innerHTML = "End Attack Phase";
            }
        } 
    }

    initialPlacementOverCheck(){
        let countCheck = 0;
        this.players.array.forEach(player => {
            if (player.availabeUnits === 0){
                countCheck += 1;
            }
        })
        if (countCheck === this.players.array.length){
            this.initialPlacementPhase = false; // this will NOT be REACTIVATED
            this.placementPhase = true;
            // this.addEndAttackButton();
        }
    }

    getAttackableTerritories(tile){
        this.currentAttackable = this.mapGrid.getAdjacentEnemies(tile, this.currentPlayer);
        tile.tileElement.classList.add("selected");
        this.territorySelected = true;
        this.territorySelectedInstance = tile;
    }

    handleAttackClick(tile){
        if (tile.owner !== this.currentPlayer && this.territorySelectedInstance.units > 0) {
            let attackRoll = Math.floor(Math.random() * 6) + 1;
            let defenseRoll = Math.floor(Math.random() * 6) + 1;
            if (attackRoll > defenseRoll){
                if(!tile.units){
                    tile.claimTile(this.currentPlayer.team);
                    tile.loseTile(tile.owner.team);
                    this.currentPlayer.addTerritory(tile);
                    tile.owner.loseTerritory(tile);
                    tile.receiveOwner(this.currentPlayer);

                    this.territorySelectedInstance.removeUnits();
                    tile.receiveUnits();

                    this.battleWonFortificationPhase = true;
                    this.battleWonTerritoryInstance = tile;
                    tile.tileElement.classList.add("selected");
                    this.button.innerHTML = "End Battle Movement"
                } else{
                    tile.removeUnits();
                    tile.owner.allUnits -= 1;
                }
            } else {
                this.territorySelectedInstance.removeUnits();
                this.currentPlayer.allUnits -= 1;
                if(this.territorySelectedInstance.units === null){
                    this.territorySelectedInstance.tileElement.classList.remove("selected");
                    this.territorySelectedInstance = null;
                    this.territorySelected = false;
                }
            }  
        }
    }

    getMoveableTiles(tile){
        this.currentMoveable = this.mapGrid.getAdjacentFriendly(tile, this.currentPlayer);
        tile.tileElement.classList.add("selected");
        this.territorySelected = true;
        this.territorySelectedInstance = tile;
    }

    handleMoveClick(tile){
        if (this.territorySelectedInstance.units > 0){
            this.territorySelectedInstance.removeUnits();
            tile.receiveUnits();
            if (this.territorySelectedInstance.units === null){
                this.territorySelectedInstance.tileElement.classList.remove("selected");
                tile.tileElement.classList.remove("selected");
                this.territorySelectedInstance = null;
                this.territorySelected = false;

                this.battleWonFortificationPhase = false;
                this.battleWonTerritoryInstance = null;

                if(this.battlePhase === true){
                    this.button.innerHTML = "End Attack Phase";
                }
            }
        } 
    }

    handleBattleFortification(tile){
        if (tile === this.battleWonTerritoryInstance){
            this.handleMoveClick(tile);
        }
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
        this.renderPlayerImg();
        this.updateTurnOrder();

        if (this.territorySelectedInstance){
            this.territorySelectedInstance.tileElement.classList.remove("selected");
            this.territorySelectedInstance = null;
            this.territorySelected = false;
        }
        if (this.initialPlacementPhase === false && this.claimTerritoryPhase === false && !this.button){
            this.addEndTurnButton();
            this.button.innerHTML = "Place Units";
        }
        if (this.placementPhase === true){
            this.turnPlaceable = this.currentPlayer.bonusUnits();
            this.turnPlaceableEvaluated = true;
        }

        this.updateInfoDisplay();
    }

    endAttack(){
        this.territorySelectedInstance.tileElement.classList.remove("selected");
        this.territorySelectedInstance = null;
        this.territorySelected = false;
        this.battlePhase = false;
        this.fortifyPhase = true;
    }

    updateInfoDisplay(){
        if (!this.claimTerritoryPhase){
            let i = this.turn;
            this.turn2.innerHTML = "2: " + this.players.array[(i + 1) % 4].team.charAt(0).toUpperCase() + this.players.array[(i + 1) % 4].team.slice(1)
                + " | Units: " + this.players.array[(i + 1) % 4].allUnits;
            this.turn3.innerHTML = "3: " + this.players.array[(i + 2) % 4].team.charAt(0).toUpperCase() + this.players.array[(i + 2) % 4].team.slice(1)
                + " | Units: " + this.players.array[(i + 2) % 4].allUnits;
            this.turn4.innerHTML = "4: " + this.players.array[(i + 3) % 4].team.charAt(0).toUpperCase() + this.players.array[(i + 3) % 4].team.slice(1)
                + " | Units: " + this.players.array[(i + 3) % 4].allUnits;
        }

        if (this.initialPlacementPhase === true){
            this.turn1.innerHTML = "Available: " + this.turnPlaceable
            this.phaseElement.id = "";
            this.phaseElement = document.getElementsByClassName("initial-place")[0];
            this.phaseElement.id = "rid-opacity";
        } else if (this.placementPhase === true){
            this.turn1.innerHTML = "Available: " + this.turnPlaceable
            this.phaseElement.id = "";
            this.phaseElement = document.getElementsByClassName("placement")[0];
            this.phaseElement.id = "rid-opacity";;
        } else if (this.battlePhase === true && this.battleWonFortificationPhase === false){
            this.turn1.innerHTML = "Units: " + this.currentPlayer.allUnits;
            this.phaseElement.id = "";
            this.phaseElement = document.getElementsByClassName("battle")[0];
            this.phaseElement.id = "rid-opacity";;
            // console.log("battle phase display")
        } else if (this.battlePhase === true && this.battleWonFortificationPhase === true){
            this.turn1.innerHTML = "Units: " + this.currentPlayer.allUnits;
            this.phaseElement.id = "";
            this.phaseElement = document.getElementsByClassName("battle-move")[0];
            this.phaseElement.id = "rid-opacity";;
            // console.log("battle move phase display")
        } else if (this.fortifyPhase === true){
            this.turn1.innerHTML = "Units: " + this.currentPlayer.allUnits;
            this.phaseElement.id = "";
            this.phaseElement = document.getElementsByClassName("fortify")[0];
            this.phaseElement.id = "rid-opacity";;
            // console.log("fortify phase display")
        }
    }


    // !!! LAYOUT !!!
    // !!! LAYOUT !!!
    // !!! LAYOUT !!!
    // !!! LAYOUT !!!

    buildLayout(){
        this.phaseElement.id = "rid-opacity";

        this.sidebar.classList.add("sidebar");
        
        this.turnImage.classList.add("player-img")
        
        this.turnImageContainer.classList.add("player-img-container");
        this.turnImageContainer.appendChild(this.turnImage);

        this.sidebar.append(this.turnImageContainer);

        this.renderPlayerImg();

        this.createTurnOrder();
        this.updateTurnOrder();

        this.createMap();
        this.sidebar.appendChild(this.btnContainer);
        this.gameWindowElement.append(this.sidebar);
        
    }

    createMap(){
        this.gameWindowElement.appendChild(this.addMapInfoContainer());
        // let battleGrounds = document.getElementsByClassName("battle-grounds");
        // Array.from(battleGrounds).forEach(el => el.style.backgroundColor = "pink");
    }

    addMapInfoContainer(){
        let mapAndInfoContainer = document.createElement("div");
        mapAndInfoContainer.classList.add("map-info-container");

        let infoContainer = document.createElement("div");
        infoContainer.classList.add("info-container");

        let lineStrike = document.createElement("div");
        lineStrike.classList.add("line-strike");
        infoContainer.appendChild(lineStrike);

        let name = document.createElement("div");
        name.classList.add("name");
        name.innerHTML = "Zach Vaillancourt";
        let nameContainer = document.createElement("div");
        nameContainer.classList.add("name-container");
        nameContainer.appendChild(name);

        infoContainer.appendChild(nameContainer);

        infoContainer.appendChild(this.createTitle());

        let github = document.createElement("div");
        github.classList.add("github");
        github.innerHTML = "Github";
        let linkedIn = document.createElement("div");
        linkedIn.classList.add("linked-in");
        linkedIn.innerHTML = "LinkedIn";

        let linksContainer = document.createElement("div");
        linksContainer.classList.add("links-container");
        linksContainer.appendChild(github);
        linksContainer.appendChild(linkedIn);

        infoContainer.appendChild(linksContainer);

        mapAndInfoContainer.appendChild(this.mapGrid.mapElement);
        mapAndInfoContainer.appendChild(infoContainer);
        return mapAndInfoContainer;
        
    }

    renderPlayerImg(){
        if (this.currentPlayer.team === "red"){
            this.turnImage.src = "../assets/8.png";
            this.turnImageContainer.style.background = "linear-gradient(black, rgba(255, 0, 0, 0.6))";
            this.turn1.style.background = "linear-gradient(rgba(255, 0, 0, 0.3), black)";
        } else if (this.currentPlayer.team === "blue"){
            this.turnImage.src = "../assets/4.png";
            this.turnImageContainer.style.background = "linear-gradient(black, rgba(0, 0, 255, 0.6))";
            this.turn1.style.background = "linear-gradient(rgba(0, 0, 255, 0.3), black";
        } else if (this.currentPlayer.team === "gray"){
            this.turnImage.src = "../assets/19.png";
            this.turnImageContainer.style.background = "linear-gradient(black, rgba(128, 128, 128, 0.6))";
            this.turn1.style.background = "linear-gradient(rgba(128, 128, 128, 0.3), black)";
        } else if (this.currentPlayer.team === "green"){
            this.turnImage.src = "../assets/15.png";
            this.turnImageContainer.style.background = "linear-gradient(black, rgba(0, 128, 0, 0.6))";
            this.turn1.style.background = "linear-gradient(rgba(0, 128, 0, 0.3), black)";
        }
    }

    createTurnOrder(){
        let turnOrderContainer = document.createElement("div");
        turnOrderContainer.classList.add("turn-order-container");

        this.turn1.classList.add("current-turn");
        this.turn2.classList.add("turn");
        this.turn3.classList.add("turn");
        this.turn4.classList.add("turn");

        turnOrderContainer.appendChild(this.turn1);
        turnOrderContainer.appendChild(this.turn2);
        turnOrderContainer.appendChild(this.turn3);
        turnOrderContainer.appendChild(this.turn4);

        this.sidebar.appendChild(turnOrderContainer);
    }

    updateTurnOrder(){
        let i = this.turn;
        this.turn1.innerHTML = this.currentPlayer.team.charAt(0).toUpperCase() + this.currentPlayer.team.slice(1);
        this.turn2.innerHTML = "2: " + this.players.array[(i + 1) % 4].team.charAt(0).toUpperCase() + this.players.array[(i + 1) % 4].team.slice(1);
        this.turn3.innerHTML = "3: " + this.players.array[(i + 2) % 4].team.charAt(0).toUpperCase() + this.players.array[(i + 2) % 4].team.slice(1);
        this.turn4.innerHTML = "4: " + this.players.array[(i + 3) % 4].team.charAt(0).toUpperCase() + this.players.array[(i + 3) % 4].team.slice(1);
    }

    addEndTurnButton(){
        let endTurnButton = document.createElement("button");
        endTurnButton.innerHTML = "End Turn";
        endTurnButton.onclick = () => this.handleButtonChange();
        endTurnButton.classList.add("end-turn-btn");
        
        this.btnContainer.appendChild(endTurnButton);
        
        this.button = endTurnButton; // to be used to update this.button;
    }

    handleButtonChange(){
        if(this.initialPlacementPhase === true){
            this.nextPlayer();
        } else if (this.battlePhase === true){
            if (this.battleWonFortificationPhase === true){
                this.battleWonFortificationPhase = false;
                this.battleWonTerritoryInstance.tileElement.classList.remove("selected");
                this.battleWonTerritoryInstance = null;
                this.territorySelectedInstance.tileElement.classList.remove("selected");
                this.territorySelected = false;
                this.territorySelectedInstance = null;
                this.button.innerHTML = "End Attack Phase";
            } else {
                this.battlePhase = false;
                this.fortifyPhase = true;
                this.button.innerHTML = "End Turn"
            }
        } else if (this.fortifyPhase === true){
            this.fortifyPhase = false;
            this.button.innerHTML = "Place Units";
            this.placementPhase = true;
            this.nextPlayer();
        }
        this.updateInfoDisplay();
    }

    createTitle(){
        let titleContainer = document.createElement("div");
        titleContainer.classList.add("title-container");        

        let wholeTitle = ("STARQUEST").split("");

        wholeTitle.forEach( (char, i) => {
            let titleChar = document.createElement("div");
            titleChar.classList.add(`title-char${i}`);
            titleChar.innerHTML = char;
            titleContainer.appendChild(titleChar);
        });
        return titleContainer;
    }

}

export default Game;