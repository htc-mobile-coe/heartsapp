import { service as SeekerMeditationSessionService } from '../../services/meditation/SeekerMeditationSession';

import { Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Scenes } from '../../shared/Constants';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import {
    Events,
    ZeroPreceptorNotificationSubscriptionMachine,
} from '../../machines/ZeroPreceptorNotificationSubscription';

export const handleMeditateWithTrainerPress = async (
    noOfAdditionalSeekers,
    setBusy,
    resetSeekerMeditationState,
) => {
    setBusy(true);
    const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();

    if (canDoNetworkCalls) {
        try {
            resetSeekerMeditationState();
            Actions.push(Scenes.seekerMeditationSession);
            SeekerMeditationSessionService.request(noOfAdditionalSeekers);

            ZeroPreceptorNotificationSubscriptionMachine.send(
                Events.MEDITATION_SESSION_STARTED,
            );
        } catch (e) {
            Alert.alert('Error', e.message);
        }
    }

    setBusy(false);
};
