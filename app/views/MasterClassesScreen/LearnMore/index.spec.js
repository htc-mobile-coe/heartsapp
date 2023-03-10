import React from 'react';
import LearnMore from './index';
import { Image } from 'react-native';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import { FavoriteBorder as FavoriteBorderIcon } from '../../shared/Icon';
import { Text, MediumBoldText } from 'app/views/shared/Text';

describe('LearnMore', () => {
    const backButton = 'learnMore_back--button';
    const Component = props => {
        return render(<LearnMore
            {...props}
            points={{
                point:
                    'Sit comfortably and close your eyes very softly and very gently.',
            }}
        />);
    };
    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });
    it('Should have 1 Image component for rendering header image', () => {
        const { container } = Component({});
        expect(container.findByType(Image)).toBeDefined();
    });
    it('Should render 2 MediumBoldText component for rendering headers', () => {
        const { container } = Component({});
        expect(container.findAllByType(MediumBoldText)).toHaveLength(2);
    });
    it('Should render 2 Text component for rendering points & content', () => {
        const { container } = Component({});
        expect(container.findAllByType(Text)).toHaveLength(2);
    });
    it('Should have 1 FavoriteBorderIcon component for rendering points', () => {
        const { container } = Component({});
        expect(container.findByType(FavoriteBorderIcon)).toBeDefined();
    });
    it('Should fire back press event, when back button pressed', () => {
        const onLearnMoreBackPressMock = jest.fn();
        const { container } = Component({
            onLearnMoreBackPress: onLearnMoreBackPressMock,
        });
        fireEvent(find(container, backButton), 'Press');
        expect(onLearnMoreBackPressMock).toHaveBeenCalled();
    });
});
