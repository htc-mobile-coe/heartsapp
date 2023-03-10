import moment from 'moment';
import { isEmpty, isEqual } from 'lodash';

export const required = value =>
    value || typeof value === 'number' ? undefined : 'Required';
export const email = value =>
    value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
        ? 'Invalid email'
        : undefined;

export const date = value => {
    return isEmpty(value) || moment(value, ['DD/MM/YYYY'], true).isValid();
};

export const dateWithoutDay = value => {
    return isEmpty(value) || moment(value, ['MM/YYYY'], true).isValid();
};

export const reCheckPassword = (password, rePassword) => {
    return password && rePassword && !(password === rePassword)
        ? 'Re-Enter Password'
        : undefined;
};

export const match = (value, other) => {
    return isEqual(value, other);
};

export const phoneRegExp = /^(\+\d{1,3}[- ]?)?\d{10}$/;
export const phoneWithoutSpaceRegExp = /^(\+\d{1,3}[-]?)?\d{10}$/;
export const internationalPhoneRegExp = /^\+[1-9]{1}[0-9]{3,14}$/;
export const amountRegExp = /^\d*\.?(?:\d{1,2})?$/;
export const specialCharactersRegExp = /^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/;
export const nameRegExp = /^[a-zA-Z ]*$/;
export const commentSpecialCharactersRegExp = /^[A-Z0-9\n@~`!@#$%^&*()_=+\\\\';:\"\\/?>.<,-\w ]*$/i;
