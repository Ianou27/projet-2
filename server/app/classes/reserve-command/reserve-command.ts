import { LetterScore } from './../../../../common/assets/reserve-letters';

export class ReserveCommand {
    static verifyFormat(commandInformations: string[]): boolean {
        const commandFormat = /^!réserve$/;
        return commandInformations.length === 1 && commandFormat.test(commandInformations[0]);
    }

    static reserve(reserveLetters: string[]): LetterScore {
        const currentReserve: LetterScore = {};
        reserveLetters.forEach((letter) => {
            currentReserve[letter] = currentReserve[letter] === undefined ? 1 : currentReserve[letter] + 1;
        });
        return currentReserve;
    }
}
