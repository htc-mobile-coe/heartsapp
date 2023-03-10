import React from 'react';
import { Image, ScrollView } from 'react-native';
import OptionsScreenHeader from '../../../shared/OptionsScreenHeader';
import { Button } from '../../../shared';
import { Text } from 'app/views/shared/Text';
import SelectedSeekers from './SelectedSeekers';
import SelectedSeekersItem from './SelectedSeekersItem';
import { render, fireEvent, find } from 'app/utils/TestUtils';

describe('SelectedSeekers', () => {
    const goToSessionDetailsButton =
        'selectedSeekers__goToSessionDetails--button';
    const noSeekersFoundImage = 'selectedSeekers__noSeekersFound--Image';
    const selectedSeekersLengthText = 'selectedSeekers__selectedSeekersLength--text';
    const seekersAddedText = 'selectedSeekers__seekersAdded--text';
    const emptySelectedSeekersListMock = [];
    const selectedSeekersListMock = [
        {
            name: 'Hemadevi Peri',
            seekerId: 'HFN 228971',
            phoneNo: '+91 99623 88246',
            email: 'Hemadevipadma@Mail.com',
        },
    ];

    const Component = props => {
        return render(<SelectedSeekers {...props} />);
    };

    it('Should exist', () => {
        const { container } = Component({
            selectedSeekersList: emptySelectedSeekersListMock,
        });
        expect(container).toBeDefined();
    });

    it('Should render a MediumBoldText and Text component when selectedSeekersList has some entries', () => {
        const { container } = Component({
            selectedSeekersList: selectedSeekersListMock,
        });
        expect(find(container, selectedSeekersLengthText)).toBeDefined();
        expect(find(container, seekersAddedText)).toBeDefined();
    });

    it('Should render a Text component when selectedSeekersList is empty', () => {
        const { container } = Component();
        expect(container.findByType(Text)).toBeDefined();
    });

    it('Should render a Button component when selectedSeekersList has some entries', () => {
        const { container } = Component({
            selectedSeekersList: selectedSeekersListMock,
        });
        expect(container.findByType(Button)).toBeDefined();
    });

    it('Should render 1 Image component when selectedSeekersList is empty', () => {
        const { container } = Component({
            selectedSeekersList: emptySelectedSeekersListMock,
        });
        expect(container.findByType(Image)).toBeDefined();
    });

    it('Should render 1 OptionsScreenHeader component', () => {
        const { container } = Component({
            selectedSeekersList: emptySelectedSeekersListMock,
        });
        expect(container.findByType(OptionsScreenHeader)).toBeDefined();
    });

    it('Should render 1 ScrollView component', () => {
        const { container } = Component({
            selectedSeekersList: emptySelectedSeekersListMock,
        });
        expect(container.findByType(ScrollView)).toBeDefined();
    });

    it('Should render 1 SelectedSeekersItem component when selectedSeekersList has some entries', () => {
        const { container } = Component({
            selectedSeekersList: selectedSeekersListMock,
        });
        expect(container.findByType(SelectedSeekersItem)).toBeDefined();
    });

    it('Should not render SelectedSeekersItem component when selectedSeekersList is not rendered', () => {
        const { container } = Component();
        expect(container.findAllByType(SelectedSeekersItem)).toHaveLength(0);
    });

    it('Should call onBackPress when back button is pressed', () => {
        const onBackPressMock = jest.fn();
        const { container } = Component({
            selectedSeekersList: emptySelectedSeekersListMock,
            onBackPress: onBackPressMock,
        });
        fireEvent(container.findByType(OptionsScreenHeader), 'BackPress');
        expect(onBackPressMock).toBeCalled();
    });

    it('Should call onGoToSessionDetailsPress when go to session details button is pressed', () => {
        const onGoToSessionDetailsPressMock = jest.fn();
        const { container } = Component({
            selectedSeekersList: selectedSeekersListMock,
            onGoToSessionDetailsPress: onGoToSessionDetailsPressMock,
        });
        fireEvent(find(container, goToSessionDetailsButton), 'Press');
        expect(onGoToSessionDetailsPressMock).toBeCalled();
    });

    it('Should render noSeekersFound image', () => {
        const imageMock = require('./img/classic/noSeekersFound.png');
        const { container } = Component({
            selectedSeekersList: emptySelectedSeekersListMock,
            imageSource: imageMock,
        });

        expect(find(container, noSeekersFoundImage)).toHaveProp('source',
            imageMock,
        );
    });
});
