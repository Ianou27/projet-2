import { MINIMUM_LETTER_RESERVE_FOR_EXCHANGE } from '@common/constants/general-constants';
import { Game } from './../game/game';
import { Player } from './../player/player';

export class ExchangeCommand {
    static exchangeLetters(commandInformations: string[], gameService: Game): void {
        const player: Player = gameService.playerTurn();
        const oldLetters = commandInformations[1];
        for (const letter of oldLetters) {
            player.changeLetter(letter, gameService.getRandomLetterReserve());
            gameService.reserveLetters.push(letter);
        }
    }

    static validatedExchangeCommandBoard(commandInformations: string[], gameService: Game): boolean {
        const tileHolderContains: boolean = gameService.tileHolderContains(commandInformations[1]);
        const reserveMoreSevenLetters: boolean = gameService.reserveLetters.length >= MINIMUM_LETTER_RESERVE_FOR_EXCHANGE;

        return tileHolderContains && reserveMoreSevenLetters;
    }

    static validatedExchangeCommandFormat(commandInformations: string[]): boolean {
        if (commandInformations.length !== 2) {
            return false;
        }
        const command: string = commandInformations.join(' ');
        const exchangeValidation = /^!echanger ([a-z]|[*])+$/;
        const lengthExchangeCommand = /^.{11,17}$/;

        return exchangeValidation.test(command) && lengthExchangeCommand.test(command);
    }
}
