import { ClueCommand } from '@app/classes/clue-command/clue-command';
import { HelpCommand } from '@app/classes/help-command/help-command';
import { LetterScore } from './../../../../common/assets/reserve-letters';
import { MAXIMUM_CHARACTERS_MESSAGE } from './../../../../common/constants/general-constants';
import { ExchangeCommand } from './../../classes/exchange-command/exchange-command';
import { Game } from './../../classes/game/game';
import { PassCommand } from './../../classes/pass-command/pass-command';
import { PlacementCommand } from './../../classes/placement-command/placement-command';
import { ReserveCommand } from './../../classes/reserve-command/reserve-command';

export class GameManager {
    placeWord(command: string[], game: Game): string {
        let message = 'placer';
        if (!PlacementCommand.placeWord(command, game)) {
            message = 'commande impossible à realisé';
        }

        return message;
    }

    clueCommandValid(command: string[]): boolean {
        return ClueCommand.verifyFormat(command);
    }

    reserveCommandValid(command: string[]): boolean {
        return ReserveCommand.verifyFormat(command);
    }

    reserve(game: Game): LetterScore {
        return ReserveCommand.reserve(game.reserveLetters.letters);
    }

    pass(game: Game) {
        if (!game.gameState.gameFinished) game.passTurn();
    }

    exchange(command: string[], game: Game) {
        game.exchangeLetters(command);
        game.timer.reset();
    }

    placeBoardValid(command: string[], game: Game): boolean {
        return PlacementCommand.validatedPlaceCommandBoard(command, game);
    }

    passCommandValid(command: string[]): boolean {
        return PassCommand.validatedPassCommandFormat(command);
    }

    placeFormatValid(command: string[]): boolean {
        return PlacementCommand.validatedPlaceCommandFormat(command);
    }

    exchangeFormatValid(command: string[]): boolean {
        return ExchangeCommand.validatedExchangeCommandFormat(command);
    }

    exchangeTileHolderValid(command: string[], game: Game): boolean {
        return ExchangeCommand.validatedExchangeCommandBoard(command, game);
    }

    messageLengthVerification(message: string): boolean {
        return message.length > MAXIMUM_CHARACTERS_MESSAGE ? false : true;
    }

    messageVerification(message: string): string {
        let erreur = 'valide';
        if (!this.messageLengthVerification(message)) {
            erreur = 'Message trop long';
        }
        return erreur;
    }

    placeVerification(command: string[], game: Game): string {
        let message = 'valide';
        if (!this.placeFormatValid(command)) {
            message = 'Entrée invalide';
        } else if (!this.placeBoardValid(command, game)) {
            message = 'Commande impossible à réaliser';
        }
        return message;
    }

    exchangeVerification(command: string[], game: Game): string {
        let message = 'valide';
        if (!this.exchangeFormatValid(command)) {
            message = 'Entrée invalide';
        } else if (!this.exchangeTileHolderValid(command, game)) {
            message = 'Commande impossible à réaliser';
        }
        return message;
    }

    passVerification(command: string[]): string {
        let message = 'valide';
        if (!this.passCommandValid(command)) {
            message = 'Format non valide';
        }
        return message;
    }

    formatClueCommand(game: Game): string[] {
        const clues = ClueCommand.findClues(game);
        const text: string[] = ['Possibilités de placements'];
        for (const clue of clues) {
            text.push(clue.command + ' pour ' + clue.score.toString() + ' points');
        }
        return text;
    }

    helpCommandValid(command: string[]) {
        return HelpCommand.validatedFormat(command);
    }
}
