import React from 'react';
import FirstTimeLandingScreen from './FirstTimeLandingScreen';
import { render, fireEvent, find } from '../../utils/TestUtils';
import { TRAINER, EXISTING_PRACTITIONER, NEW_TO_HEARTFULNESS } from './Options';
import UserRoleButton from './UserRoleButton';
import AgeConsentPopup from '../shared/AgeConsentPopup';

describe('FirstTimeLandingScreen', () => {
    const newToHeartfulnessButton =
        'firstTimeLandingScreen__newToHeartfulness--button';
    const existingPractitionerButton =
        'firstTimeLandingScreen__existingPractitioner--button';
    const trainerButton = 'firstTimeLandingScreen__trainer--button';
    const onOptionPressMock = jest.fn();

    const Component = (props) => render(<FirstTimeLandingScreen {...props}
    />);

    afterEach(() => {
        onOptionPressMock.mockClear();
    });
    it('Should fire onOptionPress event, when newToHeartfulness button is pressed', () => {
        const { container } = Component({ onOptionPress: onOptionPressMock });
        fireEvent(find(container, newToHeartfulnessButton), 'Press');
        expect(onOptionPressMock).toBeCalledWith(NEW_TO_HEARTFULNESS);
    });
    it('Should fire onOptionPress event, when Practitioner button is pressed', () => {
        const { container } = Component({ onOptionPress: onOptionPressMock });
        fireEvent(find(container, existingPractitionerButton), 'Press');
        expect(onOptionPressMock).toBeCalledWith(EXISTING_PRACTITIONER);
    });
    it('Should fire onOptionPress event, when trainer button is pressed', () => {
        const { container } = Component({ onOptionPress: onOptionPressMock });
        fireEvent(find(container, trainerButton), 'Press');
        expect(onOptionPressMock).toBeCalledWith(TRAINER);
    });
    it('Should have 3 UserRole Button', () => {
        const { container } = Component();
        expect(container.findAllByType(UserRoleButton)).toHaveLength(3);
    });
    it('Should have one AgeConsentPopup', () => {
        const { container } = Component();
        expect(container.findAllByType(AgeConsentPopup)).toBeDefined();
    });
});
