import React from 'react';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import AdditionalAbhyasisForm from './AdditionalAbhyasisForm';
import { Text, Button, BolderText } from '../shared';
import { TouchableOpacity } from 'react-native';
import { Input } from 'native-base';

describe('AdditionalAbhyasisForm', () => {
    const decreaseAbhyasisCount = 'additionalAbhyasisForm__decreaseCount--button'
    const errorMessage = 'additionalAbhyasisForm__errorMessage--text'
    const increaseAbhyasisCount = 'additionalAbhyasisForm__increaseCount--button'
    const error = {
        additionalAbhyasisCount: 5,
        styles: {}
    }
    const values = {
        additionalAbhyasisCount: 5,
        maximumAbhyasisAllowed: 10,
        styles: {}

    }
    const setFieldValueMock = jest.fn();
    const Component = (props) => {
        return render(<AdditionalAbhyasisForm {...props} setFieldValue={setFieldValueMock}/>);
    };
    afterEach(() => {
        setFieldValueMock.mockClear();
    });
    it('Should exist', () => {
        const { container } = Component({
            values: { values },
            errors: {
                additionalAbhyasisCount: null,
                styles: {}
            }
        });
        expect(container).toBeDefined();
    });

    it('Should render error text passed as parameter ', () => {
        const { container } = Component(
            {
                values: { values },
                errors: {
                    additionalAbhyasisCount: 5,
                    styles: {}
                }
            }
        );
        expect(find(container, errorMessage)).toHaveProp('children',5);
    });

    it('Should render a Text component for display number of Abhyasis', () => {
        const { container } = Component({
            values: { values },
            errors: { error }
        });
        expect(container.findAllByType(Text)).toHaveLength(1);
    });

    it('Should have a TouchableOpacity component for both increase and decrease of abhyasis count', () => {
        const { container } = Component({
            values: { values },
            errors: { error }
        });
        expect(container.findAllByType(TouchableOpacity)).toHaveLength(2);
    });

    it('Should have a Submit Button component', () => {
        const { container } = Component({
            values: { values },
            errors: { error }
        });
        expect(container.findAllByType(Button)).toHaveLength(1);
    });

    it('Should have a BolderText component when showDNDInstruction is true', () => {
        const { container } = Component({
            showDNDInstruction: true,
            values: { values },
            errors: { error }
        });
        expect(container.findAllByType(BolderText)).toHaveLength(1);
    });

    it('Should call setFieldValue when the input value has changed', () => {
        const { container } = Component({
            values: { maximumAbhyasisAllowed: 20, additionalAbhyasisCount: 5, },
            errors: { error }
        });
        fireEvent(container.findByType(Input), 'onChangeText', '4');
        expect(setFieldValueMock).toBeCalledWith('additionalAbhyasisCount', '4');
    });

    it('Should not call setFieldValue when the input value has changed and the value is greater than maximumAbhyasisAllowed count', () => {
        const { container } = Component({
            values: { maximumAbhyasisAllowed: 20, additionalAbhyasisCount: 5, },
            errors: { error }
        });
        fireEvent(container.findByType(Input), 'onChangeText', '24');
        expect(setFieldValueMock).not.toBeCalled();
    });

    it('Should able to call setFieldValue with 0, when the input is empty', () => {
        const { container } = Component({
            values: {
                additionalAbhyasisCount: 5,
                maximumAbhyasisAllowed: 20,
                styles: {}
            },
            errors: { error }
        });
        fireEvent(container.findByType(Input), 'onChangeText');
        expect(setFieldValueMock).toBeCalledWith('additionalAbhyasisCount', '0');
    });

    it('Should call setFieldValue, when increaseAbhyasisCount button pressed', () => {
        const { container } = Component({
            values: {
                additionalAbhyasisCount: 5,
                maximumAbhyasisAllowed: 20,
                styles: {}
            },
            errors: {
                additionalAbhyasisCount: null,
                styles: {}
            }
        });
        fireEvent(find(container, increaseAbhyasisCount), 'Press');
        expect(setFieldValueMock).toBeCalledWith('additionalAbhyasisCount', '6');
    });

    it('Should not call setFieldValue, when increaseAbhyasisCount button pressed and additionalAbhyasisCount is reached maximumAbhyasisAllowed count', () => {
        const { container } = Component({
            values: {
                additionalAbhyasisCount: 20,
                maximumAbhyasisAllowed: 20,
                styles: {}
            },
            errors: {
                additionalAbhyasisCount: null,
                styles: {}
            }
        });
        fireEvent(find(container, increaseAbhyasisCount), 'Press');
        expect(setFieldValueMock).not.toBeCalled();
    });

    it('Should call setFieldValue, when decreaseAbhyasiCount button pressed and additionalAbhyasisCount is grater than zero', () => {
        const { container } = Component({
            values: {
                additionalAbhyasisCount: 10,
                maximumAbhyasisAllowed: 20,
                styles: {}
            },
            errors: {
                additionalAbhyasisCount: null,
                styles: {}
            }
        });
        fireEvent(find(container, decreaseAbhyasisCount), 'Press');
        expect(setFieldValueMock).toBeCalledWith('additionalAbhyasisCount', '9');
    });

    it('Should not call setFieldValue, when decreaseAbhyasiCount button pressed and additionalAbhyasisCount is zero', () => {
        const { container } = Component({
            values: { additionalAbhyasisCount: 0, },
            errors: {
                additionalAbhyasisCount: null,
                styles: {}
            }
        });
        fireEvent(find(container, decreaseAbhyasisCount), 'Press');
        expect(setFieldValueMock).not.toBeCalled();
    });
});
