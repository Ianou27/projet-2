import { LetterScore } from './../../../../common/assets/reserve-letters';

export class ReserveCommand {
    static verifyFormat(commandInformations: string[]): boolean {
        const commandFormat = /^!réserve$/;
        return commandInformations.length === 1 && commandFormat.test(commandInformations[0]);
    }

    static reserve(reserveLetters: string[]): LetterScore {
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
