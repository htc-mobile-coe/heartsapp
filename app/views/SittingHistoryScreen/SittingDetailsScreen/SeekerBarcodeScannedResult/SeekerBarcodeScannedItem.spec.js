import React from 'react';
import SeekerBarcodeScannedItem from './SeekerBarcodeScannedItem';
import { Image } from 'react-native';
import { MediumBoldText, Text } from '../../../shared/Text';
import { render, find } from 'app/utils/TestUtils';

describe('SeekerBarcodeScannedItem', () => {
    const userImage = 'seekerBarcodeScannedItem__user--Image';
    const personImage = 'seekerBarcodeScannedItem__person--Image';
    const idCardImage = 'seekerBarcodeScannedItem__idCard--Image';
    const itemMock = {
        id: 'HFN123',
        name: 'User name 1',
        userImage: 'https://picsum.photos/300/300?random=1',
    };

    const Component = props => {
        return render(<SeekerBarcodeScannedItem {...props} />);
    };

    it('Should exist', () => {
        const { container } = Component({
            item: itemMock,
        });
        expect(container).toBeDefined();
    });

    it('Should render 1 MediumBoldText component to display the name', () => {
        const { container } = Component({
            item: itemMock,
        });
        expect(container.findByType(MediumBoldText)).toBeDefined();
    });

    it('Should render 1 Text component for HFN ID', () => {
        const { container } = Component({
            item: itemMock,
        });
        expect(container.findByType(Text)).toBeDefined();
    });

    it('Should render 3 Image component for Profile picture, person icon & id card icon', () => {
        const { container } = Component({
            item: itemMock,
        });
        expect(container.findAllByType(Image)).toHaveLength(3);
    });

    it('Should render user image when userImage is available', () => {
        const { container } = Component({
            item: itemMock,
        });

        expect(find(container, userImage)).toHaveProp('source', {
            uri: itemMock.userImage,
        });
    });

    it('Should render default avatar image when userImage is not available', () => {
        const imageMock = require('./img/classic/avatar.png');
        const { container } = Component({
            item: {
                id: 'HFN123',
                name: 'User name 1',
            },
        });

        expect(find(container, userImage)).toHaveProp('source', imageMock);
    });

    it('Should render person image', () => {
        const imageMock = require('./img/classic/person.png');
        const { container } = Component({
            item: itemMock,
            imageSource: imageMock,
        });

        expect(find(container, personImage)).toHaveProp('source', imageMock);
    });

    it('Should render idCard image', () => {
        const imageMock = require('./img/classic/id_card.png');
        const { container } = Component({
            item: itemMock,
            imageSource: imageMock,
        });

        expect(find(container, idCardImage)).toHaveProp('source', imageMock);
    });
});
