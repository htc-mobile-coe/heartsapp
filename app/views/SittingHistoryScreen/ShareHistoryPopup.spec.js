import React from 'react';
import { Text } from '../shared';
import ShareHistoryPopup from './ShareHistoryPopup';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import { Formik } from 'formik';
import EmailForm from './EmailForm';
describe('ShareHistoryPopup', () => {
    const skipButton = 'shareHistoryPoup__skip--button';
    const okButton = 'shareHistoryPoup__ok--button';
    const headerText = 'shareHistoryPoup__header--text';
    const successMessageText = 'shareHistoryPoup__successMessage--text';

    const Component = props => {
        return render(<ShareHistoryPopup {...props} />);
    };

    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });

    it('Should render 1 Text component when internet is not available and showSuccessMessage is false', () => {
        const { container } = Component({
            showSuccessMessage: false,
            isApplicationServerReachable: false,
        });
        expect(container.findByType(Text)).toBeDefined();
    });
    it('Should render 2 Text component when internet is not available and showSuccessMessage is true', () => {
        const { container } = Component({
            showSuccessMessage: true,
            isApplicationServerReachable: false,
        });
        expect(container.findAllByType(Text)).toHaveLength(2);
    });
    it('Should not render Text component when internet is available and showSuccessMessage is false', () => {
        const { container } = Component({
            showSuccessMessage: false,
            isApplicationServerReachable: true,
        });
        expect(container.findAllByType(Text)).toHaveLength(0);
    });
    it('Should render 1 Text component when internet is available and showSuccessMessage is true', () => {
        const { container } = Component({
            showSuccessMessage: true,
            isApplicationServerReachable: true,
        });
        expect(container.findByType(Text)).toBeDefined();
    });
    it('Should render headerText component when showSuccessMessage is false', () => {
        const { container } = Component({ showSuccessMessage: false });
        expect(find(container, headerText)).toBeDefined();
    });

    it('Should render successMessageText component when showSuccessMessage is true', () => {
        const { container } = Component({ showSuccessMessage: true });
        expect(find(container, successMessageText)).toBeDefined();
    });
    it('Should fire onSharePreceptorHistorySkipPress event when Skip is pressed', () => {
        const onSharePreceptorHistorySkipPressMock = jest.fn();
        const { container } = Component({
            onSharePreceptorHistorySkipPress: onSharePreceptorHistorySkipPressMock,
        });
        expect(find(container, skipButton)).toBeDefined();
        fireEvent(find(container, skipButton), 'Press');
        expect(onSharePreceptorHistorySkipPressMock).toHaveBeenCalled();
    });

    it('Should have initial values for FormikForm', () => {
        const { container } = Component({
            userEmail: 'preceptor.55@mailinator.com',
        });
        expect(container.findByType(Formik)).toHaveProp('initialValues', {
            email: 'preceptor.55@mailinator.com',
        });
    });

    it('Should fire onSubmit for Formik form ', () => {
        const onSubmitMock = jest.fn();
        const resetFormMock = jest.fn();
        const valuesMock = {
            email: 'test@gmail.com',
        };
        const { container } = Component({
            onSubmit: onSubmitMock,
        });

        expect(container.findByType(Formik)).toBeDefined();
        fireEvent(container.findByType(Formik), 'Submit', valuesMock, { resetForm: resetFormMock });
        expect(onSubmitMock).toHaveBeenCalledWith({
            ...valuesMock, 
            email: 'test@gmail.com',
            resetForm: resetFormMock
        });
    });

    it('Should have a Formik component ', () => {
        const handleSubmitMock = jest.fn();
        const { container } = Component({
            handleSubmit: handleSubmitMock,
            errors: { email: 'invalidEmail' },
        });

        expect(container.findByType(Formik)).toBeDefined();
    });
    it('Should have a EmailForm component ', () => {
        const { container } = Component({});
        expect(container.findByType(EmailForm)).toBeDefined();
    });
    it('Should fire onSharePreceptorHistorySkipPress event when ok Button is pressed', () => {
        const onSharePreceptorHistorySkipPressMock = jest.fn();
        const { container } = Component({
            showSuccessMessage: true,
            onSharePreceptorHistorySkipPress: onSharePreceptorHistorySkipPressMock,
        });
        expect(find(container, okButton)).toBeDefined();
        fireEvent(find(container, okButton), 'Press');
        expect(onSharePreceptorHistorySkipPressMock).toHaveBeenCalled();
    });
});
