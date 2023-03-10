import React from 'react';
import { MediumBoldText, Text } from '../../../shared/Text';
import SelectedSeekersItem from './SelectedSeekersItem';
import { Image } from 'react-native';
import { render, find } from 'app/utils/TestUtils';

describe('SelectedSeekersItem', () => {
    const personImage = 'selectedSeekersItem__person--Image';
    const itemMock = {
        name: 'Hemadevi Peri',
        seekerId: 'HFN 228971',
        phoneNo: '+91 99623 88246',
        email: 'Hemadevipadma@Mail.com',
    };

    const Component = props => <SelectedSeekersItem {...props} />;

    it('Should exist', () => {
        const { container } = render(Component({
            item: itemMock,
        }));
        expect(container).toBeDefined();
    });

    it('Should render 1 MediumBoldText component to display the name', () => {
        const { container } = render(Component({
            item: itemMock,
        }));
        expect(container.findByType(MediumBoldText)).toBeDefined();
    });

    it('Should render 3 Text component for HFN Id, Phone number, Mail Id', () => {
        const { container } = render(Component({
            item: itemMock,
        }));
        expect(container.findAllByType(Text)).toHaveLength(3);
    });

    it('Should render 4 Image component to display the icons', () => {
        const { container } = render(Component({
            item: itemMock,
        }));
        expect(container.findAllByType(Image)).toHaveLength(4);
    });

    it('Should render person image', () => {
        const imageMock = require('./img/classic/person.png');
        const { container } = render(Component({
            item: itemMock,
            imageSource: imageMock,
        }));

        expect(find(container, personImage)).toHaveProp('source', imageMock);
    });
});
