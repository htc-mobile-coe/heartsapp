import React from 'react';
import { Input } from 'native-base';
import { Image } from 'react-native';
import FormDurationInput from './FormDurationInput';
import { Text } from 'app/views/shared/Text';
import { render } from 'app/utils/TestUtils';

describe('FormDurationInput', () => {
    const Component = props => {
        return render(<FormDurationInput {...props} />);
    };

    it('Should exist', () => {
        const { container } = Component();
        expect(container).toBeDefined();
    });
    it('Should have a Input component to display duration', () => {
        const { container } = Component({});
        expect(container.findByType(Input)).toBeDefined();
    });
    it('Should have a Image component to show the clock icon', () => {
        const { container } = Component();
        expect(container.findByType(Image)).toBeDefined();
    });
    it('Should have a Text component when there is an error', () => {
        const { container } = Component({
            error: 'errorMock',
        });
        expect(container.findByType(Text)).toBeDefined();
    });
});
