import React from 'react';
import { Text, MediumBoldText } from '../shared/Text';
import { Close } from '../shared/Icon';
import { TouchableOpacity, Image } from 'react-native';
import { render, fireEvent, find, findByProps } from '../../utils/TestUtils';
import OfflineSessionTrackingPopup from './OfflineSessionTrackingPopup';

describe('OfflineSessionTrackingPopup', () => {
    const closeIcon =
        'offlineSessionTrackingPopup__closeIcon--touchableOpacity';
    const trackPastSessionTouchableOpacity =
        'offlineSessionTrackingPopup__onTrackPastSessionPress--touchableOpacity';
    const trackNowTouchableOpacity =
        'offlineSessionTrackingPopup__onTrackNowPress--touchableOpacity';
    const trackPastSessionImage =
        'offlineSessionTrackingPopup__trackPastSession--image';
    const trackNowImage = 'offlineSessionTrackingPopup__trackNow--image';

    const Component = (props) => render(<OfflineSessionTrackingPopup {...props} />);

    it('Should able to render 2 Text', () => {
        const { container } = Component({
            show: true
        });
        expect(container.findAllByType(Text)).toHaveLength(2);
    });

    it('Should able to render MediumBoldText', () => {
        const { container } = Component({});
        expect(container.findAllByType(MediumBoldText)).toBeDefined();
    });

    it('Should able to render 3 TouchableOpacity', () => {
        const { container } = Component({
            show: true
        });
        expect(container.findAllByType(TouchableOpacity)).toHaveLength(3);
    });

    it('Should able to render 2 Image', () => {
        const { container } = Component({
            show: true
        });
        expect(container.findAllByType(Image)).toHaveLength(2);
    });

    it('Should able to render Close', () => {
        const { container } = Component({
            show: true
        });
        expect(container.findAllByType(Close)).toHaveLength(1);
    });

    it('Should fire onClosePress event when close icon is pressed', () => {
        const onClosePressMock = jest.fn();
        const { container } = Component({
            onClosePress: onClosePressMock,
            show: true
        });
        fireEvent.press(find(container, closeIcon), 'Press');
        expect(onClosePressMock).toHaveBeenCalled();
    });

    it('Should fire onTrackPastSessionPress event when track past session is pressed', () => {
        const onTrackPastSessionPressMock = jest.fn();
        const { container } = Component({
            onTrackPastSessionPress: onTrackPastSessionPressMock,
            show: true
        });
        fireEvent.press(find(container, trackPastSessionTouchableOpacity), 'Press');
        expect(onTrackPastSessionPressMock).toHaveBeenCalled();
    });

    it('Should fire onTrackNowPress event when track now is pressed', () => {
        const onTrackNowPressMock = jest.fn();
        const { container } = Component({
            onTrackNowPress: onTrackNowPressMock,
            show: true
        });
        fireEvent.press(find(container, trackNowTouchableOpacity), 'Press');
        expect(onTrackNowPressMock).toHaveBeenCalled();
    });

    it('Should render trackPastSession image', () => {
        const imageMock = require('./img/classic/track_past_session.png');
        const { container } = Component({
            imageSource: imageMock,
            show: true
        });
        const meditatorImageSection = find(container, trackPastSessionImage)
        expect(
            findByProps(
                meditatorImageSection,
                'source',
                imageMock,
            ),
        ).toBeDefined();
    });

    it('Should render trackNow image', () => {
        const imageMock = require('./img/classic/track_now.png');
        const { container } = Component({
            imageSource: imageMock,
            show: true
        });
        const trackNowImageSection = find(container, trackNowImage)
        expect(
            findByProps(
                trackNowImageSection,
                'source',
                imageMock,
            ),
        ).toBeDefined()
    });
});
