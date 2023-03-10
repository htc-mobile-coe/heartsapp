import React from 'react';
import SeekerBarcodeScannedResult from './SeekerBarcodeScannedResult';
import { ScrollView } from 'react-native';
import SittingDetailsHeader from '../SittingDetailsHeader';
import { Button } from '../../../shared';
import { Text } from '../../../shared/Text';
import SeekerBarcodeScannedItem from './SeekerBarcodeScannedItem';
import BarcodeScanner from './BarcodeScanner';
import { render, fireEvent, find } from 'app/utils/TestUtils';

describe('SeekerBarcodeScannedResult', () => {
    const barcodeButton = 'seekerBarcodeScannedResult__barcode_button';
    const barcodeImage = 'seekerBarcodeScannedResult__barcode--Image';
    const addSeekerButton = 'seekerBarcodeScannedResult__addSeeker--button';
    const noOfSeekersText = 'seekerBarcodeScannedResult__noOfSeekers_text';
    const seekerListMock = [];

    const Component = props => {
        return render(<SeekerBarcodeScannedResult {...props} />);
    };

    it('Should exist', () => {
        const { container } = Component({
            seekerList: seekerListMock,
        });
        expect(container).toBeDefined();
    });

    it('Should render noOfSeekersText component', () => {
        const { container } = Component({
            seekerList: seekerListMock,
        });
        expect(find(container, noOfSeekersText)).toBeDefined();
    });

    it('Should render 1 Text component to show HFN id', () => {
        const { container } = Component({
            seekerList: seekerListMock,
        });
        expect(container.findByType(Text)).toBeDefined();
    });

    it('Should render 1 Button component for Add Seeker', () => {
        const { container } = Component({
            seekerList: seekerListMock,
        });
        expect(container.findByType(Button)).toBeDefined();
    });

    it('Should render 1 SittingDetailsHeader component', () => {
        const { container } = Component({
            seekerList: seekerListMock,
        });
        expect(container.findByType(SittingDetailsHeader)).toBeDefined();
    });

    it('Should render 1 ScrollView component', () => {
        const { container } = Component({
            seekerList: seekerListMock,
        });
        expect(container.findByType(ScrollView)).toBeDefined();
    });

    it('Should render 1 SeekerBarcodeScannedItem component when seekerList is rendered', () => {
        const { container } = Component({
            seekerList: [
                {
                    id: 'HFN123',
                    name: 'User name 1',
                    userImage: 'https://picsum.photos/300/300?random=1',
                },
            ],
        });
        expect(container.findByType(SeekerBarcodeScannedItem)).toBeDefined();
    });

    it('Should render a barcodeImage component', () => {
        const { container } = Component({
            seekerList: seekerListMock,
        });
        expect(find(container, barcodeImage)).toBeDefined();
    });

    it('Should render a barcodeButton component', () => {
        const { container } = Component({
            seekerList: seekerListMock,
        });
        expect(find(container, barcodeButton)).toBeDefined();
    });

    it('Should render 1 BarcodeScanner component when showBarCodeScanner is true', () => {
        const { container } = Component({
            seekerList: seekerListMock,
            showBarCodeScanner: true,
        });
        expect(container.findByType(BarcodeScanner)).toBeDefined();
    });

    it('Should call onBackPress when back button is pressed', () => {
        const onBackPressMock = jest.fn();
        const { container } = Component({
            seekerList: seekerListMock,
            onBackPress: onBackPressMock,
        });
        fireEvent(container.findByType(SittingDetailsHeader), 'BackPress');
        expect(onBackPressMock).toBeCalled();
    });
    it('Should call onSelectedSeekersPress when selected seekers icon is pressed', () => {
        const onSelectedSeekersPressMock = jest.fn();
        const { container } = Component({
            seekerList: seekerListMock,
            onSelectedSeekersPress: onSelectedSeekersPressMock,
        });
        fireEvent(container.findByType(SittingDetailsHeader), 'SelectedSeekersPress');
        expect(onSelectedSeekersPressMock).toBeCalled();
    });
    it('Should call onAddSeekerBarcode when barcode scan is pressed', () => {
        const onAddSeekerBarcodeMock = jest.fn();
        const { container } = Component({
            seekerList: seekerListMock,
            onAddSeekerBarcode: onAddSeekerBarcodeMock,
            enableAddSeekerButton: false,
        });
        fireEvent(find(container, barcodeButton), 'Press');
        expect(onAddSeekerBarcodeMock).toBeCalled();
    });

    it('Should call onAddSeekerPress when barcode scan is pressed', () => {
        const onAddSeekerPressMock = jest.fn();
        const { container } = Component({
            seekerList: seekerListMock,
            onAddSeekerPress: onAddSeekerPressMock,
            enableAddSeekerButton: true,
        });
        fireEvent(find(container, addSeekerButton), 'Press');
        expect(onAddSeekerPressMock).toBeCalled();
    });

    it('Should call onBarcodeFlashPress when flash icon on barcode scanner is pressed', () => {
        const onBarcodeFlashPressMock = jest.fn();
        const { container } = Component({
            seekerList: seekerListMock,
            showBarCodeScanner: true,
            onBarcodeFlashPress: onBarcodeFlashPressMock,
        });
        fireEvent(container.findByType(BarcodeScanner), 'BarcodeFlashPress');
        expect(onBarcodeFlashPressMock).toBeCalled();
    });

    it('Should call onBarcodeRead when barcode is scanned', () => {
        const onBarcodeReadMock = jest.fn();
        const { container } = Component({
            seekerList: seekerListMock,
            showBarCodeScanner: true,
            onBarcodeRead: onBarcodeReadMock,
        });
        fireEvent(container.findByType(BarcodeScanner), 'BarcodeRead');
        expect(onBarcodeReadMock).toBeCalled();
    });

    it('Should call onBackPress when back button on barcode scanner is pressed', () => {
        const onBackPressMock = jest.fn();
        const { container } = Component({
            seekerList: seekerListMock,
            showBarCodeScanner: true,
            onBackPress: onBackPressMock,
        });
        fireEvent(container.findByType(BarcodeScanner), 'BackPress');
        expect(onBackPressMock).toBeCalled();
    });

    it('Should render barcode image', () => {
        const imageMock = require('./img/classic/barcode.png');
        const { container } = Component({
            seekerList: seekerListMock,
            imageSource: imageMock,
        });

        expect(find(container, barcodeImage)).toHaveProp('source', imageMock);
    });
});
