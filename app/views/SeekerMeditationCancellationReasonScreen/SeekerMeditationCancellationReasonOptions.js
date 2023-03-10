import { MEDITATION_CANCEL_OPTION } from '../../shared/Constants';
import i18n from 'i18next';

export const SeekerMeditationCancellationReasonOptions = [
    {
        label: i18n.t(
            'seekerMeditationCancellationReasonScreen:reasonByMistake',
        ),
        id: MEDITATION_CANCEL_OPTION.HERE_BY_MISTAKE,
        firebaseEvent: 'hereByMistake',
    },
    {
        label: i18n.t(
            'seekerMeditationCancellationReasonScreen:reasonNotReadyYet',
        ),
        id: MEDITATION_CANCEL_OPTION.NOT_READY_YET,
        firebaseEvent: 'notReadyYet',
    },
    {
        label: i18n.t(
            'seekerMeditationCancellationReasonScreen:reasonSomethingElseHasComeUp',
        ),
        id: MEDITATION_CANCEL_OPTION.SOMETHING_ELSE_HAS_COME_UP,
        firebaseEvent: 'somethingElse',
    },
    {
        label: i18n.t('seekerMeditationCancellationReasonScreen:otherReasons'),
        id: MEDITATION_CANCEL_OPTION.OTHER_REASONS,
        firebaseEvent: 'otherReasons',
    },
];
