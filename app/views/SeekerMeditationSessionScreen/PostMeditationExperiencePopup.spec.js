import React from 'react';
import { Textarea } from '../shared';
import TileBox from './TileBox';
import PostMeditationExperiencePopup from './PostMeditationExperiencePopup';
import { render, fireEvent, find } from 'app/utils/TestUtils';

describe('PostMeditationExperiencePopup', () => {
    const skipButton = 'postMeditationExperiencePopup_skip--button';
    const submitButton = 'postMeditationExperiencePopup__submit--button';
    const noInternetText = 'postMeditationExperiencePopup__noInternet--text';
    const headingText = 'postMeditationExperiencePopup__heading--text';
    const titleText = 'postMeditationExperiencePopup__heading--text';

    const Component = props => {
        return render(<PostMeditationExperiencePopup {...props} />);
    };

    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });

    it('Should render TileBox for PostMeditationExperienceOptions', () => {
        const postMeditationExperienceOptions = [
            {
                id: 5,
                title: 'Relaxed',
                image: 'relaxedImage',
                imageDisabled: 'relaxedDisabledImage',
                isSelected: false,
            },
        ];
        const onTileButtonPressMock = jest.fn();
        const { container } = Component({
            onTileButtonPress: onTileButtonPressMock,
            postMeditationExperienceOptions,
        });
        expect(container.findByType(TileBox)).toBeDefined();
    });

    it('Should render Textarea for Word for your experience', () => {
        const { container } = Component({});
        expect(container.findByType(Textarea)).toBeDefined();
    });

    it('Should render noInternetText component when internet is not available', () => {
        const { queryByTestId } = Component({
            isApplicationServerReachable: false,
        });
        expect(queryByTestId(noInternetText)).toBeDefined();
    });

    it('Should not render noInternetText component when internet is available', () => {
        const { queryByTestId } = Component({
            isApplicationServerReachable: true,
        });
        expect(queryByTestId(noInternetText)).toBeNull();
    });

    it('Should render a headingText component', () => {
        const { container } = Component({});
        expect(find(container, headingText)).toBeDefined();
    });
    it('Should render a titleText component', () => {
        const { container } = Component({});
        expect(find(container, titleText)).toBeDefined();
    });

    it('Should fire onPostMeditationExperienceOptionPress event when tile is pressed', () => {
        const postMeditationExperienceOptions = [
            {
                id: 5,
                title: 'Relaxed',
                image: 'relaxedImage',
                imageDisabled: 'relaxedDisabledImage',
                isSelected: false,
            },
        ];
        const onPostMeditationExperienceOptionPressMock = jest.fn();
        const { container } = Component({
            onPostMeditationExperienceOptionPress: onPostMeditationExperienceOptionPressMock,
            selectedPostMeditationExperienceOption: 5,
            postMeditationExperienceOptions,
        });
        fireEvent(container.findByType(TileBox), 'Press');
        expect(onPostMeditationExperienceOptionPressMock).toBeCalled();
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
        fireEvent(container.findByType(Textarea), 'ChangeText');
        expect(
            onPostMeditationExperienceFeedbackTextChangeMock,
        ).toHaveBeenCalled();
    });

    it('Should have Textarea style as enabled when enablePostMeditationExperienceModalTextarea is true', () => {
        const { container } = Component({
            enablePostMeditationExperienceModalTextarea: true,
        });

        expect(container.findByType(Textarea)).toHaveProp('itemStyle', { borderColor: '#1DA1F2' });
    });

    it('Should have Textarea style as disabled when enablePostMeditationExperienceModalTextarea is false', () => {
        const { container } = Component({
            enablePostMeditationExperienceModalTextarea: false,
        });

        expect(container.findByType(Textarea)).toHaveProp('itemStyle', { borderColor: '#C1C1C1' });
    });

    it('Textarea should be disabled when enablePostMeditationExperienceModalTextarea is false', () => {
        const { container } = Component({
            enablePostMeditationExperienceModalTextarea: false,
        });

        expect(container.findByType(Textarea)).toHaveProp('disabled', true);
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

        expect(container.findByType(Textarea)).toHaveProp('disabled', true);
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
});
