import React from 'react';
import { Textarea, Text } from '../shared';
import PostMeditationExperiencePopup from './PostMeditationExperiencePopup';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import CheckBox from '../shared/CheckBox';
import { TextArea } from 'native-base';

describe('PostMeditationExperiencePopup', () => {
    const skipButton = 'postMeditationExperiencePopup_skip--button';
    const submitButton = 'postMeditationExperiencePopup__submit--button';
    const wordYourExperienceText = 'postMeditationExperiencePopup__wordYourExperience--text';

    const Component = props => {
        return render(<PostMeditationExperiencePopup {...props} />);
    };

    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });

    it('Should render Textarea for Word for your experience', () => {
        const { container } = Component({});
        expect(container.findByType(Textarea)).toBeDefined();
    });

    it('Should render 1 CheckBox component', () => {
        const { container } = Component({});
        expect(container.findByType(CheckBox)).toBeDefined();
    });

    it('Should render 2 Text component when internet is not available', () => {
        const { container } = Component({
            isApplicationServerReachable: false,
        });
        expect(container.findAllByType(Text)).toHaveLength(2);
    });

    it('Should render 1 Text component when internet is available', () => {
        const { container } = Component({
            isApplicationServerReachable: true,
        });
        expect(container.findByType(Text)).toBeDefined();
    });

    it('Should render a wordYourExperienceText component', () => {
        const { container } = Component({});
        expect(find(container, wordYourExperienceText)).toBeDefined();
    });

    it('Should fire onPostMeditationExperienceSkipPress event when Skip is pressed', () => {
        const onPostMeditationExperienceSkipPressMock = jest.fn();
        const { container } = Component({
            onPostMeditationExperienceSkipPress: onPostMeditationExperienceSkipPressMock,
        });
        expect(find(container, skipButton)).toBeDefined();
        fireEvent(find(container, skipButton), 'Press');
        expect(onPostMeditationExperienceSkipPressMock).toHaveBeenCalled();
    });

    it('Should fire onPostMeditationExperienceFeedbackTextChange event when Textarea value is changed', () => {
        const onPostMeditationExperienceFeedbackTextChangeMock = jest.fn();
        const { container } = Component({
            onPostMeditationExperienceFeedbackTextChange: onPostMeditationExperienceFeedbackTextChangeMock,
        });
        fireEvent(container.findByType(TextArea), 'ChangeText');
        expect(
            onPostMeditationExperienceFeedbackTextChangeMock,
        ).toHaveBeenCalled();
    });

    it('Should fire onPostMeditationExperienceCheckBoxChange event when Skip is pressed', () => {
        const onPostMeditationExperienceCheckBoxChangeMock = jest.fn();
        const { container } = Component({
            onPostMeditationExperienceCheckBoxChange: onPostMeditationExperienceCheckBoxChangeMock,
        });
        fireEvent(container.findByType(CheckBox), 'Press');
        expect(onPostMeditationExperienceCheckBoxChangeMock).toHaveBeenCalled();
    });

    it('Should fire onPostMeditationExperienceSubmitPress event when Submit is pressed', () => {
        const onPostMeditationExperienceSubmitPressMock = jest.fn();
        const { container } = Component({
            onPostMeditationExperienceSubmitPress: onPostMeditationExperienceSubmitPressMock,
        });
        expect(find(container, submitButton)).toBeDefined();
        fireEvent(find(container, submitButton), 'Press');
        expect(onPostMeditationExperienceSubmitPressMock).toHaveBeenCalled();
    });

    it('Submit button should be disabled when enablePostMeditationExperienceModalSubmitButton is false', () => {
        const { container } = Component({
            enablePostMeditationExperienceModalSubmitButton: false,
        });
        expect(find(container, submitButton)).toHaveProp('disabled', true);
    });

    it('Should have submit button style as enabled when enablePostMeditationExperienceModalSubmitButton is true', () => {
        const { container } = Component({
            enablePostMeditationExperienceModalSubmitButton: true,
        });
        expect(find(container, submitButton)).toHaveProp('style', {
            backgroundColor: '#1DA1F2',
            display: 'flex',
            justifyContent: 'center',
        });
    });

    it('Should have submit button style as disabled when enablePostMeditationExperienceModalSubmitButton is false', () => {
        const { container } = Component({
            enablePostMeditationExperienceModalSubmitButton: false,
        });
        expect(find(container, submitButton)).toHaveProp('style', {
            backgroundColor: '#C1C1C1',
            display: 'flex',
            justifyContent: 'center',
        });
    });

    it('Should have checkBox style as enabled when dontShowThisAgainChecked is true', () => {
        const { container } = Component({
            dontShowThisAgainChecked: true,
        });

        expect(container.findByType(CheckBox)).toHaveProp('style', {
            borderRadius: 0,
            borderColor: '#1DA1F2',
        });
    });

    it('Should have checkBox style as disabled when dontShowThisAgainChecked is false', () => {
        const { container } = Component({
            dontShowThisAgainChecked: false,
        });

        expect(container.findByType(CheckBox)).toHaveProp('style', {
            borderRadius: 0,
            borderColor: '#BEBEBE',
        });
    });

    it('Should have Textarea style as enabled when enablePostMeditationExperienceModalTextarea is true', () => {
        const { container } = Component({
            enablePostMeditationExperienceModalTextarea: true,
        });

        expect(container.findByType(Textarea)).toHaveProp('style', {
            borderColor: '#1DA1F2',
            borderRadius: 4,
            borderWidth: 1,
            flex: 1,
        });

        expect(container.findByType(Textarea)).toHaveProp('itemStyle', null);
    });

    it('Should have Textarea style as disabled when enablePostMeditationExperienceModalTextarea is false', () => {
        const { container } = Component({
            enablePostMeditationExperienceModalTextarea: false,
        });

        expect(container.findByType(Textarea)).toHaveProp('style', {
            borderColor: '#C1C1C1',
            borderRadius: 4,
            borderWidth: 1,
            flex: 1,
        });

        expect(container.findByType(Textarea)).toHaveProp('itemStyle', { borderColor: '#C1C1C1' });
    });
});
