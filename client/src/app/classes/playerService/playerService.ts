export class PlayerService{
    private letters: Array<String>;
    private hisTurn: boolean;

    constructor(letters:Array<String>, hisTurn:boolean){
        this.letters = letters;
        this.hisTurn = hisTurn; 
    }

    changeTurn(){
        this.hisTurn = !this.hisTurn;
    }

}