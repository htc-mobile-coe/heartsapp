import React from 'react';
import { SeekerBarcodeScannedResultContainer } from './index';
import SeekerBarcodeScannedResult from './SeekerBarcodeScannedResult';
import PermissionService from '../../../../services/PermissionService';
import { Alert } from 'react-native';
import { render, fireEvent, findByProps } from 'app/utils/TestUtils';

describe('SeekerBarcodeScannedResultContainer', () => {
    let hasCameraPermissionBlockedMock;
    let requestCameraPermissionMock;
    const hasCameraPermissionBlockedResponse = response => {
        hasCameraPermissionBlockedMock = jest
            .spyOn(PermissionService, 'hasCameraPermissionBlocked')
            .mockImplementation(() => {
                return response;
            });
        requestCameraPermissionMock = jest
            .spyOn(PermissionService, 'requestCameraPermission')
            .mockImplementation(() => {});
    };
    const alertMock = jest
        .spyOn(Alert, 'alert')
        .mockImplementation((title, message, buttons) => {
            buttons[0].onPress();
        });
    const barcodeSearchResultMock = [
        {
            name: 'Abhyasi 12',
            email: 'abhyasi.12@mailinator.com',
            phoneNo: '+91 99623 88246',
            seekerId: 'HFN 228971',
            isSelected: false,
        },
    ];

    afterAll(() => {
        if (hasCameraPermissionBlockedMock) {
            hasCameraPermissionBlockedMock.mockClear();
            hasCameraPermissionBlockedMock = undefined;
        }
        if (requestCameraPermissionMock) {
            requestCameraPermissionMock.mockClear();
            requestCameraPermissionMock = undefined;
        }
        alertMock.mockClear();
    });

    const Component = props => {
        return render(<SeekerBarcodeScannedResultContainer {...props} />);
    };

    it('Should render SeekerBarcodeScannedResult component', () => {
        const { container } = Component({
            barcodeSearchedResult: barcodeSearchResultMock,
        });
        expect(container.findByType(SeekerBarcodeScannedResult)).toBeDefined();
    });

    it('Should call onBackPress when back button is pressed', () => {
        const onBackPressMock = jest.fn();
        const { container } = Component({
            onBackPress: onBackPressMock,
            barcodeSearchedResult: barcodeSearchResultMock,
        });
        fireEvent(container.findByType(SeekerBarcodeScannedResult), 'BackPress');
        expect(onBackPressMock).toHaveBeenCalled();
    });

    it('Should call onBarcodeFlashPress when BarcodeScanner flash button is pressed and enableFlash is off', () => {
        const { container } = Component({
            barcodeSearchedResult: barcodeSearchResultMock,
        });
        fireEvent(container.findByType(SeekerBarcodeScannedResult), 'BarcodeFlashPress');
        expect(findByProps(container, 'enableFlash', 'torch')).toBeDefined();
    });

    it('Should call onBarcodeFlashPress when BarcodeScanner flash button is pressed and enableFlash is on', () => {
        const { container } = Component({
            barcodeSearchedResult: barcodeSearchResultMock,
        });
        fireEvent(container.findByType(SeekerBarcodeScannedResult), 'BarcodeFlashPress');
        fireEvent(container.findByType(SeekerBarcodeScannedResult), 'BarcodeFlashPress');
        expect(findByProps(container, 'enableFlash', 'off')).toBeDefined();
    });

    it('Should call onAddSeekerBarcode when add seeker button is pressed', () => {
        const { container } = Component({
            barcodeSearchedResult: barcodeSearchResultMock,
        });
        fireEvent(container.findByType(SeekerBarcodeScannedResult), 'AddSeekerBarcode');
        expect(findByProps(container, 'showBarcodeScanner', true)).toBeDefined();
    });
    it('Should call onSelectedSeekersPress when selected seekers icon is pressed', () => {
        const onSelectedSeekersPressMock = jest.fn();
        const { container } = Component({
            onSelectedSeekersPress: onSelectedSeekersPressMock,
            barcodeSearchedResult: barcodeSearchResultMock,
        });
        fireEvent(container.findByType(SeekerBarcodeScannedResult), 'SelectedSeekersPress');
        expect(onSelectedSeekersPressMock).toHaveBeenCalled();
    });
    it('Should call onBarcodeRead when barcode is scanned', () => {
        const onBarcodeScannedMock = jest.fn();
        const idMock = 'INSABCD890';

        const { container } = Component({
            onBarcodeScanned: onBarcodeScannedMock,
            barcodeSearchedResult: barcodeSearchResultMock,
        });
        fireEvent(container.findByType(SeekerBarcodeScannedResult), 'BarcodeRead', idMock);
        expect(onBarcodeScannedMock).toHaveBeenCalledWith(idMock);
        expect(findByProps(container, 'showBarcodeScanner', false)).toBeDefined();
    });

    it('Should call onAddSeekerPress when add seeker button is pressed', () => {
        const onAddSeekerPressMock = jest.fn();
        const { container } = Component({
            onAddSeekerPress: onAddSeekerPressMock,
            barcodeSearchedResult: barcodeSearchResultMock,
        });
        fireEvent(container.findByType(SeekerBarcodeScannedResult), 'AddSeekerPress');
        expect(onAddSeekerPressMock).toHaveBeenCalled();
    });

    it('Should enabel Add Seeker buttton when barcodeSearchedResult has some value', () => {
        const { container } = Component({
            barcodeSearchedResult: barcodeSearchResultMock,
        });
        expect(findByProps(container, 'enableAddSeekerButton', true)).toBeDefined();
    });

    it('Should not enabel Add Seeker buttton when barcodeSearchedResult is empty', () => {
        const { container } = Component({
            barcodeSearchedResult: [],
        });
        expect(findByProps(container, 'enableAddSeekerButton', false)).toBeDefined();
    });

    it('Should check camera permission in componentDidMount and permission is blocked', async () => {
        hasCameraPermissionBlockedResponse(true);
        await Component({
            t: jest.fn(),
            barcodeSearchedResult: barcodeSearchResultMock,
        });

        expect(hasCameraPermissionBlockedMock).toHaveBeenCalled();
        expect(alertMock).toHaveBeenCalled();
    });

    it('Should check camera permission in componentDidMount and permission is not blocked', async () => {
        hasCameraPermissionBlockedResponse(false);
        await Component({ barcodeSearchedResult: barcodeSearchResultMock });

        expect(hasCameraPermissionBlockedMock).toHaveBeenCalled();
        expect(requestCameraPermissionMock).toHaveBeenCalled();
    });
});
