import { FormatTimePipe } from './format-time.pipe';

describe('FormatTimePipe', () => {
    const twoMinutes = 120;
    const twoThirty = 150;
    const pipe = new FormatTimePipe();
    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('transforms 120 to 2:00', () => {
        expect(pipe.transform(twoMinutes)).toBe('2:00');
    });

    it('transforms 150 to 2:30', () => {
        expect(pipe.transform(twoThirty)).toBe('2:30');
    });
});
