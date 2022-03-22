import { LetterScore } from './../../../../common/assets/reserve-letters';
export class ReserveCommand {
    static verifyFormat(commandInformations: string[]): boolean {
        if (commandInformations.length !== 1) return false;
        const commandFormat = /^!réserve$/;
        return commandFormat.test(commandInformations[0]);
    }

    static reserve(reserveLetters: string[]) {
        const currentReserve: LetterScore = {};
        reserveLetters.forEach((letter) => {
            if (currentReserve[letter] === undefined) {
                currentReserve[letter] = 1;
            } else {
                currentReserve[letter] = currentReserve[letter] + 1;
            }
        });
        return currentReserve;
    }
}
