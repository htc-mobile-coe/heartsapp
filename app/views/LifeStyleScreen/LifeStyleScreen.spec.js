import React from 'react';
import LifeStyleScreen from './LifeStyleScreen';
import { getLifeStyleConfig } from '../../services/firebase/RemoteConfigService';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';
import VideoCard from '../shared/VideoCard/VideoCard';
import { render, fireEvent } from '../../utils/TestUtils';

describe('LifeStyleScreen', () => {
    const Component = (props) => {
        return render(<LifeStyleScreen
            {...props}
            selectedLanguage={'en'}
            config={getLifeStyleConfig()}
        />);
    };
    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });

    it('Should render 1 OptionsScreenHeader component', () => {
        const { container } = Component({});
        expect(container.findAllByType(OptionsScreenHeader)).toHaveLength(1);
    });

    it('Should render 4 VideoCard ', () => {
        const { container } = Component({});
        expect(container.findAllByType(VideoCard)).toHaveLength(4);
    });
    it('Should fire onExpandPress, when expand button is pressed', () => {
        const expandPressMock = jest.fn();
        const { container } = Component({
            onExpandPress: expandPressMock,
        });
        fireEvent(
            container.findAllByType(VideoCard)[0],
            'ExpandPress',
        );
        expect(expandPressMock).toHaveBeenCalled();
    });
    it('Should fire onPlayPress when user plays video', () => {
        const playPressMock = jest.fn();
        const { container } = Component({
            onPlayPress: playPressMock,
        });
        fireEvent(
            container.findAllByType(VideoCard)[0],
            'PlayPress',
        );
        expect(playPressMock).toHaveBeenCalled();
    });
    it('Should fire onBackPress event, when back button is pressed', () => {
        const backPressMock = jest.fn();
        const { container } = Component({
            onBackPress: backPressMock,
        });
        fireEvent(
            container.findByType(OptionsScreenHeader),
            'BackPress',
        );
        expect(backPressMock).toHaveBeenCalled();
    });
});
