import React from 'react';
import Timer from './Timer';
import moment from 'moment';
import TimerService from './index.service';
import { isNil, padStart, isEqual } from 'lodash';

export class TimerContainer extends React.Component {
    constructor(props) {
        super(props);
        this.timerService = new TimerService();
    }

    state = {
        text: '',
        startTime: null,
        run: false,
        endTime: null,
    };

    adjustTimerService = () => {
        if (this.state.run) {
            this.timerService.start(this.updateTime);
        } else {
            this.timerService.stop();
            this.updateTime();
        }
    };

    componentDidMount = () => {
        this.adjustTimerService();
    };

    componentDidUpdate = prevProps => {
        if (!isEqual(this.props.run, prevProps.run)) {
            this.adjustTimerService();
        }
    };

    updateTime = () => {
        const { startTime, endTime } = this.state;
        const { isCountDown } = this.props;

        if (isNil(startTime) && !isCountDown) {
            this.setState({
                text: '',
            });
        } else {
            const then = isNil(endTime) ? moment() : endTime;
            const duration = isCountDown
                ? moment.duration(endTime.diff(moment()))
                : moment.duration(then.diff(startTime));

            const hours =
                duration.hours() > 0
                    ? padStart(duration.hours(), 2, '0') + ':'
                    : '';
            const minutes = padStart(
                duration.minutes() > 0 ? duration.minutes() : 0,
                2,
                '0',
            );
            const seconds = padStart(
                duration.seconds() > 0 ? duration.seconds() : 0,
                2,
                '0',
            );
            this.setState({
                text: `${hours}${minutes}:${seconds}`,
            });
        }
    };

    static getDerivedStateFromProps = (nextProps, prevState) => {
        return {
            ...prevState,
            startTime: nextProps.startTime,
            run: nextProps.run,
            endTime: nextProps.endTime,
        };
    };

    componentWillUnmount = () => {
        this.timerService.stop();
    };

    render() {
        const { text } = this.state;
        const {
            textStyle,
            unit,
            timerMinutesStyle,
            imageIconStyle,
            showWatchImage,
        } = this.props;

        return (
            <Timer
                value={text}
                textStyle={textStyle}
                unit={unit}
                timerMinutesStyle={timerMinutesStyle}
                imageIconStyle={imageIconStyle}
                showWatchImage={showWatchImage}
            />
        );
    }
}

export default TimerContainer;
