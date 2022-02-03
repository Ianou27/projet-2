export class PlayerService{
    private letters: Array<string>;
    private hisTurn: boolean;

    constructor(letters:Array<string>, hisTurn:boolean){
        this.letters = letters;
        this.hisTurn = hisTurn; 
    }

    changeTurn(){
        this.hisTurn = !this.hisTurn;
    }

    getLetters() : Array<string>{
        return this.letters;
    }

    getHisTurn() : boolean {
        return this.hisTurn;
    }

}