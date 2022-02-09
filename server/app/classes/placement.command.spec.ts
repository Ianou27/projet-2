import { GameService } from './game.service';
import { PlacementCommand } from './placement.command';

describe('Validated Word', () => {
    let placementCommand: PlacementCommand;
    const game: GameService = new GameService();

    beforeEach(() => {
        placementCommand = new PlacementCommand(game);
    });

    /*     it('method insideBoardGame should return True when a word is place inside an empty board', () => {
        game;
        expect(result).to.equals(true);
    }); */
});
