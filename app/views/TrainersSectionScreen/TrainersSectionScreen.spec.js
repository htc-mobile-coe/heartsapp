import React from 'react';
import TrainersSectionScreen from './TrainersSectionScreen';
import TileBox from './TileBox';
import { render, fireEvent } from 'app/utils/TestUtils';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';

describe('TrainersSectionScreen', () => {
    const contents = [
        {
            id: 1,
            title: 'Register',
            subTitle: 'Register New Seeker',
            image: 'registerNewSeeker',
        },
    ];
    const Component = props => {
        return render(<TrainersSectionScreen {...props} />);
    };

    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });
    it('Should have a OptionsScreenHeader Component', () => {
        const { container } = Component({ contents });
        expect(container.findByType(OptionsScreenHeader)).toBeDefined();
    });
    it('Should have a TileBox Component', () => {
        const { container } = Component({ contents });
        expect(container.findByType(TileBox)).toBeDefined();
    });
    it('Should call onPress when user press on TileBox ', () => {
        const onTileBoxPressMock = jest.fn();
        const { container } = Component({
            onTileBoxPress: onTileBoxPressMock,
            contents,
        });
        fireEvent(container.findByType(TileBox), 'Press');
        expect(onTileBoxPressMock).toBeCalled();
    });
});