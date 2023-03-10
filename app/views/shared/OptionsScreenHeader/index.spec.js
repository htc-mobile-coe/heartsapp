import React from 'react';
import OptionsScreenHeaderComponent from './index';
import { MediumBoldText } from '../Text';
import BackButton from '../BackButton';
import { render, fireEvent, find } from 'TestUtils';

describe('OptionsScreenHeader', () => {
    const Component = (props) => {
        return render(<OptionsScreenHeaderComponent {...props} />);
    };

    it('Should exist', () => {
        const { container } = Component();
        expect(container).toBeDefined();
    });

    it('Should render a BackButton component', () => {
        const { container } = Component();
        expect(container.findByType(BackButton)).toBeDefined();
    });

    it('Should render a MediumBoldText component when title is available', () => {
        const { container } = Component({
            title: 'titleMock',
        });
        expect(container.findByType(MediumBoldText)).toBeDefined();
    });

    it('Should call onBackPress when back button is pressed', () => {
        const onBackPressMock = jest.fn();
        const { container } = Component({
            onBackPress: onBackPressMock,
        });

        fireEvent(container.findByType(BackButton), 'onBackPress');

        expect(onBackPressMock).toHaveBeenCalled();
    });
});
