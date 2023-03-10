import React from 'react';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import CancelMeditationConfirmationPopup from './CancelMeditationConfirmationPopup';
import { Button } from '../shared';

describe('CancelMeditationConfirmationPopup', () => {
    const cancelConfirmationYesButtonPress =
        'cancelMeditationConfirmationPopup__yes--button';
    const cancelConfirmationNoButtonPress =
        'cancelMeditationConfirmationPopup__no--button';
    const titleText = 'cancelMeditationConfirmationPopup__title--text';
    const descriptionText =
        'cancelMeditationConfirmationPopup__description--text';
    const Component = props => { 
        return render(<CancelMeditationConfirmationPopup {...props} />); 
    };

    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });

    it('Should have 2 Button component for Yes and No', () => {
        const { container } = Component();
        expect(container.findAllByType(Button)).toHaveLength(2);
    });
    it('Should have 1 titleText component for rendering title', () => {
        const { container } = Component();
        expect(find(container, titleText)).toBeDefined();
    });
    it('Should have 1 descriptionText component for rendering description', () => {
        const { container } = Component();
        expect(find(container, descriptionText)).toBeDefined();
    });
    it('Should fire onCancelConfirmationYesButtonPress event, when Yes button Pressed', () => {
        const yesButtonPressMock = jest.fn();
        const { container } = Component({
            onCancelConfirmationYesButtonPress: yesButtonPressMock,
        });
        fireEvent(find(container, cancelConfirmationYesButtonPress), 'Press');
        expect(yesButtonPressMock).toHaveBeenCalled();
    });

    it('Should fire onCancelConfirmationNoButtonPress event, When No button pressed ', () => {
        const noButtonPressMock = jest.fn();
        const { container } = Component({
            onCancelConfirmationNoButtonPress: noButtonPressMock,
        });
        fireEvent(find(container, cancelConfirmationNoButtonPress), 'Press');
        expect(noButtonPressMock).toHaveBeenCalled();
    });
});
