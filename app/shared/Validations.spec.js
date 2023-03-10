import {
    required,
    email,
    date,
    dateWithoutDay,
    reCheckPassword,
} from './Validations';

describe('Validations', () => {
    describe('#Required', () => {
        it('should fail if value is undefined', () => {
            expect(required()).toEqual('Required');
        });

        it('should fail if value is null', () => {
            expect(required(null)).toEqual('Required');
        });

        it('should fail if value is empty', () => {
            expect(required('')).toEqual('Required');
        });

        it('should pass if value is not empty', () => {
            expect(required('test')).toBeUndefined();
        });
    });

    describe('#Email', () => {
        it('should fail if value is not a email', () => {
            expect(email('test')).toEqual('Invalid email');
        });

        it('should pass if value is not empty', () => {
            expect(email('')).toBeUndefined();
        });

        it('should pass if value is a valid email', () => {
            expect(email('test@mock.com')).toBeUndefined();
        });
    });
    describe('#Date', () => {
        it('should fail if value is not a Date of format DD/MM/YYYY e.g. 01/01/1970', () => {
            expect(date('test')).toBe(false);
        });

        it('should pass if value is not empty', () => {
            expect(date('')).toBe(true);
        });

        it('should pass if value is a valid Date', () => {
            expect(date('01/01/1970')).toBe(true);
        });
    });
    describe('#DateWithoutDay', () => {
        it('should fail if value is not a Date of format MM/YYYY e.g. 01/1970', () => {
            expect(dateWithoutDay('test')).toBe(false);
        });

        it('should pass if value is not empty', () => {
            expect(dateWithoutDay('')).toBe(true);
        });

        it('should pass if value is a valid Date', () => {
            expect(dateWithoutDay('01/1970')).toBe(true);
        });
    });

    describe('#reCheckPassword', () => {
        it('should fail if passwords dont match', () => {
            expect(reCheckPassword('test', 'abc')).toEqual('Re-Enter Password');
        });

        it('should pass if value is not empty', () => {
            expect(reCheckPassword('')).toBeUndefined();
        });

        it('should pass if password values are equal', () => {
            expect(reCheckPassword('test', 'test')).toBeUndefined();
        });
    });
});
