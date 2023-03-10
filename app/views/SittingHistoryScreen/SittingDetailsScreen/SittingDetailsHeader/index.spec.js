import React from 'react';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import SittingDetailsHeader from './index';
import { ArrowLeft } from '../../../shared/Icon';
import { MediumBoldText } from '../../../shared/Text';
import { TouchableOpacity, Image } from 'react-native';
describe('SittingDetailsHeader', () => {
    const selectedSeekersButton =
        'sittingDetailsHeader__selectedSeekers--button';
    const backButton = 'sittingDetailsHeader__back--button';
    const Component = props => {
        return render(<SittingDetailsHeader {...props} />);
    };

    it('Should render an ArrowLeft component', () => {
        const { container } = Component();
        expect(container.findByType(ArrowLeft)).toBeDefined();
    });

    it('Should render a BackButton component when hideBackButton is false', () => {
        const { container } = Component({ hideBackButton: false });
        expect(find(container, backButton)).toBeDefined();
    });
    it('Should not render a BackButton component when hideBackButton is true', () => {
        const { container } = Component({ hideBackButton: true });
        expect(container.findAllByType(backButton)).toHaveLength(0);
    });
    it('Should render a MediumBoldText component for rendering title', () => {
        const { container } = Component({
            selectedSeekersCount: 1,
            showRightIcon: false,
        });
        expect(container.findByType(MediumBoldText)).toBeDefined();
    });
    it('Should render 2 MediumBoldText component when selectedSeekersCount is greater than zero', () => {
        const { container } = Component({
            selectedSeekersCount: 3,
            showRightIcon: true,
        });
        expect(container.findAllByType(MediumBoldText)).toHaveLength(2);
    });
    it('Should have 2 TouchableOpacity component', () => {
        const { container } = Component();
        expect(container.findAllByType(TouchableOpacity)).toHaveLength(2);
    });
    it('Should render an Image component', () => {
        const { container } = Component({ showRightIcon: true });
        expect(container.findByType(Image)).toBeDefined();
    });
    it('Should call onBackPress when user press on back button', () => {
        const onBackPressMock = jest.fn();
        const { container } = Component({
            onBackPress: onBackPressMock,
        });
        fireEvent(find(container, backButton), 'Press');
        expect(onBackPressMock).toHaveBeenCalled();
    });
    it('Should call onSelectedSeekersPress when user press on selectedSeekersButton', () => {
        const onSelectedSeekersPressMock = jest.fn();
        const { container } = Component({
            onSelectedSeekersPress: onSelectedSeekersPressMock,
        });
        fireEvent(find(container, selectedSeekersButton), 'Press');
        expect(onSelectedSeekersPressMock).toHaveBeenCalled();
    });
});
