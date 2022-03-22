import { PlacementInformations } from '@app/placement-informations';
import { letterValue } from '@common/assets/reserve-letters';
import {
    CENTER_ROW_COLUMN,
    FIRST_BOT_PLACEMENT_BOTTOM_LIMIT,
    FIRST_BOT_PLACEMENT_TOP_LIMIT,
    INDEX_OF_NOT_FOUND,
    LENGTH_WORDS_LIMIT_BOT,
    MAXIMUM_ROW_COLUMN,
    NUMBER_WORDS_LIMIT_BOT,
    NUMBER_WORDS_LIMIT_BOT_ONE_PLACEMENT,
    PROBABILITY_PLACEMENT_1TO6_BOT,
    PROBABILITY_PLACEMENT_7TO12_BOT,
    PROBABILITY_TOTAL,
    SECOND_BOT_PLACEMENT_BOTTOM_LIMIT,
    SECOND_BOT_PLACEMENT_TOP_LIMIT,
    THIRD_BOT_PLACEMENT_BOTTOM_LIMIT,
    THIRD_BOT_PLACEMENT_TOP_LIMIT,
} from '@common/constants/general-constants';
import { Tile } from '@common/tile/Tile';
import { PlacementScore, TilePlacementPossible } from '@common/types';
import * as fs from 'fs';
import { rowLetter } from './../../../../common/assets/row';
import { Game } from './../game/game';
import { PlacementCommand } from './../placementCommand/placement-command';

export class VirtualPlayer {
    static findAllWords(letters: string[], letterOnBoard: string): string[] {
        const dictionaryArray: string[] = JSON.parse(fs.readFileSync('./assets/dictionnary.json').toString()).words;
        let validWords: string[] = [];
        let words: string[] = [];
        let combinations = this.getCombinations(letters.map((letter) => letter.toLowerCase())).filter((item) => {
            return item.length < LENGTH_WORDS_LIMIT_BOT;
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
            if (PlacementCommand.validatedWordDictionary(word, dictionaryArray)) {
                validWords = validWords.concat(word);
            }
            if (validWords.length >= NUMBER_WORDS_LIMIT_BOT_ONE_PLACEMENT) {
                break;
            }
        }
        return validWords;
    }

    static heapsPermute(arrayToPermute: string[], number: number, words: string[]): string[] {
        number = number || arrayToPermute.length;
        let j = 0;
        if (number === 1) {
            words.push(arrayToPermute.join(''));
        } else {
            for (let i = 1; i <= number; i += 1) {
                this.heapsPermute(arrayToPermute, number - 1, words);
                if (number % 2) {
                    j = 1;
                } else {
                    j = i;
                }
                this.swap(arrayToPermute, j - 1, number - 1);
            }
        }
        return words;
    }

    static findPlacementCommand(words: string[], placement: TilePlacementPossible, game: Game): PlacementScore[] {
        const placementsCommands: PlacementScore[] = [];
        for (const word of words) {
            try {
                let wordWithoutLetter = word;
                let tileStart = placement.tile;
                let command = '!placer ';
                if (!game.gameState.firstTurn) {
                    for (let i = 0; i < word.indexOf(placement.tile.letter.toLowerCase()); i++) {
                        tileStart = game.gameBoard.nextTile(tileStart, placement.orientation, true);
                    }
                    wordWithoutLetter =
                        word.slice(0, word.indexOf(placement.tile.letter.toLowerCase())) +
                        word.slice(word.indexOf(placement.tile.letter.toLowerCase()) + 1);
                }

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
        const placementPossible = this.findAllPositionGameBoard(game).slice(0, NUMBER_WORDS_LIMIT_BOT);
        let commandPlacements: PlacementScore[] = [];
        if (placementPossible.length === 0) return [];
        for (const placement of placementPossible) {
            const letters = playerLetters.concat(placement.tile.letter);
            const words = this.findAllWords(letters, placement.tile.letter);
            commandPlacements = commandPlacements.concat(this.findPlacementCommand(words, placement, game));
            if (commandPlacements.length >= NUMBER_WORDS_LIMIT_BOT) {
                break;
            }
        }
        return commandPlacements;
    }

    static placementLettersCommand(probability: number, game: Game): string[] {
        const allPlacementCommands = this.findAllPlacementCommands(game);
        let placementCommand = '';
        if (probability <= PROBABILITY_PLACEMENT_1TO6_BOT) {
            placementCommand = this.findPlacementScoreRange(FIRST_BOT_PLACEMENT_BOTTOM_LIMIT, FIRST_BOT_PLACEMENT_TOP_LIMIT, allPlacementCommands);
        } else if (probability <= PROBABILITY_PLACEMENT_7TO12_BOT) {
            placementCommand = this.findPlacementScoreRange(SECOND_BOT_PLACEMENT_BOTTOM_LIMIT, SECOND_BOT_PLACEMENT_TOP_LIMIT, allPlacementCommands);
        } else {
            placementCommand = this.findPlacementScoreRange(THIRD_BOT_PLACEMENT_BOTTOM_LIMIT, THIRD_BOT_PLACEMENT_TOP_LIMIT, allPlacementCommands);
        }

        return placementCommand.split(' ');
    }

    static findPlacementScoreRange(minScore: number, maxScore: number, commandPlacements: PlacementScore[]): string {
        if (commandPlacements.length === 0) return '!passer';
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
                    try {
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
                    } catch {
                        continue;
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
        if (tiles.length === 0) {
            const tilePlacement: TilePlacementPossible = {
                tile: gameBoard.cases[CENTER_ROW_COLUMN][CENTER_ROW_COLUMN],
                orientation: 'h',
            };
            tiles.push(tilePlacement);
        }
        const tilesShuffled = this.shuffleArray(tiles);
        return tilesShuffled;
    }

    static shuffleArray<T>(array: T[]): T[] {
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
        const combinations: string[] = [];
        if (chars.indexOf('*') !== INDEX_OF_NOT_FOUND) {
            chars[chars.indexOf('*')] = this.getRandomLetterForBlank();
        }
        const separationFunction = (prefix: string, array: string[]) => {
            for (let i = 0; i < array.length; i++) {
                combinations.push(prefix + array[i]);
                separationFunction(prefix + array[i], array.slice(i + 1));
            }
        };
        separationFunction('', chars);
        return combinations;
    }

    static getRandomLetterForBlank(): string {
        const randomLetters = ['A', 'E', 'I', 'L', 'O', 'N', 'T', 'S'];
        return randomLetters[Math.floor(Math.random() * randomLetters.length)];
    }

    static exchangeLettersCommand(game: Game): string[] {
        if (game.reserveLetters.letters.length === 0) {
            return '!passer'.split(' ');
        }
        const virtualPlayerLetters = game.playerTurn().lettersToStringArray();
        let command = '!échanger ';

        const letters = virtualPlayerLetters
            .sort(() => Math.random() - Math.random())
            .splice(0, Math.floor(Math.random() * virtualPlayerLetters.length));
        if (letters.length === 0) command = command.concat(virtualPlayerLetters[0]);
        command = command.concat(letters.join('')).toLowerCase();
        return command.split(' ');
    }

    static getProbability(): number {
        return Math.floor(Math.random() * PROBABILITY_TOTAL);
    }
}
