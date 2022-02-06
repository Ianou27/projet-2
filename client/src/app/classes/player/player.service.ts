export class PlayerService {
    private letters: string[];
    private hisTurn: boolean;

    constructor(letters: string[], hisTurn: boolean) {
        this.letters = letters;
        this.hisTurn = hisTurn;
    }

    changeTurn() {
        this.hisTurn = !this.hisTurn;
    }

    getLetters(): string[] {
        return this.letters;
    }

    getHisTurn(): boolean {
        return this.hisTurn;
    }
}
