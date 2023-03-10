// import React from 'react';
import { validate } from './SignUpScreen.service';

describe('SignUpFormService', () => {
    it('should validate all the fields as mandatory', () => {
        expect(
            validate({
                name: '',
                scrmid: '',
                doj: '',
                dob: '',
                email: '',
                password: '',
                repassword: '',
            }),
        ).toEqual({
            name: 'Required',
            scrmid: 'Required',
            doj: 'Required',
            dob: 'Required',
            email: 'Required',
            password: 'Required',
            repassword: 'Required',
        });
    });

    it('should validate email is a valid email', () => {
        expect(
            validate({
                email: 'test',
                password: 'simple',
                name: 'test',
                dob: '12/12/1990',
                doj: '12/1990',
                repassword: 'simple',
                scrmid: 'test',
            }),
        ).toEqual({
            email: 'Invalid email',
            password: undefined,
            name: undefined,
            doj: true,
            dob: true,
            repassword: undefined,
            scrmid: undefined,
        });
    });

    it('should validate date format of birth and joining', () => {
        expect(
            validate({
                password: 'simple',
                name: 'test',
                repassword: 'simple',
                email: 'test@test.com',
                scrmid: 'test',
                doj: 'test',
                dob: 'test',
            }),
        ).toEqual({
            doj: false,
            dob: false,
            password: undefined,
            name: undefined,
            repassword: undefined,
            email: undefined,
            scrmid: undefined,
        });
    });

    it('should validate all fields as valid if valid values are passed', () => {
        expect(
            validate({
                doj: '12/1990',
                dob: '12/12/1990',
                email: 'test@test.com',
                password: 'simple',
                name: 'test',
                repassword: 'simple',
                scrmid: 'test',
            }),
        ).toEqual({
            doj: true,
            dob: true,
            password: undefined,
            name: undefined,
            repassword: undefined,
            email: undefined,
            scrmid: undefined,
        });
    });
});
