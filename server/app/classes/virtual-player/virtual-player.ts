import { INDEX_OF_NOT_FOUND, MAXIMUM_ROW_COLUMN } from '@common/constants/general-constants';
import { Tile } from '@common/tile/Tile';
import { rowLetter } from './../../../assets/row';
import { Game } from './../game/game';
import { PlacementCommand } from './../placementCommand/placement-command';

interface TilePlacementPossible {
    tile: Tile;
    orientation: string;
}

export class VirtualPlayer {
    findAllWords(letters: string[], letterOnBoard: string): string[] {
        let validWords: string[] = [];
        let words: string[] = [];
        let combinations = this.getCombinations(letters.map((letter) => letter.toLowerCase())).filter((item) => {
            return item.length < 7;
        });

        const middleIndex = Math.ceil(combinations.length);
        combinations = combinations.splice(-middleIndex);

        for (const combination of combinations) {
            words = this.heapsPermute(combination.split(''), 0, words);
        }
        words = this.shuffleArray(
            [...new Set(words)].filter((item) => {
                return item.includes(letterOnBoard.toLowerCase());
            }),
        );

        for (const word of words) {
            if (PlacementCommand.validatedWordDictionary(word)) {
                validWords = validWords.concat(word);
            }
            if (validWords.length >= 10) {
                break;
            }
        }
        return validWords;
    }

    actionVirtualBeginnerPlayer(game: Game): string[] {
        const probability = Math.floor(Math.random() * 100);
        if (probability <= 10) {
            game.changeTurnTwoPlayers();
        } else if (probability <= 20) {
            return this.exchangeLettersCommand(game);
        } else {
            return this.findPlacementCommands(game);
        }
        return [];
    }

    heapsPermute(array: string[], n: number, words: string[]): string[] {
        n = n || array.length;
        let j = 0;
        if (n === 1) {
            words.push(array.join(''));
        } else {
            for (let i = 1; i <= n; i += 1) {
                this.heapsPermute(array, n - 1, words);
                if (n % 2) {
                    j = 1;
                } else {
                    j = i;
                }
                this.swap(array, j - 1, n - 1);
            }
        }
        return words;
    }
    findPlacementCommand(words: string[], placement: TilePlacementPossible, game: Game): string[] {
        const placementsCommands: string[] = [];
        for (const word of words) {
            try {
                let tileStart = placement.tile;
                let command = '!placer ';
                for (let i = 0; i < word.indexOf(placement.tile.letter.toLowerCase()); i++) {
                    tileStart = game.gameBoard.nextTile(tileStart, placement.orientation, true);
                }
                const wordWithoutLetter =
                    word.slice(0, word.indexOf(placement.tile.letter.toLowerCase())) +
                    word.slice(word.indexOf(placement.tile.letter.toLowerCase()) + 1);
                command = command.concat(
                    rowLetter[tileStart.positionY] + (tileStart.positionX + 1).toString() + placement.orientation + ' ' + wordWithoutLetter,
                );
                placementsCommands.push(command);
            } catch {
                continue;
            }
        }
        return placementsCommands;
    }

    findPlacementCommands(game: Game): string[] {
        const playerLetters = game.playerTurn().lettersToStringArray();
        const placementPossible = this.findAllPositionGameBoard(game);
        let commandPlacements: string[] = [];
        for (const placement of placementPossible) {
            const letters = playerLetters.concat(placement.tile.letter);
            const words = this.findAllWords(letters, placement.tile.letter);
            commandPlacements = commandPlacements.concat(this.findPlacementCommand(words, placement, game));
            if (commandPlacements.length >= 20) {
                break;
            }
        }
        console.log(commandPlacements);
        return commandPlacements;
    }

    findAllPositionGameBoard(game: Game): TilePlacementPossible[] {
        const gameBoard = game.gameBoard;
        const tiles: TilePlacementPossible[] = [];
        for (let i = 0; i < MAXIMUM_ROW_COLUMN; i++) {
            for (let j = 0; j < MAXIMUM_ROW_COLUMN; j++) {
                let orientation = '';
                if (gameBoard.tileContainsLetter(i, j)) {
                    if (
                        gameBoard.nextTile(gameBoard.cases[i][j], 'h', false).letter === '' &&
                        gameBoard.nextTile(gameBoard.cases[i][j], 'h', true).letter === ''
                    ) {
                        orientation = 'h';
                    }
                    if (
                        gameBoard.nextTile(gameBoard.cases[i][j], 'v', false).letter === '' &&
                        gameBoard.nextTile(gameBoard.cases[i][j], 'v', true).letter === ''
                    ) {
                        orientation = 'v';
                    }

                    if (orientation !== '') {
                        const tilePlacement: TilePlacementPossible = {
                            tile: gameBoard.cases[i][j],
                            orientation,
                        };
                        tiles.push(tilePlacement);
                    }
                }
            }
        }
        const tilesShuffled = this.shuffleArray(tiles);
        return tilesShuffled;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    shuffleArray(array: any[]): any[] {
        return array
            .map((value) => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
    }

    swap(array: string[], pos1: number, pos2: number) {
        const temp = array[pos1];
        array[pos1] = array[pos2];
        array[pos2] = temp;
    }

    getCombinations(chars: string[]) {
        const result: string[] = [];
        if (chars.indexOf('*') !== INDEX_OF_NOT_FOUND) {
            chars[chars.indexOf('*')] = this.getRandomLetterForBlank();
        }
        const func = (prefix: string, array: string[]) => {
            for (let i = 0; i < array.length; i++) {
                result.push(prefix + array[i]);
                func(prefix + array[i], array.slice(i + 1));
            }
        };
        func('', chars);
        return result;
    }

    getRandomLetterForBlank(): string {
        const randomLetters = ['A', 'E', 'I', 'L', 'O', 'N', 'T', 'S'];
        return randomLetters[Math.floor(Math.random() * randomLetters.length)];
    }

    exchangeLettersCommand(game: Game): string[] {
        if (game.reserveLetters.letters.length === 0) {
            game.changeTurnTwoPlayers();
            return [];
        }
        const virtualPlayerLetters = game.playerTurn().lettersToStringArray();
        let command = '!echanger ';

        const letters = virtualPlayerLetters
            .sort(() => Math.random() - Math.random())
            .splice(0, Math.floor(Math.random() * virtualPlayerLetters.length));
        command = command.concat(letters.join('')).toLowerCase();
        return command.split(' ');
    }
}
