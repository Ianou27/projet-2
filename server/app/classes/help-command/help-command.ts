export class HelpCommand {
    static verifyFormat(commandInformations: string[]): boolean {
        if (commandInformations.length !== 1) return false;
        const commandFormat = /^!aide$/;
        return commandFormat.test(commandInformations[0]);
    }
    static help(/*reserveLetters: string[]): LetterScore*/) {
        const messageAide = 'Commandes disponibles : !aide: Permet d`afficher ce dialogue'
        '!placer : Permet de placer un mot aux coordonnées spécifiées'
        '!réserve: Affiche la quantité restante de chaque lettre dans la réserve
        '!échanger : Permet d`échanger des lettres de votre chevalet pour des lettres pigées aléatoirement';
        // const currentReserve: LetterScore = {};
        // reserveLetters.forEach((letter) => {
        //     if (currentReserve[letter] === undefined) {
        //         currentReserve[letter] = 1;
        //     } else {
        //         currentReserve[letter] = currentReserve[letter] + 1;
        //     }
        // });
        // return messageAide;
    }
}
