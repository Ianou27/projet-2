import { ExchangeCommand } from '@app/classes/exchangeCommand/exchange-command';
import { Game } from '@app/classes/game/game';
import { PassCommand } from '@app/classes/passCommand/pass-command';
import { PlacementCommand } from '@app/classes/placementCommand/placement-command';

export class GameManager {
    private commandsList: string[] = ['!placer', '!echanger', '!passer', '!indice'];
    placeWord(command: string[], game: Game) {
        PlacementCommand.placeWord(command, game);
    }

    pass(game: Game) {
        PassCommand.passTurn(game);
    }

    exchange(command: string[], game: Game) {
        ExchangeCommand.exchangeLetters(command, game);
    }

    placeBoardValid(command: string[], game: Game): boolean {
        return PlacementCommand.validatedPlaceCommandBoard(command, game);
    }

    passCommandValid(command: string[]) {
        return PassCommand.validatedPassCommandFormat(command);
    }

    commandVerification(message: string): boolean {
        for (const command of this.commandsList) {
            if (command === message) {
                return true;
            }
        }
        return false;
    }

    placeFormatValid(command: string[]) {
        return PlacementCommand.validatedPlaceCommandFormat(command);
    }

    exchangeFormatValid(command: string[]) {
        return ExchangeCommand.validatedExchangeCommandFormat(command);
    }

    exchangeTileHolderValid(command: string[], game: Game) {
        return ExchangeCommand.validatedExchangeCommandBoard(command, game);
    }

    lengthVerification(message: string) {
        return message.length > 512 ? false : true;
    }

    characterVerification(message: string): boolean {
        return message.trim().length === 0 ? false : true;
    }

    messageVerification(message: string): string {
        let erreur = 'valide';
        if (!this.lengthVerification(message)) {
            erreur = 'message trop long';
        }
        return erreur;
    }

    placeVerification(command: string[], game: Game): string {
        let message = 'valide';
        if (!this.placeFormatValid(command)) {
            message = 'Format non valide';
        } else if (!this.placeBoardValid(command, game)) {
            message = 'Placement non valide';
        }
        return message;
    }

    exchangeVerification(command: string[], game: Game): string {
        let message = 'valide';
        if (!this.exchangeFormatValid(command)) {
            message = 'Format non valide';
        } else if (!this.exchangeTileHolderValid(command, game)) {
            message = 'Echange Impossible';
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
}
