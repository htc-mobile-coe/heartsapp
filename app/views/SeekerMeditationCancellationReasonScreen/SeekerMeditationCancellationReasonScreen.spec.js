import React from 'react';
import SeekerMeditationCancellationReasonScreen from './SeekerMeditationCancellationReasonScreen';
import Radio from '../shared/Radio';
import { Button } from '../shared';
import { render, fireEvent, find } from '../../utils/TestUtils';
import i18n from 'i18next';

describe('SeekerMeditationCancelScreen', () => {
    const submitButton = 'seekerMeditationCancelScreen__submit--button';
    const mediumBoldText = 'seekerMeditationCancelScreen__MediumBoldText'
    const radioButtonOptionsMock = [
        {
            label: i18n.t(
                'seekerMeditationCancellationReasonScreen:reasonByMistake',
            ),
            id: 'HERE_BY_MISTAKE',
            firebaseEvent: 'hereByMistake',
        },
        {
            label: i18n.t(
                'seekerMeditationCancellationReasonScreen:reasonNotReadyYet',
            ),
            id: 'NOT_READY_YET',
            firebaseEvent: 'notReadyYet',
        },
        {
            label: i18n.t(
                'seekerMeditationCancellationReasonScreen:reasonSomethingElseHasComeUp',
            ),
            id: 'SOMETHING_ELSE_HAS_COME_UP',
            firebaseEvent: 'somethingElse',
        },
        {
            label: i18n.t(
                'seekerMeditationCancellationReasonScreen:otherReasons',
            ),
            id: 'OTHER_REASONS',
            firebaseEvent: 'otherReasons',
        },
    ];
    const Component = (props) => {
        return render(<SeekerMeditationCancellationReasonScreen {...props} />);
    };
    it('Should exist', () => {
        const { container } = Component();
        expect(container).toBeDefined();
    });

    it('Should contain one button component for cancelling the session ', () => {
        const { container } = Component();
        expect(container.findAllByType(Button)).toHaveLength(1);
    });

    it('Should contain 4 radio button component for rendering cancel reason', () => {
        const { container } = Component({
            radioButtonOptions: radioButtonOptionsMock,
            sessionCancellationReason: [
                {
                    label: i18n.t(
                        'seekerMeditationCancellationReasonScreen:reasonByMistake',
                    ),
                    id: 'HERE_BY_MISTAKE',
                    firebaseEvent: 'hereByMistake',
                },
            ],
        });
        expect(container.findAllByType(Radio)).toHaveLength(4);
    });

    it('Should have title text for cancel reason screen', () => {
        const { container } = Component();
        expect(find(container, mediumBoldText)).toBeDefined();
    });

    it('Should call the method onCancellationReasonRadioPress when radio button is selected', () => {
        const onCancellationReasonRadioPressMock = jest.fn();
        const { container } = Component({
            radioButtonOptions: radioButtonOptionsMock,
            onCancellationReasonRadioPress: onCancellationReasonRadioPressMock,
            sessionCancellationReason: [
                {
                    label: i18n.t(
                        'seekerMeditationCancellationReasonScreen:reasonByMistake',
                    ),
                    id: 'HERE_BY_MISTAKE',
                    firebaseEvent: 'hereByMistake',
                },
            ],
        });
        fireEvent.press(
            container.findAllByType(Radio)[0],
            'HERE_BY_MISTAKE'
        );
        expect(onCancellationReasonRadioPressMock).toHaveBeenCalledWith(
            'HERE_BY_MISTAKE',
        );
    });
    it('Should fire cancel reason when any reason is selected and submit button is pressed', () => {
        const onPressMock = jest.fn();
        const { container } = Component({
            onCancellationReasonSubmitPress: onPressMock,
            disableSubmitButton: true,
        });

        expect(find(container, submitButton)).toBeDefined();
        fireEvent.press(
            find(container, submitButton)
        );
        expect(onPressMock).toHaveBeenCalled();
    });
});
