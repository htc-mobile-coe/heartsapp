import React from 'react';
import { storiesOf } from '@storybook/react-native';
import '../../i18n';
import SeekerMeditationSessionScreen from './SeekerMeditationSessionScreen';
import moment from 'moment';
import { SEEKER_MEDITATION_ANIMATION_OPTIONS } from './SeekerMeditationAnimation';

storiesOf('Meditation screen', module)
    .add('Default', () => (
        <SeekerMeditationSessionScreen
            meditationStatus={'Please wait'}
            connectedToTrainer={false}
            progressText={'We are connecting to a trainer\nwait could be upto'}
            showTimer={false}
            onCancelConfirmationYesButtonPress={() => {}}
            meditationSessionStartTime={moment()}
            runTimer={false}
            enableNightMode={false}
            seekerMeditationAnimation={
                SEEKER_MEDITATION_ANIMATION_OPTIONS.SEEKER_WAITING_FOR_TRAINER
            }
            showCancelMeditationConfirmationModal={false}
        />
    ))
    .add('Meditation Relaxation', () => (
        <SeekerMeditationSessionScreen
            meditationStatus={'Please wait'}
            connectedToTrainer={false}
            shouldPlayGuidedRelaxationAudio={true}
            waitingInstructionHeading={
                'To prepare for this  session (max 35 min)'
            }
            isMeditationCompleted={false}
            showTimer={false}
            onCancelConfirmationYesButtonPress={() => {}}
            enableNightMode={false}
            showCancelButton={true}
            seekerMeditationAnimation={
                SEEKER_MEDITATION_ANIMATION_OPTIONS.SEEKER_WAITING_FOR_TRAINER
            }
            showCancelMeditationConfirmationModal={false}
        />
    ))
    .add('Meditation show Guidelines Accordion', () => (
        <SeekerMeditationSessionScreen
            meditationStatus={'Please wait'}
            connectedToTrainer={false}
            shouldPlayGuidedRelaxationAudio={true}
            showGuidelinesAccordion={true}
            waitingInstructionHeading={
                'To prepare for this  session (max 35 min)'
            }
            isMeditationCompleted={false}
            showTimer={false}
            onCancelConfirmationYesButtonPress={() => {}}
            enableNightMode={false}
            showCancelButton={true}
            seekerMeditationAnimation={
                SEEKER_MEDITATION_ANIMATION_OPTIONS.SEEKER_WAITING_FOR_TRAINER
            }
            showCancelMeditationConfirmationModal={false}
        />
    ))
    .add('Meditation 4Min', () => (
        <SeekerMeditationSessionScreen
            meditationStatus={'Please wait'}
            connectedToTrainer={false}
            shouldPlayGuidedRelaxationAudio={false}
            waitingInstructionHeading={
                'You will be connected \nwith a trainer within'
            }
            seekerMeditationAnimation={
                SEEKER_MEDITATION_ANIMATION_OPTIONS.SEEKER_WAITING_FOR_TRAINER
            }
            countDownEndTime={moment().add(4, 'minutes')}
            isMeditationCompleted={false}
            onCancelConfirmationYesButtonPress={() => {}}
            showCancelMeditationConfirmationModal={false}
        />
    ))
    .add('Meditation waiting for accept trainer', () => (
        <SeekerMeditationSessionScreen
            meditationStatus={'Please wait'}
            connectedToTrainer={true}
            shouldPlayGuidedRelaxationAudio={false}
            waitingInstructionHeading={'Connected with trainer'}
            seekerMeditationAnimation={
                SEEKER_MEDITATION_ANIMATION_OPTIONS.TRAINER_CONNECTED_WITH_SEEKER
            }
            showTimer={false}
            countDownEndTime={moment().add(4, 'minutes')}
            onCancelConfirmationYesButtonPress={() => {}}
            showCancelMeditationConfirmationModal={false}
        />
    ))
    .add('Meditation inProgress', () => (
        <SeekerMeditationSessionScreen
            meditationStatus={''}
            connectedToTrainer={true}
            isMeditationCompleted={false}
            progressText={'Meditation in progress...'}
            preceptorName={'Hubert Blaine Wolfeschlegelsteinhausenbergerdorff'}
            elapsedMeditationDuration={'02:45'}
            onCancelConfirmationYesButtonPress={() => {}}
            showCancelMeditationConfirmationModal={false}
            showTimer={true}
            meditationSessionStartTime={moment()}
            runTimer={true}
            enableNightMode={false}
            seekerMeditationAnimation={
                SEEKER_MEDITATION_ANIMATION_OPTIONS.SEEKER_WAITING_FOR_TRAINER
            }
        />
    ))
    .add('Meditation completed', () => (
        <SeekerMeditationSessionScreen
            meditationStatus={'Meditation completed'}
            progressText={'You have meditated'}
            connectedToTrainer={true}
            elapsedMeditationDuration={'12:45'}
            showReminderButton={true}
            showGoToHomeButton={true}
            enableNightMode={false}
            onCancelConfirmationYesButtonPress={() => {}}
            showCancelMeditationConfirmationModal={false}
            seekerMeditationAnimation={
                SEEKER_MEDITATION_ANIMATION_OPTIONS.SEEKER_MEDITATION_SESSION_IN_PROGRESS
            }
        />
    ));
