import React from 'react';
import NewToHeartfulnessScreen from './NewToHeartfulnessScreen';
import { render, fireEvent, find } from '../../utils/TestUtils';
import { CarouselCardData } from './CarouselCardData';
import CarouselCard from './CarouselCard';
import PageControl from 'react-native-page-control';
import { BoldText } from '../shared';

describe('NewToHeartfulnessScreen', () => {
    const proceedButton = 'newToHeartfulnessScreen_proceed--button';
    const skipButton = 'newToHeartfulnessScreen_skip--button'
    const Component = (props) => render(<NewToHeartfulnessScreen content={CarouselCardData[0]} {...props} />);

    it('Should have a BoldText component', () => {
        const { container } =
            Component({
                enableProceedButton: false,
                selectedIndex: 1,
            },
            );
        expect(container.findAllByType(BoldText)).toHaveLength(1);
    });

    it('Should have a CarouselCard component', () => {
        const { container } =
            Component({
                enableProceedButton: false,
                selectedIndex: 1,
            },
            );
        expect(container.findAllByType(CarouselCard)).toHaveLength(1);
    });
    it('Should have a PageControl component', () => {
        const { container } =
            Component({
                enableProceedButton: false,
                selectedIndex: 1,
            },
            );
        expect(container.findAllByType(PageControl)).toHaveLength(1);
    });
    describe('#SkipButton', () => {
        it('Should have a skip button', () => {
            const { container } =
                Component({
                    enableProceedButton: false,
                },
                );
            expect(find(container, skipButton)).toBeDefined();
        });
        it('Should able to call onSkipPress event, when SkipButton is pressed', () => {
            const onSkipPressMock = jest.fn();
            const { container } =
                Component({
                    onSkipPress: onSkipPressMock,
                },
                );
            fireEvent.press(find(container, skipButton));
            expect(onSkipPressMock).toHaveBeenCalled();
        });
    })
    describe('#ProceedButton', () => {
        it('Should have a proceed button', () => {
            const { container } =
                Component({
                    enableProceedButton: false,
                },
                );
            expect(find(container, skipButton)).toBeDefined();
        });
        it('Should able to disable proceed button, when enableProceedButton is false', () => {
            const { container } =
                Component({
                    enableProceedButton: false,
                },
                );
            expect(find(container, proceedButton).props.disabled).toBe(
                true,
            );
        });
        it('Should able to call onPressProceedButton event, when ProceedButton is pressed', () => {
            const onPressProceedButtondMock = jest.fn();
            const { container } =
                Component({
                    onPressProceedButton: onPressProceedButtondMock,
                },
                );
            fireEvent.press(find(container, proceedButton));
            expect(onPressProceedButtondMock).toHaveBeenCalled();
        });
    });
    it('Should able to call onPressCarouselCard event, when Carousel card pressed', () => {
        const onPressCarouselCardMock = jest.fn();
        const { container } =
            Component({
                enableProceedButton: true,
                selectedIndex: 1,
                onPressCarouselCard: onPressCarouselCardMock,
            },
            );
        fireEvent.press(container.findByType(CarouselCard));
        expect(onPressCarouselCardMock).toHaveBeenCalled();
    });
});
