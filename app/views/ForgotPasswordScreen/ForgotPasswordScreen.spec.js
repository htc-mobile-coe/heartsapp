import React from 'react';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import { Formik } from 'formik';
import Modal from 'react-native-modal';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import ScreenContainer from '../shared/ScreenContainer';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';

describe('ForgotPasswordScreen', () => {
    jest.useFakeTimers();
    const errorText = 'forgotPasswordScreen__errorMessage--text';
    const helpForm = 'forgotPasswordScreen__form--formik';
    const submitButton = 'forgotPasswordScreen__submit--button';
    const successModalOkButton = 'forgotPasswordScreen__successModalOk--button';
    const successModalHeadingText = 'forgotPasswordScreen__successModalHeading--text';
    const successModalMessageText = 'forgotPasswordScreen__successModalMessage--text';
    const onBackPressMock = jest.fn();
    const onGoToLoginScreenPressMock = jest.fn();
    const onSubmitMock = jest.fn();

    const Component = props => {
        return render(<ForgotPasswordScreen {...props} />);
    };
    afterEach(() => {
        onBackPressMock.mockClear();
        onGoToLoginScreenPressMock.mockClear();
        onSubmitMock.mockClear();
    });

    it('Should exist', () => {
        const { container } = Component();
        expect(container).toBeDefined();
    });

    it('Should render 1 ScreenContainer component', () => {
        const { container } = Component();
        expect(container.findByType(ScreenContainer)).toBeDefined();
    });

    it('Should render 1 OptionsScreenHeader component', () => {
        const { container } = Component();
        expect(container.findByType(OptionsScreenHeader)).toBeDefined();
    });

    it('Should render 1 Modal component', () => {
        const { container } = Component();
        expect(container.findByType(Modal)).toBeDefined();
    });

    it('Should render a successModalMessageText component', () => {
        const { container } = Component({showSuccessMessage: true});
        expect(find(container, successModalMessageText)).toBeDefined();
    });

    it('Should render a successModalHeadingText component', () => {
        const { container } = Component({showSuccessMessage: true});
        expect(find(container, successModalHeadingText)).toBeDefined();
    });

    it('Should render error text passed as parameter ', () => {
        const { container } = Component({
            errorMessage: 'error',
        });
        expect(find(container, errorText)).toHaveProp('children', 'error');
    });

    it('Should render form submit buttom', () => {
        const { container } = Component();
        const form = find(container, helpForm);

        expect(find(form, submitButton)).toBeDefined();
    });

    it('Should have initial values for FormikForm', () => {
        const { container } = Component();

        expect(container.findByType(Formik)).toHaveProp('initialValues', {
            email: '',
        });
    });

    describe('#BackPress', () => {
        it('Should call onBackPress event, When back button is pressed and onBackPress is present', () => {
            const { container } = Component({
                onBackPress: onBackPressMock,
            });
            fireEvent(container.findByType(OptionsScreenHeader), 'BackPress');

            expect(onBackPressMock).toBeCalled();
        });

        it('Should not call onBackPress event, When back button is pressed and onBackPress is not present', () => {
            const { container } = Component();
            fireEvent(container.findByType(OptionsScreenHeader), 'BackPress');

            expect(onBackPressMock).not.toBeCalled();
        });
    });

    describe('#onGoToLoginScreenPress', () => {
        it('Should call onGoToLoginScreenPress event, When ok on success modal is pressed and onGoToLoginScreenPress is present', () => {
            const { container } = Component({
                showSuccessMessage: true,
                onGoToLoginScreenPress: onGoToLoginScreenPressMock,
            });
            fireEvent(find(container, successModalOkButton), 'Press');

            expect(onGoToLoginScreenPressMock).toBeCalled();
        });

        it('Should not call onGoToLoginScreenPress event, When ok on success modal is pressed and onGoToLoginScreenPress is not present', () => {
            const { container } = Component({
                showSuccessMessage: true,
            });
            fireEvent(find(container, successModalOkButton), 'Press');

            expect(onGoToLoginScreenPressMock).not.toBeCalled();
        });
    });

    describe('#submit', () => {
        it('Should able to submit form, When field have valid value and onSubmit is present', () => {
            const resetFormMock = jest.fn();
            const valuesMock = {
                email: 'abhyasi.78@mailinator.com',
            };

            const { container } = Component({ onSubmit: onSubmitMock });
            const form = find(container, helpForm);

            fireEvent(form, 'Submit', valuesMock, { resetForm: resetFormMock });
            expect(onSubmitMock).toBeCalledWith({
                email: 'abhyasi.78@mailinator.com',
                resetForm: resetFormMock,
            });          
        });

        it('Should not be able to submit form, When field have valid value and onSubmit is not present', () => {
            const resetFormMock = jest.fn();
            const valuesMock = {
                email: 'abhyasi.78@mailinator.com',
            };

            const { container } = Component();
            const form = find(container, helpForm);

            fireEvent(form, 'Submit', valuesMock, { resetForm: resetFormMock });

            expect(onSubmitMock).not.toBeCalled();
        });

        it('Should return formik error, When field have invalid value and onSubmit is present', () => {
            const resetFormMock = jest.fn();
            const valuesMock = {
                email: 'mockemail',
            };

            const { container } = Component({ onSubmit: onSubmitMock });
            const form = find(container, helpForm);

            fireEvent(form, 'Submit', valuesMock, { resetForm: resetFormMock });
            expect(onSubmitMock).toBeCalledWith({
                email: 'mockemail',
                resetForm: resetFormMock,
            });
            try {
                form.props.validationSchema.validate(valuesMock);
            } catch (e) {
                expect(e.errors).toEqual(['validations:invalidEmail']);
            }          
        });
    });
});
