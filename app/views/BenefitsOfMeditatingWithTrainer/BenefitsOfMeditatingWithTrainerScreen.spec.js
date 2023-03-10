import React from 'react';
import BenefitsOfMeditateWithTrainerScreen from './BenefitsOfMeditatingWithTrainerScreen';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import { benefitsCarouselCardData } from './BenefitsCarouselCardData';
import CarouselCard from './BenefitsCarouselCard';

describe('BenefitsOfMeditatingWithTrainerScreen', () => {
    const continueButton = 'benefitsOfMeditatingWithTrainer_continue--button';
    const backButton = 'benefitsOfMeditatingWithTrainer_back--button';
    const skipButton = 'benefitsOfMeditatingWithTrainer_skip--button';

    const Component = props => {
        return render(<BenefitsOfMeditateWithTrainerScreen
            content={benefitsCarouselCardData[0]}
            {...props}
        />);
    };

    it('Should have a BenefitsCarouselCard component', () => {
        const { container } = Component({
            enableProceedButton: false,
            selectedIndex: 1,
        });
        expect(container.findByType(CarouselCard)).toBeDefined();
    });

    it('Should able to fire back on Press', () => {
        const onBackPressMock = jest.fn();
        const { container } = Component({
            enableContinueButton: false,
            onBackPress: onBackPressMock,
        });
        expect(find(container, backButton)).toBeDefined();
        fireEvent(find(container, backButton), 'Press');
        expect(onBackPressMock).toBeCalled();
    });

    it('Should able to fire skip on Press', () => {
        const onSkipPressMock = jest.fn();
        const { container } = Component({
            enableContinueButton: false,
            onSkipPress: onSkipPressMock,
        });
        expect(find(container, skipButton)).toBeDefined();
        fireEvent(find(container, skipButton), 'Press');
        expect(onSkipPressMock).toBeCalled();
    });

    describe('#ContinueButton', () => {
        it('Should not able to disable continue button', () => {
            const { container } = Component({ enableContinueButton: true });
            expect(find(container, continueButton).props.disabled).toEqual(
                false,
            );
        });
        it('Should able to disable continue button', () => {
            const { container } = Component({ enableContinueButton: false });
            expect(find(container, continueButton).props.disabled).toEqual(
                true,
            );
        });
    });
    it('Should able to call onPress Carousel card', () => {
        const onPressCarouselCardMock = jest.fn();
        const { container } = Component({
            enableContinueButton: true,
            selectedIndex: 1,
            onPressCarouselCard: onPressCarouselCardMock,
        });
        fireEvent(container.findByType(CarouselCard), 'Press');
        expect(onPressCarouselCardMock).toBeCalled();
    });
});
