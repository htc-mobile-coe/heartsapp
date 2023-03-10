import React from 'react';
import Radio from '../shared/Radio';
import IntroductorySittingCompletionDetailsEnquiryScreen from './IntroductorySittingCompletionDetailsEnquiryScreen';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import { Text } from '../shared';
import { BoldText } from '../shared/Text';
import { MASTERCLASS_VIDEOS } from '../../shared/Constants';

describe('IntroductorySittingCompletionDetailsEnquiryScreen', () => {
    const submitButton =
        'introductorySittingCompletionDetailsEnquiryScreen_submit--button';
    const backButton =
        'introductorySittingCompletionDetailsEnquiryScreen_back--button';
    const introductorySittingDaysCompletionEnquiryOptionsRadioButton = 'introductorySittingDaysCompletionEnquiry__options--radio1';
    const approximateIntroductorySittingCompletionTimeOptionsRadioButton = 'introductorySittingDaysCompletionEnquiry__approximateIntroductorySittingCompletionTimeOptions--radio1';

    const Component = props => { 
        return render(<IntroductorySittingCompletionDetailsEnquiryScreen {...props} />); 
    };
    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });
    it('Should render 8 Radio buttons for introductory sitting completion detail enquiry & approximate completion time options', () => {
        const { container } = Component({});
        expect(container.findAllByType(Radio)).toHaveLength(8);
    });
    it('Should have three text component for title, enquiry question 1 & 2', () => {
        const { container } = Component({});
        expect(container.findAllByType(Text)).toHaveLength(3);
    });
    it('Should have a Bold text component for highlighted text', () => {
        const { container } = Component({});
        expect(container.findByType(BoldText)).toBeDefined();
    });
    it('Should have a back button', () => {
        const { container } = Component({});
        expect(find(container, backButton)).toBeDefined();
    });
    it('Should have a Submit button', () => {
        const { container } = Component({});
        expect(find(container, submitButton)).toBeDefined();
    });
    it('Should call back press event when user clicks on back button', () => {
        const onBackPressMock = jest.fn();
        const { container } = Component({
            onBackPress: onBackPressMock,
        });
        fireEvent(find(container, backButton), 'Press');

        expect(onBackPressMock).toHaveBeenCalled();
    });
    it('Should call submit press event when user clicks on Submit button', () => {
        const onSubmitPressMock = jest.fn();
        const { container } = Component({
            introductorySittingCompletionTimePeriod: null,
            onSubmitPress: onSubmitPressMock,
        });
        fireEvent(find(container, submitButton), 'Press');

        expect(onSubmitPressMock).toHaveBeenCalled();
    });

    it('Should call Introductory Sitting Day radio press event when user clicks on Days completion attestation radio button', () => {
        const onIntroductorySittingDayRadioPressMock = jest.fn();
        const { container } = Component({
            onIntroductorySittingDayRadioPress: onIntroductorySittingDayRadioPressMock,
        });
        fireEvent(find(container, introductorySittingDaysCompletionEnquiryOptionsRadioButton), 'Press', { id: MASTERCLASS_VIDEOS.DAY1 });

        expect(onIntroductorySittingDayRadioPressMock).toHaveBeenCalledWith({ id: MASTERCLASS_VIDEOS.DAY1 });
    });
    it('Should call Approximate Introductory Sitting completion time radio press event when user clicks on Approximate introductory sitting completion radio button', () => {
        const onApproximateIntroductorySittingCompletionTimeRadioPressMock = jest.fn();
        const { container } = Component({
            onApproximateIntroductorySittingCompletionTimeRadioPress: onApproximateIntroductorySittingCompletionTimeRadioPressMock,
        });
        fireEvent(find(container, approximateIntroductorySittingCompletionTimeOptionsRadioButton), 'Press', { id: 1 });

        expect(onApproximateIntroductorySittingCompletionTimeRadioPressMock).toHaveBeenCalledWith({ id: 1 });
    });
});