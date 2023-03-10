import React from 'react';
import { SelectedSeekersContainer } from './index';
import SelectedSeekers from './SelectedSeekers';
import { render, fireEvent } from 'app/utils/TestUtils';

describe('SelectedSeekersContainer', () => {
    const Component = props => {
        return render(<SelectedSeekersContainer {...props} />);
    };

    it('Should render SelectedSeekers component', () => {
        const { container } = Component();
        expect(container.findByType(SelectedSeekers)).toBeDefined();
    });

    it('Should call onBackPress when back button is pressed', () => {
        const onBackPressMock = jest.fn();
        const { container } = Component({
            onBackPress: onBackPressMock,
        });
        fireEvent(container.findByType(SelectedSeekers), 'BackPress');
        expect(onBackPressMock).toBeCalled();
    });

    it('Should call onGoToSessionDetailsPress when onGoToSessionDetails button is pressed', () => {
        const onGoToSessionDetailsPressMock = jest.fn();
        const { container } = Component({
            onGoToSessionDetailsPress: onGoToSessionDetailsPressMock,
        });
        fireEvent(container.findByType(SelectedSeekers), 'GoToSessionDetailsPress');
        expect(onGoToSessionDetailsPressMock).toBeCalled();
    });
});
