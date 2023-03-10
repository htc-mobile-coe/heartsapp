import React from 'react';
import { Linking } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { render, findByProps, fireEvent } from '../../utils/TestUtils';
import { HelpDeskScreenContainer, mapStateToProps } from './index';
import HelpDeskScreen from './HelpDeskScreen';
import * as HelpDeskService from './index.service';

describe('HelpDeskScreenContainer', () => {
    let onHelpDeskMock;

    const Component = props => {
        return render(<HelpDeskScreenContainer {...props} />);
    };

    const onHelpDeskMockResponse = response => {
        onHelpDeskMock = jest
            .spyOn(HelpDeskService, 'onHelpDesk')
            .mockImplementation(() => {
                return Promise.resolve(response);
            });
    };
    const openURLMock = jest
        .spyOn(Linking, 'openURL')
        .mockImplementation(() => {
            return Promise.resolve();
        });
    afterEach(() => {
        openURLMock.mockClear();
        if (onHelpDeskMock) {
            onHelpDeskMock.mockClear();
            onHelpDeskMock = undefined;
        }
    });

    it('Should exist', () => {
        const { container } = Component();
        expect(container).toBeDefined();
    });

    it('Should have HelpDeskScreen', () => {
        const { container } = Component();
        expect(container.findAllByType(HelpDeskScreen)).toHaveLength(1);
    });

    it('Should able to submit the values & navigate to back, when onSubmit event is called', async () => {
        onHelpDeskMockResponse(null);
        const resetFormMock = jest.fn();
        const valuesMock = {
            name: 'nameMock',
            email: 'mockemail@gmail.com',
            mobileNo: '1234567890',
            issue: 'issueMock ©®∞',
            resetForm: resetFormMock,
        };
        const { container } = Component({});
        const helpDeskScreen = container.findByType(HelpDeskScreen);
        fireEvent(helpDeskScreen,'onSubmit',valuesMock);
        expect(helpDeskScreen).toHaveProp('errorMessage', null);
    });
    it('Should able to open whatsApp', async () => {
        const { container } = Component({});
        fireEvent(container.findByType(HelpDeskScreen), 'WhatsappPress', {});
        expect(openURLMock).toBeCalledWith('https://wa.me/+916304119689');
    });

    it('Should show error Message when onHelpDesk event is called and some error message is received', async () => {
        onHelpDeskMockResponse('Error');
        const actionsPopMock = jest
        .spyOn(Actions, 'pop')
        .mockImplementation(() => {});
        const valuesMock = {
            name: 'nameMock',
            email: 'mockemail@gmail.com',
            mobileNo: '1234567890',
            issue: 'issueMock ©®∞',
        };
        const { container } = Component({});
        const helpDeskScreen = container.findByType(HelpDeskScreen);
        fireEvent(helpDeskScreen,'Submit',valuesMock);
        expect(findByProps(helpDeskScreen, 'errorMessage', 'Error')).toBeDefined();
    });

    it('Should call onBackPress on HelpDeskScreen component', () => {
        const onBackPressMock = jest
            .spyOn(Actions, 'pop')
            .mockImplementation(() => {});

        const { container } = Component({
            onBackPress: onBackPressMock,
        });
        fireEvent(container.findByType(HelpDeskScreen), 'BackPress');
        expect(container.findByType(HelpDeskScreen)).toHaveProp('errorMessage', null);
        expect(onBackPressMock).toHaveBeenCalled();
    });

    it('Should get fullName when user is not anonymous', () => {
        const { container } = Component({
            userProfile: {
                firstName: 'Hae',
                lastName: 'Baxter',
            },
        });
        expect(container.findByType(HelpDeskScreen)).toHaveProp('fullName', 'Hae Baxter');
    });

    it('Should get fullName as empty string when user is anonymous', () => {
        const { container } = Component({
            isAnonymousUser: true,
        });
        expect(container.findByType(HelpDeskScreen)).toHaveProp('fullName', '');
    });

    it('Should populate value from redux', () => {
        expect(
            mapStateToProps({
                user: {
                    hfnProfile: {
                        firstName: 'Hae',
                        lastName: 'Baxter',
                        email: 'preceptor.55@mailinator.com',
                        phone: '+911234567890',
                        anonymous: false,
                    },
                },
            }),
        ).toEqual({
            isAnonymousUser: false,
            userProfile: {
                firstName: 'Hae',
                lastName: 'Baxter',
                email: 'preceptor.55@mailinator.com',
                phone: '+911234567890',
                anonymous: false,
            },
        });
    });
});
