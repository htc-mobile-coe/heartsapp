import React from 'react';
import { render, fireEvent, findByProps } from '../../utils/TestUtils';
import StatusSwitch from './StatusSwitch';
import { MediumBoldText } from '../shared';
import Switch from 'app/views/shared/Switch';

describe('StatusSwitch', () => {
    const Component = (props) => render(<StatusSwitch {...props} />);

    it('Should exist StatusSwitch', () => {
        const { container } = Component({});
        expect(container).toBeDefined()
    });

    it('Should render 1 MediumBoldText', () => {
        const { container } = Component({});
        expect(container.findAllByType(MediumBoldText)).toHaveLength(1);
    });

    it('Should show value in MediumBoldText', () => {
        const { container } = Component({
            text: 'text value',
        });
        expect(container.findByType(MediumBoldText)).toHaveProp('children', 'text value');
    });

    it('Should render 1 Switch', () => {
        const { container } = Component({});
        expect(container.findAllByType(Switch)).toHaveLength(1);
    });

    it('Should turn on switch when value is true', () => {
        const { container } = Component({
            value: true,
        });
        const switchComponent = container.findByType(Switch);
        expect(switchComponent).toBeDefined();
        expect(findByProps(switchComponent, 'value', true)).toBeDefined();
    });

    it('Should call onValueChange event on switch value change', () => {
        const onValueChangeMock = jest.fn();
        const { container } = Component({
            onValueChange: onValueChangeMock,
        });
        fireEvent(container.findByType(Switch), 'valueChange');
        expect(onValueChangeMock).toHaveBeenCalled();
    });
});
