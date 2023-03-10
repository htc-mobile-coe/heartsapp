import { machine } from './machine';
import { assign, interpret } from 'xstate';
import { isNil, get, isEqual, last, concat, slice, isEmpty } from 'lodash';
import { log } from '../../services/DiagnosticLogService';
import { Actions } from 'react-native-router-flux';
import operations from '../../state/operations';
import { SITTING_DETAILS_CONTAINER_TYPE } from '../../views/SittingHistoryScreen/SittingDetailsScreen/SittingDetailsContainerType';

export const Events = {
    SHOW_SEEKERS_SELECTION_COMPONENT: 'SHOW_SEEKERS_SELECTION_COMPONENT',
    SHOW_BARCODE_SCANNED_RESULT: 'SHOW_BARCODE_SCANNED_RESULT',
    SHOW_SEEKER_SEARCH_RESULT: 'SHOW_SEEKER_SEARCH_RESULT',
    SHOW_SEEKERS_SELECTED: 'SHOW_SEEKERS_SELECTED',
    SHOW_SESSION_DETAILS: 'SHOW_SESSION_DETAILS',
    GO_BACK: 'GO_BACK',
    ADDING_SEEKERS: 'ADDING_SEEKERS',
    SUBMIT: 'SUBMIT',
};

export const States = {
    ADDING_OFFLINE_SITTING_DETAILS: 'addingOfflineSittingDetails',
    SELECTING_SEEKERS: 'selectingSeekers',
    DISPLAYING_SEEKER_BARCODE_SCANNED_RESULT:
        'displayingSeekerBarcodeScannedResult',
    DISPLAYING_SEEKER_SEARCH_RESULT: 'displayingSeekerSearchResult',
    SEEKERS_SELECTED: 'seekersSelected',
};

class Service {
    TAG = 'OfflineSittingDetailMachine';

    initialize = (dispatch, getState, config = this.machineConfig) => {
        this.getState = getState;
        this.dispatch = dispatch;
        this.stop();
        this.machine = machine.withConfig(config);
        this.machineService = interpret(this.machine);
        this.machineService.onTransition(this._onStateChange);
        this.machineService.onDone(this._onDone);
    };

    getCurrentState = () => this.machineService.state;

    isDone = () => this.machineService.state.done;

    _onStateChange = state => {
        const previousState = get(state, 'history.value');
        log(this.TAG, 'StateChange', {
            previousState,
            triggeredEvent: state.event.type,
            currentState: state.value,
        });
    };

    _onDone = event => {
        log(this.TAG, 'Done', {
            data: event.data,
        });
    };

    start = () => {
        if (!isNil(this.machineService)) {
            this.machineService.start();
        }
    };

    stop = () => {
        if (!isNil(this.machineService)) {
            this.machineService.stop();
            log(this.TAG, 'Stop', {
                machineId: this.machineService.sessionId,
            });
        }
    };

    onShowSeekersSelection = () => {
        this.machineService.send({
            type: Events.SHOW_SEEKERS_SELECTION_COMPONENT,
        });
    };

    onShowSeekerBarcodeScannedResult = () => {
        this.machineService.send({
            type: Events.SHOW_BARCODE_SCANNED_RESULT,
        });
    };

    onShowSeekerSearchResult = () => {
        this.machineService.send({
            type: Events.SHOW_SEEKER_SEARCH_RESULT,
        });
    };

    onShowSelectedSeekers = () => {
        this.machineService.send({
            type: Events.SHOW_SEEKERS_SELECTED,
        });
    };

    onShowSessionDetails = seekerList => {
        this.machineService.send({
            type: Events.SHOW_SESSION_DETAILS,
            seekerList,
        });
    };

    onAddingSeekers = seekerList => {
        this.machineService.send({
            type: Events.ADDING_SEEKERS,
            seekerList,
        });
    };

    onSubmit = (previousScreen, screenParams) => {
        this.machineService.send({
            type: Events.SUBMIT,
            previousScreen,
            screenParams,
        });
    };

    onGoBack = previousScreen => {
        this.machineService.send({
            type: Events.GO_BACK,
            previousScreen,
        });
    };

    doesSeekersListHasSomeValues = (context, event) => {
        return !isEmpty(event.seekerList);
    };

    isMatchingTargetState = (context, event, { cond }) => {
        const { targetState } = cond;
        const history = context.history;
        return isEqual(last(history), targetState);
    };

    _transitionUIState = event => {
        operations.offlineSittingDetail.setOfflineSittingDetailUIState(
            event.uiState,
        )(this.dispatch);
    };

    showAddOfflineSittingDetailsComponent = (context, event) => {
        this._transitionUIState({
            uiState: SITTING_DETAILS_CONTAINER_TYPE.ADD_OFFLINE_SITTING_DETAILS,
        });
    };

    showSeekersSelectionComponent = (context, event) => {
        this._transitionUIState({
            uiState: SITTING_DETAILS_CONTAINER_TYPE.SEEKER_SELECTION_COMPONENT,
        });
    };

    showSeekerBarcodeScannedResultComponent = (context, event) => {
        this._transitionUIState({
            uiState:
                SITTING_DETAILS_CONTAINER_TYPE.SEEKER_BARCODE_SCANNED_RESULT,
        });
    };

    showSeekerSearchResultComponent = (context, event) => {
        this._transitionUIState({
            uiState: SITTING_DETAILS_CONTAINER_TYPE.SEEKER_SEARCH_RESULT,
        });
    };

    showSelectedSeekersComponent = (context, event) => {
        this._transitionUIState({
            uiState: SITTING_DETAILS_CONTAINER_TYPE.SELECTED_SEEKERS,
        });
    };

    pushToHistory = assign({
        history: (context, event, { state }) => {
            return concat(context.history, state.value);
        },
    });

    popFromHistory = assign({
        history: context => {
            return slice(context.history, 0, context.history.length - 1);
        },
    });

    goToPreviousScreen = (context, event) => {
        Actions.jump(event.previousScreen, event.screenParams);
    };

    machineConfig = {
        guards: {
            doesSeekersListHasSomeValues: this.doesSeekersListHasSomeValues,
            isMatchingTargetState: this.isMatchingTargetState,
        },
        actions: {
            showAddOfflineSittingDetailsComponent: this
                .showAddOfflineSittingDetailsComponent,
            showSeekersSelectionComponent: this.showSeekersSelectionComponent,
            showSeekerBarcodeScannedResultComponent: this
                .showSeekerBarcodeScannedResultComponent,
            showSeekerSearchResultComponent: this
                .showSeekerSearchResultComponent,
            showSelectedSeekersComponent: this.showSelectedSeekersComponent,
            pushToHistory: this.pushToHistory,
            popFromHistory: this.popFromHistory,
            goToPreviousScreen: this.goToPreviousScreen,
        },
    };
}

export const OfflineSittingDetailMachine = new Service();
