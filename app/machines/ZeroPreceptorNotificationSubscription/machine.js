import { Machine } from 'xstate';

export const States = {
    UNSUBSCRIBED: 'unsubscribed',
    SUBSCRIBING: 'subscribing',
    SUBSCRIBED: 'subscribed',
    UNSUBSCRIBING: 'unsubscribing',
};

const goToSubscribingState = {
    target: States.SUBSCRIBING,
    cond: 'canSubscribe',
};

export const machine = Machine(
    {
        id: 'ZeroPreceptorNotificationSubscription',
        initial: States.UNSUBSCRIBED,
        states: {
            unsubscribed: {
                on: {
                    NOTIFICATION_ENABLED: goToSubscribingState,
                    HOME_SCREEN_ENTRY: goToSubscribingState,
                    UNAVAILABLE_FOR_SITTINGS: goToSubscribingState,
                    MEDITATION_SESSION_ENDED: goToSubscribingState,
                },
            },
            subscribing: {
                invoke: {
                    id: 'subscribingToTopic',
                    src: 'subscribeToFirebaseTopic',
                    onDone: {
                        target: States.SUBSCRIBED,
                    },
                    onError: {
                        target: States.UNSUBSCRIBED,
                    },
                },
            },
            subscribed: {
                on: {
                    NOTIFICATION_DISABLED: States.UNSUBSCRIBING,
                    AVAILABLE_FOR_SITTINGS: States.UNSUBSCRIBING,
                    MEDITATION_SESSION_STARTED: States.UNSUBSCRIBING,
                },
            },
            unsubscribing: {
                invoke: {
                    id: 'unsubscribingFromTopic',
                    src: 'unSubscribeFromFirebaseTopic',
                    onDone: {
                        target: States.UNSUBSCRIBED,
                    },
                    onError: {
                        target: States.SUBSCRIBED,
                    },
                },
            },
        },
    },
    {
        guards: {
            canSubscribe: () => true,
        },
        services: {
            subscribeToFirebaseTopic: () => Promise.resolve(),
            unSubscribeFromFirebaseTopic: () => Promise.resolve(),
        },
    },
);
