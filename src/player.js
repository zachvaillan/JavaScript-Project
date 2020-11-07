class Player {

    constructor(team){
        this.territories = [];

        this.team = team;
        this.availabeUnits = 9;
        this.allUnits = 0;

        this.unitsSelected = 0;
    }

    addTerritory(tile){
        if (!this.territories.includes(tile)){
            this.territories.push(tile);
        }
    }

    loseTerritory(tile){
        this.territories.forEach((tileCheck, i) => {
            if(tile === tileCheck){
                this.territories.splice(i, 1);
            }
        })
    }

    placeUnit(){
        this.availabeUnits -= 1;
        this.allUnits += 1;
    }

    grabUnits(){
        this.unitsSelected += 1;
    }

    bonusUnits(){
        let count = 0;
        this.territories.forEach(ter => {
            count += 1;
        });
        if (count < 3){
            return 1;
        }
        return Math.floor(count / 3) + this.checkForBonuses();
    }
   
    checkForBonuses(){
        let bridge = 0;
        let battleGrounds = 0;
        let hideAway = 0;
        let theBelt = 0;
        let total = 0;
        this.territories.forEach(ter => {
            if(ter.bridge === true){
                bridge += 1;
            } else if (ter.battleGrounds === true){
                battleGrounds += 1;
            } else if (ter.hideAway === true){
                hideAway += 1;
            } else if (ter.theBelt === true){
                theBelt += 1;
            } 
        })
        if (bridge === 2){
            total += 2;
        } 
        if (battleGrounds === 9){
            total += 6;
        }
        if (hideAway === 4){
            total += 3;
        }
        if (theBelt === 4){
            total += 4;
        }
        return total;
    }

}

export default Player;