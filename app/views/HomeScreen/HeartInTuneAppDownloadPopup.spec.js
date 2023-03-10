import React from 'react';
import { Text, BoldText } from '../shared';
import { Close } from '../shared/Icon';
import { TouchableOpacity, Image } from 'react-native';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import HeartInTuneAppDownloadPopup from './HeartInTuneAppDownloadPopup';

describe('HeartInTuneAppDownloadPopup', () => {
    const closeIcon =
        'heartInTuneAppDownloadPopup__closeIcon--touchableOpacity';
    const downloadNowTouchableOpacity =
        'heartInTuneAppDownloadPopup__onDownloadNow--touchableOpacity';
    const heartInTuneLogo =
        'heartInTuneAppDownloadPopup__heartInTuneLogo--image';

    const Component = (props) => render(<HeartInTuneAppDownloadPopup {...props} />);

    it('Should able to render a Text component for description', () => {
        const { container } = Component({});
        expect(container.findAllByType(Text)).toHaveLength(1);
    });

    it('Should able to render 2 BoldText component to display heading & Download Now button title', () => {
        const { container } = Component({});
        expect(container.findAllByType(BoldText)).toHaveLength(2);
    });

    it('Should able to render 2 TouchableOpacity component for close & download now button', () => {
        const { container } = Component({});
        expect(container.findAllByType(TouchableOpacity)).toHaveLength(2);
    });

    it('Should able to render 1 Image to display HeartInTune Logo', () => {
        const { container } = Component({});
        expect(container.findAllByType(Image)).toHaveLength(1);
    });

    it('Should able to render Close Icon', () => {
        const { container } = Component({});
        expect(container.findAllByType(Close)).toHaveLength(1);
    });

    it('Should fire onClosePress event when close icon is pressed', () => {
        const onClosePressMock = jest.fn();
        const { container } = Component({
            onClosePress: onClosePressMock,
        });
        fireEvent(find(container, closeIcon), 'Press');
        expect(onClosePressMock).toHaveBeenCalled();
    });

    it('Should fire onDownloadNowPress event when Download Now button is pressed', () => {
        const onDownloadNowPressMock = jest.fn();
        const { container } = Component({
            onDownloadNowPress: onDownloadNowPressMock,
        });
        fireEvent(find(container, downloadNowTouchableOpacity), 'Press');
        expect(onDownloadNowPressMock).toHaveBeenCalled();
    });

    it('Should render HeartInTune logo', () => {
        const imageMock = require('./img/classic/heart_in_tune_logo.png');
        const { container } = Component({
            imageSource: imageMock,
        });

        expect(find(container, heartInTuneLogo).props.source).toEqual(
            imageMock,
        );
    });
});
