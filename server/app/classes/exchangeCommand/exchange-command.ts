import { MINIMUM_LETTER_RESERVE_FOR_EXCHANGE } from './../../../../common/constants/general-constants';
import { Game } from './../game/game';
import { Player } from './../player/player';

export class ExchangeCommand {
    static exchangeLetters(commandInformations: string[], game: Game): void {
        const player: Player = game.playerTurn();
        const oldLetters = commandInformations[1];
        for (const letter of oldLetters) {
            player.changeLetter(letter, game.reserveLetters.getRandomLetterReserve());
            game.reserveLetters.letters.push(letter);
        }
        game.changeTurnTwoPlayers();
        game.gameState.passesCount = 0;
    }

    static validatedExchangeCommandBoard(commandInformations: string[], game: Game): boolean {
        const tileHolderContains: boolean = game.playerTurn().tileHolderContains(commandInformations[1]);
        const reserveMoreSevenLetters: boolean = game.reserveLetters.letters.length >= MINIMUM_LETTER_RESERVE_FOR_EXCHANGE;

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
