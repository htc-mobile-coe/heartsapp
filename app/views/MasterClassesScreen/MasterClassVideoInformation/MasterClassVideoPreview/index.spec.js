import React from 'react';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import { Image } from 'react-native';
import MasterClassVideoPreview from './index';

describe('MasterClassVideoPreview', () => {
    const playButton = 'masterClassVideoPreview_play--button';
    const durationText = 'masterClassVideoPreview-duration--text';
    const durationTimeText = 'masterClassVideoPreview-durationTime--text';
    const Component = props => {
        return render(<MasterClassVideoPreview {...props} />);
    };

    it('Should have a Image component', () => {
        const { container } = Component({});
        expect(container.findByType(Image)).toBeDefined();
    });
    it('Should render Image source', () => {
        const imageSourceMock = 'intro_to_masterclass';
        const { container } = Component({
            videoThumbnailURL: imageSourceMock,
        });
        expect(container.findByType(Image)).toHaveProp('source', imageSourceMock);
    });
    it('Should have a Play button', () => {
        const { container } = Component({});
        expect(find(container, playButton)).toBeDefined();
    });
    it('Should have a duration Text', () => {
        const { container } = Component({});
        expect(find(container, durationText)).toBeDefined();
    });
    it('Should have a durationTime Text', () => {
        const { container } = Component({
            duration: '07:32 minutes',
        });
        expect(find(container, durationTimeText)).toBeDefined();
    });
    it('Should call play press event when user clicks on Play button', () => {
        const onPlayPressMock = jest.fn();
        const { container } = Component({
            onPlayPress: onPlayPressMock,
            data: 'https://storage.googleapis.com/English.mp4'
        });
        fireEvent(find(container, playButton), 'Press');
        expect(onPlayPressMock).toHaveBeenCalledWith('https://storage.googleapis.com/English.mp4');
    });
});
