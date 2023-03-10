import {
    email as emailValidation,
    required,
    date as dateValidation,
    dateWithoutDay as dateWithoutDayValidation,
    reCheckPassword,
} from '../../shared/Validations';

export const validate = values => {
    const error = {};
    error.name = required(values.name);
    error.scrmid = required(values.scrmid);
    error.dob = required(values.dob);
    error.doj = required(values.doj);
    error.email = required(values.email);

    if (!error.email) {
        error.email = emailValidation(values.email);
    }
    if (!error.doj) {
        error.doj = dateWithoutDayValidation(values.doj);
    }
    if (!error.dob) {
        error.dob = dateValidation(values.dob);
    }
    error.password = required(values.password);
    error.repassword = required(values.repassword);
    if (!error.repassword) {
        error.repassword = reCheckPassword(values.repassword);
    }

    return error;
};
