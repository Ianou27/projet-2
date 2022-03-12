import { Game } from './../game/game';
import { VirtualPlayer } from './../virtual-player/virtual-player';

export class ClueCommand {
    static verifyFormat(commandInformations: string[]): boolean {
        if (commandInformations.length !== 1) return false;
        const commandFormat = /^!indice$/;
        return commandFormat.test(commandInformations[0]);
    }

    static findClues(game: Game) {
        return VirtualPlayer.findAllPlacementCommands(game).slice(0, 3);
    }
}
