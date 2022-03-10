import { PlacementInformations } from '@app/placement-informations';
import { letterValue } from '@common/assets/reserve-letters';
import { INDEX_OF_NOT_FOUND, MAXIMUM_ROW_COLUMN } from '@common/constants/general-constants';
import { Tile } from '@common/tile/Tile';
import * as fs from 'fs';
import { rowLetter } from './../../../assets/row';
import { Game } from './../game/game';
import { PlacementCommand } from './../placementCommand/placement-command';

interface TilePlacementPossible {
    tile: Tile;
    orientation: string;
}

interface PlacementScore {
    score: number;
    command: string;
}

export class VirtualPlayer {
    dictionaryArray: string[] = JSON.parse(fs.readFileSync('./assets/dictionnary.json').toString()).words;

    static findAllWords(letters: string[], letterOnBoard: string): string[] {
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
            if (validWords.length >= 5) {
                break;
            }
        }
        return validWords;
    }

    static actionVirtualBeginnerPlayer(game: Game): string[] {
        const probability = Math.floor(Math.random() * 100);
        if (probability <= 10) {
            return '!passer'.split(' ');
        } else if (probability <= 20) {
            return this.exchangeLettersCommand(game);
        } else {
            return this.placementLettersCommand(game);
        }
    }

    static heapsPermute(array: string[], n: number, words: string[]): string[] {
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

    static findPlacementCommand(words: string[], placement: TilePlacementPossible, game: Game): PlacementScore[] {
        const placementsCommands: PlacementScore[] = [];
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
                const lettersPosition = this.findLettersPosition(PlacementCommand.separatePlaceCommandInformations(command.split(' ')), game);
                const score = PlacementCommand.newWordsValid(command.split(' '), game, lettersPosition);
                if (score > 0) {
                    const placementScore: PlacementScore = {
                        score,
                        command,
                    };
                    placementsCommands.push(placementScore);
                }
            } catch {
                continue;
            }
        }

        return placementsCommands;
    }

    static findLettersPosition(placementInformations: PlacementInformations, game: Game): Tile[] {
        let letterCount = placementInformations.numberLetters;
        let tile: Tile = game.gameBoard.cases[placementInformations.column][placementInformations.row];
        let lettersIter = 0;
        const positions: Tile[] = [];
        while (letterCount > 0) {
            if (game.gameBoard.tileContainsLetter(tile.positionX, tile.positionY)) {
                tile = game.gameBoard.nextTile(tile, placementInformations.orientation, false);
                continue;
            }
            const letterPlace = placementInformations.letters[lettersIter];
            const newTile = new Tile(tile.specialProperty, tile.positionX, tile.positionY);
            newTile.letter = letterPlace.toUpperCase();
            newTile.value = letterValue[letterPlace.toUpperCase()];
            positions.push(newTile);
            tile = game.gameBoard.nextTile(tile, placementInformations.orientation, false);
            lettersIter++;
            letterCount--;
        }
        return positions;
    }

    static findAllPlacementCommands(game: Game): PlacementScore[] {
        const playerLetters = game.playerTurn().lettersToStringArray();
        const placementPossible = this.findAllPositionGameBoard(game);
        let commandPlacements: PlacementScore[] = [];
        for (const placement of placementPossible) {
            const letters = playerLetters.concat(placement.tile.letter);
            const words = this.findAllWords(letters, placement.tile.letter);
            commandPlacements = commandPlacements.concat(this.findPlacementCommand(words, placement, game));
            if (commandPlacements.length >= 15) {
                break;
            }
        }
        return commandPlacements;
    }

    static placementLettersCommand(game: Game): string[] {
        const allPlacementCommands = this.findAllPlacementCommands(game);
        let placementCommand = '';
        const probability = Math.floor(Math.random() * 100);
        if (probability <= 40) {
            placementCommand = this.findPlacementScoreRange(1, 6, allPlacementCommands);
        } else if (probability <= 70) {
            placementCommand = this.findPlacementScoreRange(7, 12, allPlacementCommands);
        } else {
            placementCommand = this.findPlacementScoreRange(13, 18, allPlacementCommands);
        }
        return placementCommand.split(' ');
    }

    static findPlacementScoreRange(minScore: number, maxScore: number, commandPlacements: PlacementScore[]): string {
        for (const commandPlacement of commandPlacements) {
            if (minScore < commandPlacement.score && commandPlacement.score < maxScore) return commandPlacement.command;
        }
        return commandPlacements[0].command;
    }

    static findAllPositionGameBoard(game: Game): TilePlacementPossible[] {
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
    static shuffleArray(array: any[]): any[] {
        return array
            .map((value) => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
    }

    static swap(array: string[], pos1: number, pos2: number) {
        const temp = array[pos1];
        array[pos1] = array[pos2];
        array[pos2] = temp;
    }

    static getCombinations(chars: string[]) {
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

    static getRandomLetterForBlank(): string {
        const randomLetters = ['A', 'E', 'I', 'L', 'O', 'N', 'T', 'S'];
        return randomLetters[Math.floor(Math.random() * randomLetters.length)];
    }

    static exchangeLettersCommand(game: Game): string[] {
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
