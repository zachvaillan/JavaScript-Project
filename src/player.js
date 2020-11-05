class Player {

    constructor(team){
        this.territories = [];
        this.territoryPositions = [];

        this.team = team;
        this.availabeUnits = 9;
        this.allUnits = 0;

        this.unitsSelected = 0;
    }

    addTerritory(tile){
        this.territories.push(tile);
        this.territoryPositions.push(tile.pos);
    }

    placeUnit(){
        this.availabeUnits -= 1;
    }

    grabUnits(){
        this.unitsSelected += 1;
    }

   

}

export default Player;