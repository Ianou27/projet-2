import { LetterScore } from './../../../common/assets/reserve-letters';
import { MAXIMUM_CHARACTERS_MESSAGE } from './../../../common/constants/general-constants';
import { ExchangeCommand } from './../classes/exchangeCommand/exchange-command';
import { Game } from './../classes/game/game';
import { PassCommand } from './../classes/passCommand/pass-command';
import { PlacementCommand } from './../classes/placementCommand/placement-command';
import { ReserveCommand } from './../classes/reserveCommand/reserve-command';

export class GameManager {
    
    
    placeWord(command: string[], game: Game): string {
        let message = 'placer';
        if (!PlacementCommand.placeWord(command, game)) {
            message = 'commande impossible à realisé';
        }

        return message;
    }

    reserveCommandValid(command: string[]): boolean {
        return ReserveCommand.verifyFormat(command);
    }

    reserve(game: Game): LetterScore {
        return ReserveCommand.reserve(game.reserveLetters.letters);
    }

    pass(game: Game) {
        if(!game.gameState.gameFinished)game.passTurn();
        
    }

    exchange(command: string[], game: Game) {
        game.exchangeLetters(command);
    }

    placeBoardValid(command: string[], game: Game): boolean {
        return PlacementCommand.validatedPlaceCommandBoard(command, game);
    }

    passCommandValid(command: string[]) {
        return PassCommand.validatedPassCommandFormat(command);
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
        return message.length > MAXIMUM_CHARACTERS_MESSAGE ? false : true;
    }

    characterVerification(message: string): boolean {
        return message.trim().length === 0 ? false : true;
    }

    messageVerification(message: string): string {
        let erreur = 'valide';
        if (!this.lengthVerification(message)) {
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
}
