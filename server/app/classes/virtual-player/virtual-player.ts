import { INDEX_OF_NOT_FOUND, MAXIMUM_ROW_COLUMN } from '@common/constants/general-constants';
import { Tile } from '@common/tile/Tile';
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
        words = [...new Set(words)].filter((item) => {
            return item.includes(letterOnBoard.toLowerCase());
        });

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
            return this.findPlacementWord(game);
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

    findPlacementWord(game: Game): string[] {
        const playerLetters = game.playerTurn().lettersToStringArray();
        const placementPossible = this.findAllPositionGameBoard(game);
        let words: string[] = [];
        for (const placement of placementPossible) {
            const letters = playerLetters.concat(placement.tile.letter);
            words = words.concat(this.findAllWords(letters, placement.tile.letter));
        }
        return words;
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
        return tiles;
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
