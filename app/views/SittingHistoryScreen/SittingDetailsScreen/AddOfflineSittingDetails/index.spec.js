import React from 'react';
import AddOfflineSittingDetails from './AddOfflineSittingDetails';
import { AddOfflineSittingDetailsContainer } from './index';
import { render, fireEvent } from 'app/utils/TestUtils';
import moment from 'moment';

describe('AddOfflineSittingDetailsContainer', () => {
    const valuesMock = {
        date: moment(),
        startTime: moment(),
        endTime: moment(),
        duration: '',
        numberOfPeople: 1,
        seekerList: [],
        comments: '',
    };
    const Component = props => {
        return render(<AddOfflineSittingDetailsContainer {...props} offlineSessionDetails={valuesMock}/>);
    };

    it('By default should have AddOfflineSittingDetails component', () => {
        const { container } = Component();
        expect(container.findByType(AddOfflineSittingDetails)).toBeDefined();
    });

    it('Should call onMultiSelectionDropDownRecentSeekerSelected when recent seeker is selected from multi selection drop down', () => {
        const onMultiSelectionDropDownRecentSeekerSelectedMock = jest.fn();
        const recentSeekersSelectedListMock = jest.fn();

        const { container } = Component({
            onMultiSelectionDropDownRecentSeekerSelected: onMultiSelectionDropDownRecentSeekerSelectedMock,
        });
        fireEvent(container.findByType(AddOfflineSittingDetails), 'RecentSeekerSelected', recentSeekersSelectedListMock);
        expect(onMultiSelectionDropDownRecentSeekerSelectedMock).toBeCalledWith(
            recentSeekersSelectedListMock,
        );
    });

    it('Should call onSubmitOfflineSittingForm when submit button is pressed', () => {
        const onSubmitOfflineSittingFormMock = jest.fn();

        const { container } = Component({
            onSubmitOfflineSittingForm: onSubmitOfflineSittingFormMock,
        });
        fireEvent(container.findByType(AddOfflineSittingDetails), 'Submit', {
            date: '2021-12-30',
            time: '10:00',
            numberOfPeople: '2',
            seekerList: [],
            comments: 'mockComment',
        });
        expect(onSubmitOfflineSittingFormMock).toBeCalledWith({
            date: '2021-12-30',
            time: '10:00',
            numberOfPeople: '2',
            seekerList: [],
            comments: 'mockComment',
        });
    });

    it('Should call onSeekerSelection when add image is pressed', () => {
        const onSeekerSelectionMock = jest.fn();

        const { container } = Component({
            onSeekerSelection: onSeekerSelectionMock,
        });
        fireEvent(container.findByType(AddOfflineSittingDetails), 'SeekerSelection', valuesMock);
        expect(onSeekerSelectionMock).toBeCalledWith(valuesMock);
    });
    it('Should call onRemoveSeeker when remove seeker is pressed', () => {
        const onRemoveSeekerMock = jest.fn();

        const { container } = Component({
            onRemoveSeeker: onRemoveSeekerMock,
        });
        fireEvent(container.findByType(AddOfflineSittingDetails), 'RemoveSeeker');
        expect(onRemoveSeekerMock).toBeCalled();
    });
});
