enum playerTypeEnum{
    Bot,
    Human,
}

export class PlayerService{
    playerType: playerTypeEnum;
    letters: Array<String>;
    hisTurn: boolean;

    constructor(playerType:playerTypeEnum, letters:Array<String>, hisTurn:boolean){
        this.playerType = playerType;
        this.letters = letters;
        this.hisTurn = hisTurn; 
    }

    changeTurn(){
        this.hisTurn = !this.hisTurn;
    }

}