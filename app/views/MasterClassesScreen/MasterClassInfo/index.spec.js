import React from 'react';
import MasterClassInfo from './index';
import { Image } from 'react-native';
import { Text, MediumBoldText } from '../../shared/Text';
import BackButton from '../../shared/BackButton';
import { FavoriteBorder as FavoriteBorderIcon } from '../../shared/Icon';
import { render, fireEvent } from 'app/utils/TestUtils';

describe('MasterClassInfo', () => {
    const Component = props => {
        return render(<MasterClassInfo
            {...props}
            firstSectionPoints={{
                point: 'Sit in a peaceful place.',
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
    it('Should have 1 FavoriteBorderIcon component for rendering points', () => {
        const { container } = Component({});
        expect(container.findByType(FavoriteBorderIcon)).toBeDefined();
    });
    it('Should have a BackButton component', () => {
        const { container } = Component({});
        expect(container.findByType(BackButton)).toBeDefined();
    });
    it('Should have a Text for rendering points', () => {
        const { container } = Component({});
        expect(container.findByType(Text)).toBeDefined();
    });
    it('Should have 4 MediumBoldText for headers & section title', () => {
        const { container } = Component({});
        expect(container.findAllByType(MediumBoldText)).toHaveLength(4);
    });
    it('Should fire back press event, when back button is pressed', () => {
        const onBackPressMock = jest.fn();
        const { container } = Component({
            onBackPress: onBackPressMock,
        });
        fireEvent(container.findByType(BackButton), 'BackPress');
        expect(onBackPressMock).toHaveBeenCalled();
    });
});
