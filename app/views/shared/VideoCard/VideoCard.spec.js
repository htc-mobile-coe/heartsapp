import React from 'react';
import VideoCard from './VideoCard';
import { render, fireEvent, find } from 'TestUtils';
import { Select } from 'native-base';
import VideoCardHeader from './VideoCardHeader';
import { TouchableOpacity } from 'react-native';

describe('VideoCard', () => {
    const durationText = 'videoCard-duration--text';
    const durationTimeText = 'videoCard-durationTime--text';
    const actionButton = 'video_card_action_button';
    const Component = (props) => {
        return render(<VideoCard {...props} />);
    };

    it('Should have a duration Text', () => {
        const { container } = Component({ expanded: true });
        expect(find(container, durationText)).toBeDefined();
    });
    it('Should have a VideoCardHeader', () => {
        const { container } = Component({ expanded: false });
        expect(container.findByType(VideoCardHeader)).toBeDefined();
    });

    it('Should have a TouchableOpacity', () => {
        const { container } = Component({ expanded: true });
        expect(container.findAllByType(TouchableOpacity)).toHaveLength(1);
    });

    it('Should have a durationTime Text', () => {
        const { container } = Component({
            expanded: true,
            duration: '06:24 min',
        });
        expect(find(container, durationTimeText)).toBeDefined();
    });

    it('Should able to call expanded', () => {
        const onExpandPressMock = jest.fn();
        const { container } = Component({
            expanded: true,
            onExpandPress: onExpandPressMock,
        });
        fireEvent(container.findByType(VideoCardHeader), 'onExpandPress');
        expect(onExpandPressMock).toBeCalled();
    });
    it('Should able not to call expanded', () => {
        const onExpandPressMock = jest.fn();
        const { container } = Component({
            expanded: true,
        });
        fireEvent(container.findByType(VideoCardHeader), 'onExpandPress');
        expect(onExpandPressMock).not.toBeCalled();
    });
    it('Should able to call play', () => {
        const onPlayPressMock = jest.fn();
        const { container } = Component({
            testID: 'play_button',
            expanded: true,
            locked: true,
            data: 'mock',
            onPlayPress: onPlayPressMock,
        });
        fireEvent.press(container.findByType(TouchableOpacity));
        expect(onPlayPressMock).toBeCalledWith('mock', true);
    });
    it('Should not able to call play', () => {
        const onPlayPressMock = jest.fn();
        const { container } = Component({
            testID: 'play_button',
            expanded: true,
            locked: true,
            data: 'mock',
        });
        fireEvent.press(container.findByType(TouchableOpacity));
        expect(onPlayPressMock).not.toBeCalled();
    });
    it('Should not able to call play', () => {
        const onActionPressMock = jest.fn();
        const { container } = Component({
            expanded: true,
            action: { label: 'mock', onActionPress: onActionPressMock },
        });
        fireEvent.press(find(container, actionButton));
        expect(onActionPressMock).toBeCalled();
    });
    describe('#Dropdown', () => {
        const languages = [
            { label: 'En', value: 'en' },
            { label: 'Ta', value: 'ta' },
        ];
        it('Should able to select dropdown item', () => {
            const languages = [
                { label: 'En', value: 'en' },
                { label: 'Ta', value: 'ta' },
            ];
            const onSelectedLanguageChangeMock = jest.fn();
            const { container } = Component({
                expanded: true,
                canChangeLanguage: true,
                languages,
                onSelectedLanguageChange: onSelectedLanguageChangeMock,
            });
            fireEvent(
                container.findByType(Select),
                'onValueChange',
                languages[0],
            );
            expect(onSelectedLanguageChangeMock).toBeCalledWith(languages[0]);
        });
        it('Should not able to select dropdown item', () => {
            const onSelectedLanguageChangeMock = jest.fn();
            const { container } = Component({
                expanded: true,
                canChangeLanguage: true,
                languages,
            });
            fireEvent(
                container.findByType(Select),
                'onValueChange',
                languages[0],
            );
            expect(onSelectedLanguageChangeMock).not.toBeCalledWith(
                languages[0],
            );
        });
    });
});
