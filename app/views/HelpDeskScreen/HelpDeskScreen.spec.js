import React from 'react';
import HelpDeskScreen from './HelpDeskScreen';
import { render, find, findByProps, fireEvent } from '../../utils/TestUtils';
import ContactInfoIcon from './ContactInfoIcon';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';
import { Linking } from 'react-native';

describe('HelpDeskScreen', () => {
    const diagnosticCheckbox = 'helpDeskScreen__diagnostic__checkbox';
    const errorText = 'helpDeskScreen__errorMessage--text';
    const helpForm = 'helpDeskScreen__form';
    const submitButton = 'helpDeskScreen__submit';
    const tollFreeButton = 'helpDeskScreen__contactInfoIcon--tollFree';
    const emailButton = 'helpDeskScreen__contactInfoIcon--email';
    const availableTimingText = 'helpDeskScreen__availableTiming--text';
    const subHeadingText = 'helpDeskScreen__subHeading--text';
    const appVersionText = 'helpDeskScreen__appVersion--text';
    const onBackPressMock = jest.fn();

    const Component = props => {
        return render(<HelpDeskScreen {...props} />);
    };
    const openURLMock = jest
        .spyOn(Linking, 'openURL')
        .mockImplementation(() => {});
    afterEach(() => {
        onBackPressMock.mockClear();
        openURLMock.mockClear();
    });

    it('Should exist', () => {
        const { container } = Component();
        expect(container).toBeDefined();
    });

    it('Should have 1 OptionsScreenHeader component', () => {
        const { container } = Component();
        expect(container.findAllByType(OptionsScreenHeader)).toHaveLength(1);
    });

    it('Should have 3 ContactInfoIcon', () => {
        const { container } = Component();
        expect(container.findAllByType(ContactInfoIcon)).toHaveLength(3);
    });

    it('Should fire contactInfo SupportTollFree press event, when toll free button pressed', () => {
        const { container } = Component({
            contactInfoTollFreeNo: '1800123123789',
        });
        fireEvent(find(container, tollFreeButton), 'Press');
        expect(openURLMock).toBeCalledWith('tel:1800123123789');
    });

    it('Should fire contactInfo send email press event, when email button pressed', () => {
        const { container } = Component({
            contactInfoEmail: 'support@heartsapp.org',
        });
        fireEvent(find(container, emailButton), 'Press');
        expect(openURLMock).toBeCalledWith('mailto:support@heartsapp.org');
    });

    it('Should render availableTimingText component', () => {
        const { container } = Component({});
        expect(find(container, availableTimingText)).toBeDefined();
    });

    it('Should render subHeadingText component', () => {
        const { container } = Component({});
        expect(find(container, subHeadingText)).toBeDefined();
    });

    it('Should render appVersionText component', () => {
        const { container } = Component({});
        expect(find(container, appVersionText)).toBeDefined();
    });

    it('Should render error text passed as parameter ', () => {
        const { container } = Component({
            errorMessage: 'error',
        });
        expect(find(container, errorText)).toHaveProp('children','error');
    });
    it('Should render diagnostic Checkbox', () => {
        const { container } = Component();
        expect(container.findAllByType(diagnosticCheckbox)).toBeDefined();
    });

    it('Should render form Submit Buttom', () => {
        const { container } = Component();
        expect(container.findAllByType(submitButton)).toBeDefined();
    });

    it('Should have initial values for FormikForm', () => {
        const { container } = Component({
            userProfile: {
                firstName: 'Hae',
                lastName: 'Baxter',
                email: 'preceptor.55@mailinator.com',
                phone: '+911234567890',
            },
            fullName: 'Hae Baxter',
        });
        expect(find(container, helpForm)).toHaveProp('initialValues',{
            name: 'Hae Baxter',
            email: 'preceptor.55@mailinator.com',
            mobileNo: '+911234567890',
            issue: '',
            sendDiagnosticLog: true,
        });
    });
        
    it('Should able to submit form when all fields have valid values', async () => {
        const onSubmitMock = jest.fn();
        const resetFormMock = jest.fn();
        const valuesMock = {
            name: 'nameMock',
            email: 'mockemail@gmail.com',
            mobileNo: '1234567890',
            issue: 'issueMock',
        };
        const { container } = Component({ onSubmit: onSubmitMock });
        fireEvent(find(container, helpForm),'Submit', valuesMock, { resetForm: resetFormMock });
        expect(onSubmitMock).toBeCalledWith({
            name: 'nameMock',
            email: 'mockemail@gmail.com',
            mobileNo: '1234567890',
            issue: 'issueMock',
            resetForm: resetFormMock,
        });
    });

    it('Should return formik error when name is not a valid name', async () => {
        const valuesMock = {
            name: 'nameMock,*',
            email: 'mockemail@gmail.com',
            mobileNo: '1234567890',
            issue: 'issueMock',
        };
        const onSubmitMock = jest.fn();
        const resetFormMock = jest.fn();
        const { container } = Component({ onSubmit: onSubmitMock });
        const form = find(container, helpForm);
        fireEvent(form,'Submit', valuesMock, { resetForm: resetFormMock });
        expect(onSubmitMock).toBeCalledWith({
            name: 'nameMock,*',
            email: 'mockemail@gmail.com',
            mobileNo: '1234567890',
            issue: 'issueMock',
            resetForm: resetFormMock,
        });
        try {
            await form.props.validationSchema.validate(valuesMock);
        } catch (e) {
            expect(e.errors).toMatchObject(['validations:invalidValue']);
        }
    });
    it('Should return formik error when email is not a valid email', async () => {
        const valuesMock = {
            name: 'nameMock',
            email: 'mockemail',
            mobileNo: '1234567890',
            issue: 'issueMock',
        };
        const onSubmitMock = jest.fn();
        const resetFormMock = jest.fn();
        const { container } = Component({ onSubmit: onSubmitMock });
        const form = find(container, helpForm);
        fireEvent(form,'Submit', valuesMock, { resetForm: resetFormMock });
        expect(onSubmitMock).toBeCalledWith({
            name: 'nameMock',
            email: 'mockemail',
            mobileNo: '1234567890',
            issue: 'issueMock',
            resetForm: resetFormMock,
        });
        try {
            await form.props.validationSchema.validate(valuesMock);
        } catch (e) {
            expect(e.errors).toEqual(['validations:invalidEmail']);
        }
    });
    it('Should return formik error when issue field is not having valid characters', async () => {
        const valuesMock = {
            name: 'nameMock',
            email: 'mockemail@gmail.com',
            mobileNo: '1234567890',
            issue: 'issueMock ©®∞',
        };
        const onSubmitMock = jest.fn();
        const resetFormMock = jest.fn();
        const { container } = Component({ onSubmit: onSubmitMock });
        const form = find(container, helpForm);
        fireEvent(form,'Submit', valuesMock, { resetForm: resetFormMock });
        expect(onSubmitMock).toBeCalledWith({
            name: 'nameMock',
            email: 'mockemail@gmail.com',
            mobileNo: '1234567890',
            issue: 'issueMock ©®∞',
            resetForm: resetFormMock,
        });
        try {
            await form.props.validationSchema.validate(valuesMock);
        } catch (e) {
            expect(e.errors).toEqual(['validations:invalidCharacters']);
        }
    });
    it('Should have all fields to enter', () => {
        const { container } = Component();
        const helpDeskForm = find(container,helpForm);
        expect(findByProps(helpDeskForm, 'name', 'name')).toBeDefined();
        expect(findByProps(helpDeskForm, 'name', 'email')).toBeDefined();
        expect(findByProps(helpDeskForm, 'name', 'mobileNo')).toBeDefined();
        expect(findByProps(helpDeskForm, 'name', 'issue')).toBeDefined();
    });

    it('Should call onBackPress event, When back button is pressed', () => {
        const handleResetMock = jest.fn();
        const { container } = Component({
            onBackPress: onBackPressMock,
            handleReset: handleResetMock,
        });
        fireEvent(container.findByType(OptionsScreenHeader), 'BackPress');
        expect(onBackPressMock).toBeCalled();
    });
});
