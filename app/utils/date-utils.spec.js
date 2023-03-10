import {
    checkIfTimeIsSameOrBeforeAnotherTime,
    checkIfTimeIsSameOrAfterAnotherTime,
    checkIfDurationIsLessThanOneHour,
    getFormattedTimeInMinutesAndSeconds,
} from './date-utils';

describe('date-utils', () => {
    describe('#getFormattedTimeInMinutesAndSeconds', () => {
        it('should format less than hours', () => {
            expect(getFormattedTimeInMinutesAndSeconds(300)).toBe('05:00');
        });
        it('should format more than hours', () => {
            expect(getFormattedTimeInMinutesAndSeconds(5400)).toBe('90:00');
        });
    });
    describe('#checkIfTimeIsSameOrBeforeAnotherTime', () => {
        it('should fail if time value is greater than another time', () => {
            expect(
                checkIfTimeIsSameOrBeforeAnotherTime('11:00 AM', '10:55 AM'),
            ).toBe(false);
        });
        it('should pass if time value is same or less than another time', () => {
            expect(
                checkIfTimeIsSameOrBeforeAnotherTime('11:00 AM', '11:35 AM'),
            ).toBe(true);
        });
    });

    describe('#checkIfTimeIsSameOrAfterAnotherTime', () => {
        it('should fail if time value is less than another time', () => {
            expect(
                checkIfTimeIsSameOrAfterAnotherTime('11:00 AM', '11:35 AM'),
            ).toBe(false);
        });
        it('should pass if time value is same or greater than another time', () => {
            expect(
                checkIfTimeIsSameOrAfterAnotherTime('11:00 AM', '10:55 AM'),
            ).toBe(true);
        });
    });

    describe('#checkIfDurationIsLessThanOneHour', () => {
        it('should fail if time duration is greater than 60 minutes', () => {
            expect(
                checkIfDurationIsLessThanOneHour('11:00 AM', '12:35 PM'),
            ).toBe(false);
        });
        it('should pass if time duration is less than or equal to  60 minutes', () => {
            expect(
                checkIfDurationIsLessThanOneHour('11:00 AM', '11:30 AM'),
            ).toBe(true);
        });
    });
});
