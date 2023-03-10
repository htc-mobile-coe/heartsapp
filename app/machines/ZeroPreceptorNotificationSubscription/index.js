import { isPreceptor } from '../../state/user/operations';
import { get, isUndefined } from 'lodash';
import { machine } from './machine';
import {
    subscribeToZeroPreceptorConditionNotification,
    unsubscribeFromZeroPreceptorConditionNotification,
} from '../../services/firebase/MessagingService';
import StorageService from '../../services/native/AppStorageService';
import { interpret, State } from 'xstate';

export const Events = {
    NOTIFICATION_ENABLED: 'NOTIFICATION_ENABLED',
    NOTIFICATION_DISABLED: 'NOTIFICATION_DISABLED',

    HOME_SCREEN_ENTRY: 'HOME_SCREEN_ENTRY',

    AVAILABLE_FOR_SITTINGS: 'AVAILABLE_FOR_SITTINGS',
    UNAVAILABLE_FOR_SITTINGS: 'UNAVAILABLE_FOR_SITTINGS',

    MEDITATION_SESSION_STARTED: 'MEDITATION_SESSION_STARTED',
    MEDITATION_SESSION_ENDED: 'MEDITATION_SESSION_ENDED',
};

class Service {
    initialize = (dispatch, getState) => {
        this.getState = getState;
        this.dispatch = dispatch;
        this.machine = this._initializeMachine();
        this.machineService = interpret(this.machine);
        this._start();

        this.machineService.onTransition(state => {
            StorageService.zeroPreceptorNotificationSubscriptionMachine.setValue(
                state,
            );
        });
    };

    reset = () => {
        this.machineService.stop();
        StorageService.zeroPreceptorNotificationSubscriptionMachine
            .clear()
            .catch(() => {});
        this.initialize(this.dispatch, this.getState);
    };

    send = event => {
        this.machineService.send(event);
    };

    _start = async () => {
        const initialState = await this._getInitialState();

        if (!isUndefined(initialState)) {
            const previousState = State.create(initialState);
            const resolvedState = this.machine.resolveState(previousState);
            this.machineService = this.machineService.start(resolvedState);
        } else {
            this.machineService.start();
        }
    };

    _getInitialState = async () => {
        try {
            return await StorageService.zeroPreceptorNotificationSubscriptionMachine.getValue();
        } catch (e) {
            return undefined;
        }
    };

    _canSubscribe = () => {
        const state = this.getState();
        const isPreceptorUnAvailableForSittings = !get(
            state,
            'preceptorDashboard.available',
        );
        const isZeroPreceptorNotificationEnabled = get(
            state,
            'preceptorDashboard.isZeroPreceptorNotificationEnabled',
        );
        return (
            isPreceptor(state) &&
            isPreceptorUnAvailableForSittings &&
            isZeroPreceptorNotificationEnabled
        );
    };

    _initializeMachine = () =>
        machine.withConfig({
            guards: {
                canSubscribe: this._canSubscribe,
            },
            services: {
                subscribeToFirebaseTopic: subscribeToZeroPreceptorConditionNotification,
                unSubscribeFromFirebaseTopic: unsubscribeFromZeroPreceptorConditionNotification,
            },
        });
}

export const ZeroPreceptorNotificationSubscriptionMachine = new Service();
