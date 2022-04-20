import { PlacementScore } from '@common/types';
import { Game } from './../game/game';
import { VirtualPlayer } from './../virtual-player/virtual-player';

export class ClueCommand {
    static verifyFormat(commandInformations: string[]): boolean {
        const commandFormat = /^!indice$/;
        return commandInformations.length === 1 && commandFormat.test(commandInformations[0]);
    }

    static findClues(game: Game): PlacementScore[] {
        return VirtualPlayer.findAllPlacementCommands(game).slice(0, 3);
    }
}
