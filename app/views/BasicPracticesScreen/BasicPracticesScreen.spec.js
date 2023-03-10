import React from 'react';
import { render, fireEvent, find } from '../../utils/TestUtils';
import BasicPracticesScreen from './BasicPracticesScreen';
import { getBasicPracticesConfig } from '../../services/firebase/RemoteConfigService';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';
import VideoCard from '../shared/VideoCard/VideoCard';

describe('BasicPracticesScreen', () => {
    const backButton = 'basicPracticesScreen_back--button'
    const Component = (props) => <BasicPracticesScreen
        {...props}
        selectedLanguage={'en'}
        config={getBasicPracticesConfig()}
    />

    it('Should exist', () => {
        const { container } = render(Component({}));
        expect(container).toBeDefined();
    });

    it('Should render 1 OptionsScreenHeader component', () => {
        const { container } = render(Component({}));
        expect(container.findAllByType(OptionsScreenHeader)).toHaveLength(1);
    });

    it('Should render 4 VideoCard ', () => {
        const { container } = render(Component({}));
        expect(container.findAllByType(VideoCard)).toHaveLength(4);
    });
    it('Should fire onExpandPress event, when expand button is pressed', () => {
        const expandPressMock = jest.fn();
        const { container } = render(Component({
            onExpandPress: expandPressMock,
        }));
        fireEvent(container.findAllByType(VideoCard)[0], 'ExpandPress');
        expect(expandPressMock).toHaveBeenCalled();
    });
    it('Should fire onPlayPress when user plays video', () => {
        const playPressMock = jest.fn();
        const { container } = render(Component({
            onPlayPress: playPressMock,
        }));
        fireEvent(container.findAllByType(VideoCard)[0], 'onPlayPress');
        expect(playPressMock).toHaveBeenCalled();
    });
    it('Should fire onBackPress event, when back button is pressed ', () => {
        const backPressMock = jest.fn();
        const { container } = render(Component({
            onBackPress: backPressMock,
        }));
        fireEvent(find(container, backButton), 'BackPress');
        expect(backPressMock).toHaveBeenCalled();
    });
});
