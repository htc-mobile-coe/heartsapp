import { Machine } from 'xstate';

export const machine = Machine(
    {
        id: 'OfflineSittingDetail',
        initial: 'addingOfflineSittingDetails',
        context: {
            history: [],
        },
        states: {
            addingOfflineSittingDetails: {
                entry: ['showAddOfflineSittingDetailsComponent'],
                on: {
                    SHOW_SEEKERS_SELECTION_COMPONENT: 'selectingSeekers',
                    GO_BACK: 'exited',
                    SUBMIT: 'exited',
                },
            },
            selectingSeekers: {
                entry: ['showSeekersSelectionComponent'],
                on: {
                    SHOW_BARCODE_SCANNED_RESULT:
                        'displayingSeekerBarcodeScannedResult',
                    SHOW_SEEKER_SEARCH_RESULT: 'displayingSeekerSearchResult',
                    SHOW_SEEKERS_SELECTED: [
                        {
                            target: 'seekersSelected',
                            actions: 'pushToHistory',
                        },
                    ],
                    GO_BACK: 'addingOfflineSittingDetails',
                },
            },
            displayingSeekerBarcodeScannedResult: {
                entry: ['showSeekerBarcodeScannedResultComponent'],
                on: {
                    GO_BACK: 'selectingSeekers',
                    ADDING_SEEKERS: [
                        {
                            target: 'addingOfflineSittingDetails',
                            cond: 'doesSeekersListHasSomeValues',
                        },
                    ],
                    SHOW_SEEKERS_SELECTED: [
                        {
                            target: 'seekersSelected',
                            actions: 'pushToHistory',
                        },
                    ],
                },
            },
            displayingSeekerSearchResult: {
                entry: ['showSeekerSearchResultComponent'],
                on: {
                    GO_BACK: 'selectingSeekers',
                    ADDING_SEEKERS: [
                        {
                            target: 'addingOfflineSittingDetails',
                            cond: 'doesSeekersListHasSomeValues',
                        },
                    ],
                    SHOW_SEEKERS_SELECTED: [
                        {
                            target: 'seekersSelected',
                            actions: 'pushToHistory',
                        },
                    ],
                },
            },
            seekersSelected: {
                entry: ['showSelectedSeekersComponent'],
                on: {
                    GO_BACK: [
                        {
                            target: 'selectingSeekers',
                            cond: {
                                type: 'isMatchingTargetState',
                                targetState: 'selectingSeekers',
                            },
                            actions: 'popFromHistory',
                        },
                        {
                            target: 'displayingSeekerBarcodeScannedResult',
                            cond: {
                                type: 'isMatchingTargetState',
                                targetState:
                                    'displayingSeekerBarcodeScannedResult',
                            },
                            actions: 'popFromHistory',
                        },
                        {
                            target: 'displayingSeekerSearchResult',
                            cond: {
                                type: 'isMatchingTargetState',
                                targetState: 'displayingSeekerSearchResult',
                            },
                            actions: 'popFromHistory',
                        },
                    ],
                    SHOW_SESSION_DETAILS: [
                        {
                            target: 'addingOfflineSittingDetails',
                            cond: 'doesSeekersListHasSomeValues',
                        },
                    ],
                },
            },
            exited: {
                type: 'final',
                entry: ['goToPreviousScreen'],
            },
        },
    },
    {
        gaurds: {
            doesSeekersListHasSomeValues: () => true,
            isMatchingTargetState: () => true,
        },
        actions: {
            showAddOfflineSittingDetailsComponent: () => {},
            showSeekersSelectionComponent: () => {},
            showSeekerBarcodeScannedResultComponent: () => {},
            showSeekerSearchResultComponent: () => {},
            showSelectedSeekersComponent: () => {},
            pushToHistory: () => {},
            popFromHistory: () => {},
            goToPreviousScreen: () => {},
        },
    },
);
