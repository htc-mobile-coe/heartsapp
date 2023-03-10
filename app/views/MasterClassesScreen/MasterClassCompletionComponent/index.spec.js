import React from 'react';
import MasterClassCompletionComponent from './index';
import { render, find, fireEvent } from 'app/utils/TestUtils';
import Carousel from './Carousel';

describe('MasterClassCompletionComponent', () => {
    const homeButton = 'MasterClassCompletionComponent_home--button';
    const backButton = 'MasterClassCompletionComponent_back--button';
    const continueButton = 'MasterClassCompletionComponent_continue--button';

    const Component = props => {
        return render(<MasterClassCompletionComponent
            content={'DAY_1_CONGRATULATIONS'}
            {...props}
        />);
    };
    it('Should have a Carousel component', () => {
        const { container } = Component({
            enableProceedButton: false,
            currentPageIndex: 1,
        });
        expect(container.findByType(Carousel)).toBeDefined();
    });

    it('Should able to call onBackPress event when user clicks on back button', () => {
        const onBackPressMock = jest.fn();
        const { container } = Component({
            enableHomeButton: false,
            onBackPress: onBackPressMock,
        });
        expect(find(container, backButton)).toBeDefined();
        fireEvent(find(container, backButton),'Press');
        expect(onBackPressMock).toBeCalled();
    });

    describe('#HomeButton', () => {
        it('Should able to render home button and button is enabled', () => {
            const { container } = Component({
                enableHomeButton: true,
                showHomeButton: true,
            });
            expect(find(container, homeButton)).toHaveProp('disabled', false);
        });
        it('Should able to render Home button and the button is disabled when enableHomeButton is false', () => {
            const { container } = Component({
                enableHomeButton: false,
                showHomeButton: true,
            });
            expect(find(container, homeButton)).toHaveProp('disabled', true);
        });
    });
    describe('#ContinueButton', () => {
        it('Should able to to render continue button and button is enabled', () => {
            const { container } = Component({
                enableContinueButton: true,
                showContinueButton: true,
            });
            expect(find(container, continueButton)).toHaveProp('disabled', false);
        });
        it('Should able to render continue button and button is disabled when enableContinueButton is false', () => {
            const { container } = Component({
                enableContinueButton: false,
                showContinueButton: true,
            });
            expect(find(container, continueButton)).toHaveProp('disabled', true);
        });
    });
    it('Should able to call onCarouselCardPress event, when Carousel card is pressed', () => {
        const onCarouselCardPressMock = jest.fn();
        const { container } = Component({
            enableHomeButton: true,
            currentPageIndex: 1,
            onCarouselCardPress: onCarouselCardPressMock,
        });
        fireEvent(container.findByType(Carousel), 'Press');
        expect(onCarouselCardPressMock).toBeCalled();
    });
});
