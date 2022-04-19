import { MINIMUM_LETTER_RESERVE_FOR_EXCHANGE } from './../../../../common/constants/general-constants';
import { Game } from './../game/game';

export class ExchangeCommand {
    static validatedExchangeCommandBoard(commandInformations: string[], game: Game): boolean {
        const tileHolderContains: boolean = game.playerTurn().tileHolderContains(commandInformations[1]);
        const reserveMoreSevenLetters: boolean = game.reserveLetters.letters.length >= MINIMUM_LETTER_RESERVE_FOR_EXCHANGE;

        return tileHolderContains && reserveMoreSevenLetters;
    }

    static validatedExchangeCommandFormat(commandInformations: string[]): boolean {
        const command: string = commandInformations.join(' ');
        const exchangeValidation = /^!échanger ([a-z]|[*])+$/;
        const lengthExchangeCommand = /^.{11,17}$/;

        return commandInformations.length === 2 && exchangeValidation.test(command) && lengthExchangeCommand.test(command);
    }
}
