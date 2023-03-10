import {
    getMorningMinTime,
    getMorningMaxTime,
    getEveningMinTime,
    getEveningMaxTime,
    getSelectedTime,
    getSelectedDate,
    getCalculatedTime,
    convertTimeto12HourFormat,
} from './TimePickerUtils';
import moment from 'moment';

describe('TimePickerUtils', () => {
    it('Should able to get morning minimum time', () => {
        const value = getMorningMinTime();
        const morningMinTime = new Date();
        morningMinTime.setHours(0);
        morningMinTime.setMinutes(0);
        morningMinTime.setMilliseconds(0);
        expect(value.getHours()).toEqual(morningMinTime.getHours());
        expect(value.getMinutes()).toEqual(morningMinTime.getMinutes());
    });
    it('Should able to get evening minimum time', () => {
        const value = getEveningMinTime();
        const eveningMinTime = new Date();
        eveningMinTime.setHours(12);
        eveningMinTime.setMinutes(0);
        eveningMinTime.setMilliseconds(0);
        expect(value.getHours()).toEqual(eveningMinTime.getHours());
        expect(value.getMinutes()).toEqual(eveningMinTime.getMinutes());
    });
    it('Should able to get morning maximum time', () => {
        const value = getMorningMaxTime();
        const morningMaxTime = new Date();
        morningMaxTime.setHours(11);
        morningMaxTime.setMinutes(59);
        morningMaxTime.setMilliseconds(59);
        expect(value.getHours()).toEqual(morningMaxTime.getHours());
        expect(value.getMinutes()).toEqual(morningMaxTime.getMinutes());
    });
    it('Should able to get evening maximum time', () => {
        const value = getEveningMaxTime();
        const eveningMaxTime = new Date();
        eveningMaxTime.setHours(23);
        eveningMaxTime.setMinutes(59);
        eveningMaxTime.setMilliseconds(59);
        expect(value.getHours()).toEqual(eveningMaxTime.getHours());
        expect(value.getMinutes()).toEqual(eveningMaxTime.getMinutes());
    });
    it('Should able to get selected Time', () => {
        const choosenTime = '07:05';
        const value = getSelectedTime(choosenTime);
        const dateStr = new Date().toDateString();
        const resultTime = moment(dateStr + ' ' + choosenTime).toDate();
        expect(value).toEqual(resultTime);
    });
    it('Should able to get selected Date, if selected time is lesser than current time', () => {
        const choosenTime = getSelectedTime('06:05');
        const value = getSelectedDate('07:05');
        expect(value).not.toEqual(choosenTime);
    });
    it('Should able to get selected Date, if selected time is greater than current time', () => {
        const calculatedTime = moment(new Date())
            .add(2, 'hours')
            .format('HH:mm');
        const choosenTime = getSelectedTime(calculatedTime);
        const value = getSelectedDate(calculatedTime);
        expect(value).toEqual(choosenTime);
    });
    it('Should able to get calculated Time in hours and minutes', () => {
        const datePassed = new Date();
        datePassed.setHours(7);
        datePassed.setMinutes(59);
        datePassed.setMilliseconds(0);
        const value = getCalculatedTime(datePassed);
        expect(value).toEqual('07:59');
    });
    it('Should able to convert time to 12 hour format if hour exceeds 12', () => {
        const time = '14:05';
        const value = convertTimeto12HourFormat(time);
        expect(value).toEqual('02:05');
    });
    it('Should able to convert time to 12 hour format', () => {
        const time = '02:05';
        const value = convertTimeto12HourFormat(time);
        expect(value).toEqual('02:05');
    });
});
