import moment from 'moment';

export const getFormattedTimeLeft = seconds => {
    const duration = moment.duration(seconds, 'seconds');
    if (seconds >= 0) {
        return `${String(duration.minutes()).padStart(2, '0')}:${String(
            duration.seconds(),
        ).padStart(2, '0')}`;
    }
    return undefined;
};

export const getFormattedTimeInMinutes = seconds => {
    const duration = moment.duration(parseInt(seconds, 0), 'seconds');
    return `${String(duration.minutes()).padStart(2, '0')} min`;
};

export const getFormattedTimeInMinutesAndSeconds = seconds => {
    const durationInMinutes = Math.round(seconds / 60);
    const durationInSeconds = Math.round(seconds % 60);
    return `${String(durationInMinutes).padStart(2, '0')}:${String(
        durationInSeconds,
    ).padStart(2, '0')}`;
};

export const isNightTime = () => {
    const hour = moment().hour();
    return hour < 7 || hour > 18;
};
export const checkIfTimeIsSameOrBeforeAnotherTime = (value, other) => {
    return moment(value, 'HH:mm A').isSameOrBefore(moment(other, 'HH:mm A'));
};
export const checkIfTimeIsSameOrAfterAnotherTime = (value, other) => {
    return moment(value, 'HH:mm A').isSameOrAfter(moment(other, 'HH:mm A'));
};
export const checkIfDurationIsLessThanOneHour = (startTime, endTime) => {
    const duration = moment(endTime, 'HH:mm A').diff(
        moment(startTime, 'HH:mm A'),
        'minutes',
    );
    return duration < 60;
};
