import { Pipe, PipeTransform } from '@angular/core';
import * as constants from '@app/constants/general-constants';

@Pipe({
    name: 'formatTime',
})
export class FormatTimePipe implements PipeTransform {
    transform(value: number): string {
        const minutes: number = Math.floor(value / constants.SECONDS_IN_MINUTE);
        return (
            ('0' + minutes).slice(constants.MINUTES_SLICE) +
            ':' +
            ('00' + Math.floor(value - minutes * constants.SECONDS_IN_MINUTE)).slice(constants.SECONDS_SLICE)
        );
    }
}
