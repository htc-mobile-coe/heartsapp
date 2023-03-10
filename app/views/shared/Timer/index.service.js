import { isNil } from 'lodash';

export default class TimerService {
    start = callback => {
        if (isNil(this.interval)) {
            this.interval = setInterval(callback, 1000);
        }
    };

    stop = () => {
        if (!isNil(this.interval)) {
            clearInterval(this.interval);
            this.interval = undefined;
        }
    };
}
