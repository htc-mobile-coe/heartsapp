import React from 'react';
import IntroductorySittingsAttestationScreen from './IntroductorySittingsAttestationScreen';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import Radio from '../shared/Radio';
import { Text } from '../shared';
import { BoldText } from '../shared/Text';
import { COMPLETED_INTRO_SESSIONS_AT_EVENT } from './IntroductorySittingsAttestationOptions';

describe('IntroductorySittingsAttestationScreen', () => {
    const submitButton = 'introductorySittingsAttestationScreen_submit--button';
    const backButton = 'introductorySittingsAttestationScreen_back--button';
    const Component = props => {
        return render(<IntroductorySittingsAttestationScreen {...props} />);
    };
    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });
    it('Should have two text component for title and subtitle', () => {
        const { container } = Component({});
        expect(container.findAllByType(Text)).toHaveLength(2);
    });
    it('Should have a Bold text component for subtitle', () => {
        const { container } = Component({});
        expect(container.findByType(BoldText)).toBeDefined();
    });
    it('Should have a back button', () => {
        const { container } = Component({});
        expect(find(container, backButton)).toBeDefined();
    });
    it('Should have a Submit button', () => {
        const { container } = Component({});
        expect(find(container, submitButton)).toBeDefined();
    });
    it('Should call back press event when user clicks on back button', () => {
        const onBackPressMock = jest.fn();
        const { container } = Component({
            onBackPress: onBackPressMock,
        });
        fireEvent(find(container, backButton), 'Press');

        expect(onBackPressMock).toHaveBeenCalled();
    });
    it('Should call submit press event when user clicks on Submit button', () => {
        const onSubmitPressMock = jest.fn();
        const { container } = Component({
            onSubmitPress: onSubmitPressMock,
        });
        fireEvent(find(container, submitButton), 'Press');

        expect(onSubmitPressMock).toHaveBeenCalled();
    });
    it('Should call Attestation radio press event when user clicks on radio button', () => {
        const options = [
            {
                id: COMPLETED_INTRO_SESSIONS_AT_EVENT,
                label: 'At an event',
                firebaseEvent: 'taken3Sittings_atEvent',
            },
        ];
        const onAttestationRadioPressMock = jest.fn();
        const { container } = Component({
            onAttestationRadioPress: onAttestationRadioPressMock,
            options,
        });
        fireEvent(container.findByType(Radio), 'Press');

        expect(onAttestationRadioPressMock).toHaveBeenCalled();
    });
});