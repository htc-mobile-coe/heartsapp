import React from 'react';
import TimerService from './index.service';
import { TimerContainer } from './index';
import Timer from './Timer';
import { render, fireEvent } from 'TestUtils';
import moment from 'moment';

jest.mock('./index.service', () => {
    return jest.fn().mockImplementation(() => {
        return { start: () => {}, stop: () => {} };
    });
});

describe('TimerContainer', () => {
    jest.useFakeTimers();
    const startMock = jest.fn().mockImplementation((callback) => callback());
    const stopMock = jest.fn();
    const Component = (props) => {
        return render(<TimerContainer t={jest.fn()} {...props} />);
    };

    const dateMock = moment(1572393600000);
    let dateNowSpy;

    beforeAll(() => {
        dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => dateMock);
        TimerService.mockImplementation(() => {
            return {
                start: startMock,
                stop: stopMock,
            };
        });
    });
    beforeEach(() => {
        startMock.mockClear();
        stopMock.mockClear();
    });
    afterAll(() => {
        dateNowSpy.mockRestore();
    });
    it('Should have Timer component', () => {
        const { container } = Component();
        expect(container.findByType(Timer)).toBeDefined();
    });

    it('Should have initial value of text to be empty string', () => {
        const { container } = Component();
        expect(container.findByType(Timer)).toHaveProp('value', '');
    });

    it('Should able to start timer', () => {
        const { container } = Component({ run: true, startTime: dateMock });
        expect(container.findByType(Timer)).toHaveProp('value', '00:00');
        expect(startMock).toBeCalled();
    });
    it('Should able to start CountDown', () => {
        const { container } = Component({
            isCountDown: true,
            run: true,
            startTime: dateMock,
            endTime: moment(1572393600000).add(4, 'minutes'),
        });
        jest.runOnlyPendingTimers();
        expect(container.findByType(Timer)).toHaveProp('value', '04:00');
        expect(startMock).toBeCalled();
    });

    it('Should able to run CountDown with more than a hours', () => {
        const { container } = Component({
            isCountDown: true,
            run: true,
            startTime: dateMock,
            endTime: moment(1572398000000).add(4, 'minutes'),
        });
        jest.runOnlyPendingTimers();
        expect(container.findByType(Timer)).toHaveProp('value', '01:17:20');
        expect(startMock).toBeCalled();
    });

    it('Should able to stop timer', () => {
        const { container, update } = Component({
            isCountDown: true,
            run: true,
            startTime: dateMock,
            endTime: moment(1572393600000).add(4, 'minutes'),
        });
        update(
            <TimerContainer
                t={jest.fn()}
                isCountDown={true}
                run={false}
                startTime={dateMock}
                endTime={moment(1572393600000).add(4, 'minutes')}
            />,
        );
        expect(stopMock).toBeCalled();
    });
    it('Should able to stop timer. when component is unmount', () => {
        const { unmount } = Component({
            isCountDown: true,
            startTime: dateMock,
            endTime: moment(1572393600000).add(4, 'minutes'),
        });
        unmount();
        expect(stopMock).toBeCalled();
    });
});
