import { Orientation } from '@common/orientation';

export interface PlacementInformations {
    row: number;
    column: number;
    letters: string[];
    orientation: Orientation;
    numberLetters: number;
}
