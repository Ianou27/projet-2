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
        return PlacementCommand.placeWord(command, game) ? 'placer' : 'commande impossible à realisé';
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
        return this.messageLengthVerification(message) ? 'valide' : 'Message trop long';
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
        return this.passCommandValid(command) ? 'valide' : 'Format non valide';
    }

    formatClueCommand(game: Game): string[] {
        const clues = ClueCommand.findClues(game);
        const text: string[] = ['\n', 'Possibilités de placements : ', '\n'];
        for (const clue of clues) {
            text.push(clue.command + ' pour ' + clue.score.toString() + ' points');
        }
        text.push('\n');
        return text;
    }

    helpCommandValid(command: string[]): boolean {
        return HelpCommand.validatedFormat(command);
    }
}
