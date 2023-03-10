import moment from 'moment';
export const getMorningMinTime = () => {
    const morningMinTime = new Date();
    morningMinTime.setHours(0);
    morningMinTime.setMinutes(0);
    morningMinTime.setMilliseconds(0);
    return morningMinTime;
};

export const getEveningMinTime = () => {
    const eveningMinTime = new Date();
    eveningMinTime.setHours(12);
    eveningMinTime.setMinutes(0);
    eveningMinTime.setMilliseconds(0);
    return eveningMinTime;
};

export const getMorningMaxTime = () => {
    const morningMaxTime = new Date();
    morningMaxTime.setHours(11);
    morningMaxTime.setMinutes(59);
    morningMaxTime.setMilliseconds(59);
    return morningMaxTime;
};

export const getEveningMaxTime = () => {
    const eveningMaxTime = new Date();
    eveningMaxTime.setHours(23);
    eveningMaxTime.setMinutes(59);
    eveningMaxTime.setMilliseconds(59);
    return eveningMaxTime;
};

export const getSelectedTime = choosenTime => {
    const dateString = new Date().toDateString();
    const dateTimeObj = moment(dateString + ' ' + choosenTime).toDate();
    return dateTimeObj;
};

export const getSelectedDate = choosenTime => {
    const timeChoosen = getSelectedTime(choosenTime);
    const currentDate = new Date();
    if (timeChoosen.getTime() < currentDate.getTime()) {
        const tomorrow = moment(currentDate)
            .add(1, 'days')
            .toDate()
            .toDateString();
        return moment(tomorrow + ' ' + choosenTime).toDate();
    }
    return timeChoosen;
};

export const getCalculatedTime = datePassed => {
    const date = new Date(datePassed);
    const calculatedTime = moment(date).format('HH:mm');
    return calculatedTime;
};

export const convertTimeto12HourFormat = time => {
    const timeChoosen = moment(time, ['HH:mm']).format('hh:mm');
    return timeChoosen;
};
export const convertTimeto12HourFormatWithAMPMString = time => {
    const timeChoosen = moment(time, ['HH:mm']).format('hh:mm A');
    return timeChoosen;
};
