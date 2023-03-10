import React from 'react';
import { SeekerSelectionComponentContainer } from './index';
import SeekerSelectionComponent from './SeekerSelectionComponent';
import { render, fireEvent } from 'app/utils/TestUtils';

describe('SeekerSelectionComponentContainer', () => {
    const formValueMock = {
        name: {
            id: 'NAME',
            label: 'name',
            searchText: 'name mock',
        },
        abhyasiId: {
            id: 'ABHYASI_ID',
            label: 'abhyasiId',
            searchText: 'HFN123',
        },
        phoneNo: {
            id: 'PHONE_NO',
            label: 'phoneNo',
            searchText: '+919876543210',
        },
        email: {
            id: 'EMAIL',
            label: 'email',
            searchText: 'abhyasi@mailinator.com',
        },
        city: {
            id: 'CITY',
            label: 'city',
            searchText: 'Mumbai',
        },
    };
    const Component = props => {
        return render(<SeekerSelectionComponentContainer {...props} />);
    };

    it('Should render SeekerSelectionComponent component', () => {
        const { container } = Component();
        expect(container.findByType(SeekerSelectionComponent)).toBeDefined();
    });

    it('Should call onBackPress when back button is pressed', () => {
        const onBackPressMock = jest.fn();

        const { container } = Component({
            onBackPress: onBackPressMock,
        });
        fireEvent(container.findByType(SeekerSelectionComponent), 'BackPress');
        expect(onBackPressMock).toBeCalled();
    });

    it('Should call onBarcodeScannerPress when barcode scanner button is pressed', () => {
        const onBarcodeScannerPressMock = jest.fn();

        const { container } = Component({
            onBarcodeScannerPress: onBarcodeScannerPressMock,
        });
        fireEvent(container.findByType(SeekerSelectionComponent), 'BarcodeScannerButtonPress');
        expect(onBarcodeScannerPressMock).toBeCalled();
    });
    it('Should call onSelectedSeekersPress when selected seekers icon is pressed', () => {
        const onSelectedSeekersPressMock = jest.fn();
        const { container } = Component({
            onSelectedSeekersPress: onSelectedSeekersPressMock,
        });
        fireEvent(container.findByType(SeekerSelectionComponent), 'SelectedSeekersPress');
        expect(onSelectedSeekersPressMock).toHaveBeenCalled();
    });
    it('Should call onSearchButtonPress when search button is pressed', () => {
        const onSearchButtonPressMock = jest.fn();

        const { container } = Component({
            onSearchButtonPress: onSearchButtonPressMock,
        });
        fireEvent(container.findByType(SeekerSelectionComponent), 'SearchButtonPress', formValueMock);
        expect(onSearchButtonPressMock).toBeCalledWith(formValueMock);
    });
    it('Should call onBarcodeScannerInfoPress when search button is pressed', () => {
        const onBarcodeScannerInfoPressMock = jest.fn();

        const { container } = Component({
            onBarcodeScannerInfoPress: onBarcodeScannerInfoPressMock,
        });
        fireEvent(container.findByType(SeekerSelectionComponent), 'BarcodeScannerInfoPress', formValueMock);
        
        expect(onBarcodeScannerInfoPressMock).toBeCalled();
    });
});
