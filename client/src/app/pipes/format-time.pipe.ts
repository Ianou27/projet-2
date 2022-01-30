import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatTime',
})
export class FormatTimePipe implements PipeTransform {
    transform(value: number): string {
        const minutes: number = Math.floor(value / 60);
        return ('0' + minutes).slice(-1) + ':' + ('00' + Math.floor(value - minutes * 60)).slice(-2);
    }
}
