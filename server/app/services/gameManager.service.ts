import { ExchangeCommand } from "@app/classes/exchangeCommand/exchange-command";
import { PlacementCommand } from "@app/classes/placementCommand/placement-command";

export class GameManager {
    private commandsList: string[] = ['!placer', '!echanger', '!passer', '!indice'];
    placeWord(command: string[], game: any) {
        PlacementCommand.placeWord(command, game);
    }

    exchange(command: string[], game: any) {
        ExchangeCommand.exchangeLetters(command, game);
    }

    placeBoardValid(command: string[], game: any): boolean {
        return PlacementCommand.validatedPlaceCommandBoard(command, game);
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

    exchangeTileHolderValid(command: string[], game: any) {
        return ExchangeCommand.validatedExchangeCommandBoard(command, game);
    }

    lengthVerification(message: string) {
        return message.length > 512 ? false : true;
    }
    characterVerification(message: string): boolean {
        return message.trim().length === 0 ? false : true;
    }
}
