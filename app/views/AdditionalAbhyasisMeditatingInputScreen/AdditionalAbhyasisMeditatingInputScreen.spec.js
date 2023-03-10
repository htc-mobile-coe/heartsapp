import React from 'react';
import AdditionalAbhyasisMeditatingInputScreen from './AdditionalAbhyasisMeditatingInputScreen';
import { Image } from 'react-native';
import { Formik } from 'formik';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';
import AdditionalAbhyasisForm from './AdditionalAbhyasisForm';
import { render, fireEvent, find, findByProps } from '../../utils/TestUtils';

describe('AdditionalAbhyasisMeditatingInputScreen', () => {
    const imageView = 'additionalAbhyasisMeditatingInputScreen--image';
    const headingText = 'additionalAbhyasisMeditatingInputScreen__heading--text';
    const contentText = 'additionalAbhyasisMeditatingInputScreen__content--text';
    const maxMeditationTimeText = 'additionalAbhyasisMeditatingInputScreen__maxMeditationTime--text';
    const Component = (props) => {
        return render(<AdditionalAbhyasisMeditatingInputScreen {...props} />);
    };

    it('Should exist', () => {
        const { container } = Component();
        expect(container).toBeDefined();
    });

    it('Should render 1 OptionsScreenHeader component', () => {
        const { container } = Component();
        expect(container.findAllByType(OptionsScreenHeader)).toHaveLength(1);
    });

    it('Should render a headingText component', () => {
        const { container } = Component();
        expect(find(container, headingText)).toBeDefined();
    });

    it('Should render a contentText component', () => {
        const { container } = Component();
        expect(find(container, contentText)).toBeDefined();
    });

    it('Should render a maxMeditationTimeText component', () => {
        const { container } = Component();
        expect(find(container, maxMeditationTimeText)).toBeDefined();
    });

    it('Should have a Image component for rendering meditation image', () => {
        const { container } = Component();
        expect(container.findAllByType(Image)).toHaveLength(1);
    });

    it('Should render Image source ', () => {
        const { container } = Component();

        expect(find(container, imageView)).toBeDefined();
        expect(findByProps(container, 'source', '../../../app/views/AdditionalAbhyasisMeditatingInputScreen/img/classic/meditation.png')).toBeDefined();
    });

    it('Should render Abhyasis meditation input Formik component', () => {
        const { container } = Component();
        expect(container.findAllByType(Formik)).toHaveLength(1);
    });

    it('Should render AdditionalAbhyasisForm component', () => {
        const { container } = Component();
        expect(container.findAllByType(AdditionalAbhyasisForm)).toHaveLength(1);
    });

    it('Should fire onSubmit for Formik form', () => {
        const onAdditionalAbhyasisSubmitMock = jest.fn();
        const resetFormMock = jest.fn();
        const { container } = Component(
            {
                isAnonymousUser: true,
                onAdditionalAbhyasisSubmit: onAdditionalAbhyasisSubmitMock,
            }
        );

        expect(container.findAllByType(Formik)).toHaveLength(1);
        fireEvent(container.findByType(Formik), 'Submit', {}, { resetForm: resetFormMock });
        expect(onAdditionalAbhyasisSubmitMock).toBeCalledWith({resetForm: resetFormMock });

    });

    it('Should fire back press event', () => {
        const backPressMock = jest.fn();
        const { container } = Component(
            {
                onBackPress: backPressMock,
            }
        );
        fireEvent(container.findByType(OptionsScreenHeader), 'BackPress');
        expect(backPressMock).toHaveBeenCalled();
    });
});
