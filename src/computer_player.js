class ComputerPlayer {
    constructor(team){
        this.territories = [];

        this.team = team;
        this.availabeUnits = 0;
        this.allUnits = 0;

        this.unitsSelected = 0;
    }


    // Build a conditional that checks to see if the current player is a computer, 
    // then run the AI methods for each phase
    findTerritoriesToClaim(map){
        map.forEach(tile => {
            if (!tile.status){
                if (territory.battleGrounds){
                    this.claimTerritory(territory);
                } else if (territory.theBelt){
                    this.claimTerritory(territory);
                } else if (territory.bridge){
                    this.claimTerritory(territory);
                } else if (territory.hideAway){
                    this.claimTerritory(territory);
                } else {
                    this.claimTerritory(territory);
                }
            };
        })
    }

    claimTerritory(territory){
        territory.claimTile(this.team);
        this.territories.push(territory);
    }

    findTerritoriesToPlace(){
        while(this.availabeUnits > 0){
            this.territories.forEach(territory => {
                if (territory.battleGrounds && territory.units < (this.allUnits/3)){
                    this.placeUnit(territory);
                } else if (territory.theBelt && territory.units < (this.allUnits/3)){
                    this.placeUnit(territory);
                } else if (territory.bridge && territory.units < (this.allUnits/3)){
                    this.placeUnit(territory);
                } else if (territory.hideAway && territory.units < (this.allUnits/3)){
                    this.placeUnit(territory);
                } else {
                    this.placeUnit(territory);
                }
            })
        }
    }

    placeUnit(territory){
        territory.receiveUnits();
        this.availabeUnits -= 1;
        this.allUnits += 1;
    }

}