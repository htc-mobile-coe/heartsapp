import React from 'react';
import { render, fireEvent, find } from '../../utils/TestUtils';
import WhatsNewPopup from './WhatsNewPopup';
import { TouchableOpacity } from 'react-native';

describe('WhatsNewPopup', () => {
    const remindMeLaterButton = 'whatsNewPopup-remindMeLater-button';
    const updateButton = 'whatsNewPopup-update-button';
    const learnMoreButton = 'whatsNewPopup-learnMore-button';
    const mediumBoldTextForLearnMore = 'whatsNewPopup-renderLearnMoreButton-mediumBoldText'
    const mediumBoldTextForTitle = 'whatsNewPopup-renderPopupContent-mediumBoldText'
    const descriptionMock = [
        {
            point: '1. Guided steps for onboarding new users',
        },
        {
            point: '2. Enriched home screen ',
        },
        {
            point: '3. Provision for exiting meditation',
        },
        {
            point: '4. Reminder for meditation and guided practice',
        },
        {
            point: '5. Other Bug fixes',
        },
        {
            point: '6. Backend fixes',
        },
    ];
    const Component = (props) => render(<WhatsNewPopup
        description={{
            point: '1. Guided steps for onboarding new users',
        }}
        {...props}
    />);


    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined()
    });
    it('Should render MediumBoldText component when the description point is more than 5', () => {
        const { container } = Component({
            description: descriptionMock
        });
        expect(find(container, mediumBoldTextForLearnMore)).toBeDefined()
    });
    it('Should render  MediumBoldText component when the description point is less than 5', () => {
        const { container } = Component({});
        expect(find(container, mediumBoldTextForTitle)).toBeDefined()
    });
    it('Should render 1 TouchableOpacity component', () => {
        const { container } = Component({ description: descriptionMock });
        expect(container.findAllByType(TouchableOpacity)).toHaveLength(1);
    });
    it('Should fire onRemindMeLaterPress when remindmelater button is pressed', () => {
        const onRemindMeLaterPressMock = jest.fn();
        const { container } = Component({
            onRemindMeLaterPress: onRemindMeLaterPressMock,
            description: descriptionMock,
        });
        const remindMeLaterButtonSection = find(container, remindMeLaterButton)
        expect(remindMeLaterButtonSection).toBeDefined();
        fireEvent(remindMeLaterButtonSection, 'Press');
        expect(onRemindMeLaterPressMock).toHaveBeenCalled();
    });

    it('Should fire updateButtonPress when update button is pressed', () => {
        const onUpdatePressMock = jest.fn();
        const { container } = Component({
            onUpdatePress: onUpdatePressMock,
        });
        expect(find(container, updateButton)).toBeDefined();
        fireEvent(find(container, updateButton), 'Press');
        expect(onUpdatePressMock).toHaveBeenCalled();
    });
    it('Should fire learnMoreButtonPress when learn more button is pressed', () => {
        const onLearnMorePressMock = jest.fn();
        const { container } = Component({
            onLearnMorePress: onLearnMorePressMock,
            description: descriptionMock,
        });
        expect(find(container, learnMoreButton)).toBeDefined();
        fireEvent(find(container, learnMoreButton), 'Press');
        expect(onLearnMorePressMock).toHaveBeenCalled();
    });
});
