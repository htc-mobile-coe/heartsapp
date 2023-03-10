import React from 'react';
import BarcodeScanner from './BarcodeScanner';
import { RNCamera } from 'react-native-camera';
import { Image, Modal } from 'react-native';
import { MediumBoldText, Text } from '../../../shared/Text';
import { render, fireEvent, find } from 'app/utils/TestUtils';

describe('BarcodeScanner', () => {
    const flashButton = 'barcodeScanner__flash_button';
    const flashImage = 'barcodeScanner__flash--Image';

    const Component = props => {
        return render(<BarcodeScanner {...props} />);
    };

    it('Should exist', () => {
        const { container } = Component();
        expect(container).toBeDefined();
    });

    it('Should render 1 MediumBoldText component', () => {
        const { container } = Component();
        expect(container.findByType(MediumBoldText)).toBeDefined();
    });

    it('Should render 1 Text component', () => {
        const { container } = Component();
        expect(container.findByType(Text)).toBeDefined();
    });

    it('Should render 2 Image component', () => {
        const { container } = Component();
        expect(container.findAllByType(Image)).toHaveLength(2);
    });

    it('Should render 1 flashButton component', () => {
        const { container } = Component();
        expect(find(container, flashButton)).toBeDefined();
    });

    it('Should render 1 Modal component', () => {
        const { container } = Component();
        expect(container.findByType(Modal)).toBeDefined();
    });

    it('Should render 1 RNCamera component', () => {
        const { container } = Component();
        expect(container.findByType(RNCamera)).toBeDefined();
    });

    it('Should call onBarcodeFlashPress when flash icon in barcode scanner is pressed', () => {
        const onBarcodeFlashPressMock = jest.fn();
        const { container } = Component({
            onBarcodeFlashPress: onBarcodeFlashPressMock,
        });

        fireEvent(find(container, flashButton),'Press');

        expect(onBarcodeFlashPressMock).toBeCalled();
    });

    it('Should call onBackPress when back button on barcode scanner is pressed', () => {
        const onBackPressMock = jest.fn();
        const { container } = Component({
            onBackPress: onBackPressMock,
        });

        fireEvent(container.findByType(Modal), 'RequestClose');

        expect(onBackPressMock).toBeCalled();
    });

    it('Should render flash image', () => {
        const imageMock = require('./img/classic/flash.png');
        const { container } = Component({
            imageSource: imageMock,
        });
        const barcodeFlashImage = find(container, flashImage);
        expect(barcodeFlashImage.props.source).toEqual(imageMock);
    });

    it('Should call onBarcodeRead when barcode is scanned', () => {
        const onBarcodeReadMock = jest.fn();
        const { container } = Component({
            onBarcodeRead: onBarcodeReadMock,
        });

        fireEvent(container.findByType(RNCamera), 'BarCodeRead', { data: 'barcodeScannedIdMock' });

        expect(onBarcodeReadMock).toHaveBeenCalledWith('barcodeScannedIdMock');
    });
});
