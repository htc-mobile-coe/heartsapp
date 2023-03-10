import React from 'react';
import SessionConductedByYouCountCard from './SessionConductedByYouCountCard';
import { render, fireEvent, find, findByProps } from '../../utils/TestUtils';
import { Image } from 'react-native';
import { BoldText, Text } from '../shared/Text';

describe('SessionConductedByYouCountCard', () => {
    const image = 'sessionConductedByYouCountCard--Image';
    const addButton = 'sessionConductedByYouCountCard--addButton';
    const Component = (props) => render(<SessionConductedByYouCountCard {...props} />);

    it('Should have 1 BoldText component for displaying session conducted by you count', () => {
        const { container } = Component({});
        expect(container.findAllByType(BoldText)).toHaveLength(1);
    });

    it('Should have 1 Text component for SubTitle', () => {
        const { container } = Component({});
        expect(container.findAllByType(Text)).toHaveLength(1);
    });

    it('Should have 2 Text component when showAddButton is true', () => {
        const { container } = Component({
            showAddButton: true,
        });
        expect(container.findAllByType(Text)).toHaveLength(2);
    });

    it('Should have 1 Image when showAddButton is false', () => {
        const { container } = Component({});
        expect(container.findAllByType(Image)).toHaveLength(1);
    });

    it('Should call onAddOfflineSittingPress when user press addOfflineSittingButton', () => {
        const onAddButtonPressMock = jest.fn();
        const { container } = Component({
            onAddButtonPress: onAddButtonPressMock,
            showAddButton: true,
        });
        fireEvent.press(find(container, addButton), 'Press');
        expect(onAddButtonPressMock).toHaveBeenCalled();
    });
    it('Should show countOfSittingsGiven value in BoldText', () => {
        const countOfSittingsGivenMock = '100';
        const { container } = Component({
            countOfSittingsGiven: countOfSittingsGivenMock,

        });
        
        expect(container.findByType(BoldText)).toHaveProp('children', countOfSittingsGivenMock);
    });

    it('Should render image', () => {
        const imageMock = require('./img/peach/life_style.png');
        const { container } = Component({
            imageSource: imageMock,

        });
        expect(container.findAllByType(Image)).toHaveLength(1);
        expect(findByProps(container, 'source', imageMock)).toBeDefined();
    });
});
