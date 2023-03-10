import React from 'react';
import SeekerSelectionComponent from './SeekerSelectionComponent';
import FilterForm from './FilterForm';
import { ScrollView } from 'react-native';
import SittingDetailsHeader from '../SittingDetailsHeader';
import { render, fireEvent, find, findByProps } from 'app/utils/TestUtils';
import { Formik } from 'formik';

describe('SeekerSelectionComponent', () => {
    const barcodeScanButton = 'seekerSelectionComponent__barcodeScan--touchableOpacity';
    const addSeekersByScanText = 'seekerSelectionComponent__addSeekersByScan--text';
    const atLeastOneText = 'seekerSelectionComponent__atLeastOne--text';
    const srcmIdText = 'seekerSelectionComponent__addSeekersByScan--text';
    const searchSeekersByText = 'seekerSelectionComponent__addSeekersByScan--text';
    const barcodeImage = 'seekerSelectionComponent__barcode--image';
    const initialValues = {
        name: {
            id: 'NAME',
            label: 'seekerSelectionComponent:name',
            searchText: '',
        },
        abhyasiId: {
            id: 'ABHYASI_ID',
            label: 'seekerSelectionComponent:abhyasiId',
            searchText: '',
        },
        phoneNo: {
            id: 'PHONE_NO',
            label: 'seekerSelectionComponent:phoneNo',
            searchText: '',
        },
        email: {
            id: 'EMAIL',
            label: 'seekerSelectionComponent:email',
            searchText: '',
        },
        city: {
            id: 'CITY',
            label: 'seekerSelectionComponent:city',
            searchText: {},
        },
    };
    const onSearchButtonPressMock = jest.fn();
    const Component = props => {
        return render(<SeekerSelectionComponent {...props} />);
    };
    afterEach(() => {
        onSearchButtonPressMock.mockClear();
    });
    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });

    it('Should render 1 MediumBoldText component to display Add Seekers by scan text', () => {
        const { container } = Component({});
        expect(find(container, addSeekersByScanText)).toBeDefined();
    });

    it('Should render 1 MediumBoldText component to display SRCM id', () => {
        const { container } = Component({});
        expect(find(container, srcmIdText)).toBeDefined();
    });

    it('Should render 1 MediumBoldText component to display Search Seekers by scan text', () => {
        const { container } = Component({});
        expect(find(container, searchSeekersByText)).toBeDefined();
    });

    it('Should render 1 Text component to display atLeastOneText', () => {
        const { container } = Component();
        expect(find(container, atLeastOneText)).toBeDefined();
    });

    it('Should render 1 SittingDetailsHeader component', () => {
        const { container } = Component({});
        expect(container.findByType(SittingDetailsHeader)).toBeDefined();
    });

    it('Should render 1 ScrollView component', () => {
        const { container } = Component({});
        expect(container.findByType(ScrollView)).toBeDefined();
    });

    it('Should render 1 barcodeScanButton component', () => {
        const { container } = Component({});
        expect(find(container, barcodeScanButton)).toBeDefined();
    });

     it('Should render 1 barcodeImage component', () => {
        const { container } = Component({});
        expect(find(container, barcodeImage)).toBeDefined();
    });

    it('Should render 1 FilterForm component to display input components', () => {
        const { container } = Component();
        expect(find(container.findByType(FilterForm))).toBeDefined();
    });

    it('Should have initial values for FilterForm', () => {
        const { container } = Component();
        const formikForm = container.findByType(Formik);

        expect(findByProps(formikForm, 'initialValues', initialValues)).toBeDefined();
    });

    it('Should call onBackPress when back button is pressed', () => {
        const onBackPressMock = jest.fn();
        const { container } = Component({
            onBackPress: onBackPressMock,
        });
        fireEvent(container.findByType(SittingDetailsHeader), 'BackPress');
        expect(onBackPressMock).toBeCalled();
    });
    it('Should call onSelectedSeekersPress when selected seekers icon is pressed', () => {
        const onSelectedSeekersPressMock = jest.fn();
        const { container } = Component({
            onSelectedSeekersPress: onSelectedSeekersPressMock,
        });
        fireEvent(container.findByType(SittingDetailsHeader), 'SelectedSeekersPress');
        expect(onSelectedSeekersPressMock).toBeCalled();
    });

    it('Should call onBarcodeScannerButtonPress when barcode scan is pressed', () => {
        const onBarcodeScannerButtonPressMock = jest.fn();
        const { container } = Component({
            onBarcodeScannerButtonPress: onBarcodeScannerButtonPressMock,
        });
        fireEvent(find(container, barcodeScanButton), 'Press');
        expect(onBarcodeScannerButtonPressMock).toBeCalled();
    });

    it('Should call onSearchButtonPress when search button is pressed', () => {
        const { container } = Component({
            onSearchButtonPress: onSearchButtonPressMock,
        });
        fireEvent(container.findByType(Formik), 'Submit', {}, { resetForm: jest.fn() });
        expect(onSearchButtonPressMock).toHaveBeenCalled();
    });
    it('Should return formik error when phone number is not valid', async () => {
        const resetFormMock = jest.fn();
        const { container } = Component({
            onSearchButtonPress: onSearchButtonPressMock,
        });
        const form = container.findByType(Formik);
        fireEvent(form, 'Submit', initialValues, { resetForm: resetFormMock });
        expect(onSearchButtonPressMock).toBeCalledWith(initialValues);
        try {
            await form.props.validationSchema.validate(initialValues);
        } catch (e) {
            expect(e.errors).toMatchObject(['validations:invalidMobileNo']);
        }
    });

    it('Should return formik error when all field are empty', async () => {
        const intialValuesMock = {
            name: {
                id: 'NAME',
                label: 'seekerSelectionComponent:name',
                searchText: undefined,
            },
            abhyasiId: {
                id: 'ABHYASI_ID',
                label: 'seekerSelectionComponent:abhyasiId',
                searchText: undefined,
            },
            phoneNo: {
                id: 'PHONE_NO',
                label: 'seekerSelectionComponent:phoneNo',
                searchText: undefined,
            },
            email: {
                id: 'EMAIL',
                label: 'seekerSelectionComponent:email',
                searchText: undefined,
            },
            city: {
                id: 'CITY',
                label: 'seekerSelectionComponent:city',
                searchText: undefined,
            },
        };
        const resetFormMock = jest.fn();
        const { container } = Component({
            onSearchButtonPress: onSearchButtonPressMock,
        });
        const form = container.findByType(Formik);
        fireEvent(form, 'Submit', intialValuesMock, { resetForm: resetFormMock });
        expect(onSearchButtonPressMock).toBeCalledWith(intialValuesMock);
        try {
            await form.props.validationSchema.validate(intialValuesMock);
        } catch (e) {
            expect(e.errors).toMatchObject([
                'seekerSelectionComponent:formValidation',
            ]);
        }
    });
});
