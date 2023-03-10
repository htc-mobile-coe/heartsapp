import React from 'react';
import FormDurationInput from './FormDurationInput';
import { FormDurationInputContainer } from './index';
import moment from 'moment';
import { render } from 'app/utils/TestUtils';

describe('FormDurationInputContainer', () => {
    const Component = props => {
        return render(<FormDurationInputContainer {...props} />);
    };

    it('By default should have FormDurationInput component', () => {
        const { container } = Component({
            values: { startTime: moment(), endTime: moment() },
        });
        expect(container.findByType(FormDurationInput)).toBeDefined();
    });
    it('Should able to  get duration value from getDurationValue', () => {
        const { container } = Component({
            values: { startTime: moment(), endTime: moment().add(35, 'm') },
        });
        expect(container.findByType(FormDurationInput)).toHaveProp('value',
            '35:00 min',
        );
    });
});
