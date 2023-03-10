import React from 'react';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import SittingHistoryHeader from './SittingHistoryHeader';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';
import DatePickerCard from './DatePickerCard';
import SessionCountCard from './SessionCountCard';
import DeliveryMode from './DeliveryMode';

describe('SittingHistoryHeader', () => {
    const fromDateInput = 'sittingHistoryScreen__fromDate--DatePickerCard';
    const toDateInput = 'sittingHistoryScreen__toDate--DatePickerCard';
    const tabTitleText = 'sittingHistoryHeader__tabTitle--text';
    const sittingListMock = [
        {
            date: '15th Sep 2021 - Wed',
            duration: '0 : 19',
            peopleAttended: 1,
            sessionId: 'sessionIdMock',
            startTime: '06:05 pm',
        },
    ];

    const Component = props => {
        return render(<SittingHistoryHeader {...props} />);
    };

    it('Should exist', () => {
        const { container } = Component({
            sittingList: sittingListMock,
        });
        expect(container).toBeDefined();
    });

    it('Should have a tabTitleText component tab bar title', () => {
        const { container } = Component({
            sittingList: sittingListMock,
        });
        expect(find(container, tabTitleText)).toBeDefined();
    });

    it('Should render 1 OptionsScreenHeader component', () => {
        const { container } = Component({
            sittingList: sittingListMock,
        });
        expect(container.findByType(OptionsScreenHeader)).toBeDefined();
    });

    it('Should have 2 DatePickerCard component', () => {
        const { container } = Component({
            sittingList: sittingListMock,
        });
        expect(container.findAllByType(DatePickerCard)).toHaveLength(2);
    });

    it('Should have 2 SessionCountCard component when sittingList is not empty', () => {
        const { container } = Component({
            sittingList: sittingListMock,
        });
        expect(container.findAllByType(SessionCountCard)).toHaveLength(2);
    });

    it('Should not have SessionCountCard component when sittingList is empty', () => {
        const { container } = Component({
            sittingList: [],
        });
        expect(container.findAllByType(SessionCountCard)).toHaveLength(0);
    });

    it('Should have 2 DeliveryMode component', () => {
        const { container } = Component({
            sittingList: sittingListMock,
        });
        expect(container.findAllByType(DeliveryMode)).toHaveLength(2);
    });

    it('Should call onBackPress when back buton is pressed', () => {
        const onBackPressMock = jest.fn();
        const { container } = Component({
            onBackPress: onBackPressMock,
            sittingList: sittingListMock,
        });
        fireEvent(container.findByType(OptionsScreenHeader), 'BackPress');
        expect(onBackPressMock).toHaveBeenCalled();
    });

    it('Should call onFromDateChange when fromDate is changed', () => {
        const onFromDateChangeMock = jest.fn();
        const { container } = Component({
            onFromDateChange: onFromDateChangeMock,
            sittingList: sittingListMock,
        });
        fireEvent(find(container, fromDateInput), 'DateChange');
        expect(onFromDateChangeMock).toHaveBeenCalled();
    });

    it('Should call onToDateChange when toDate is changed', () => {
        const onToDateChangeMock = jest.fn();
        const { container } = Component({
            onToDateChange: onToDateChangeMock,
            sittingList: sittingListMock,
        });
        fireEvent(find(container, toDateInput), 'DateChange');
        expect(onToDateChangeMock).toHaveBeenCalled();
    });
});
