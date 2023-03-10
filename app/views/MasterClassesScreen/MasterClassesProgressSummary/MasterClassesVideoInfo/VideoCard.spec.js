import React from 'react';
import VideoCard from './VideoCard';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import { Image } from 'react-native';
import { MediumBoldText, Text, BoldText } from 'app/views/shared';

describe('VideoCard', () => {
    const videoCardButton = 'videoCard_play--button';
    const playIcon = 'videoCard_play--icon';
    const lockIcon = 'videoCard_lock--icon';
    const Component = props => {
        return render(<VideoCard {...props} />);
    };

    it('Should have a Image component', () => {
        const { container } = Component({});
        expect(container.findByType(Image)).toBeDefined();
    });
    it('Should have a Video card button', () => {
        const { container } = Component({});
        expect(find(container, videoCardButton)).toBeDefined();
    });
    it('Should render a play icon when video is in unlocked state', () => {
        const { container } = Component({});
        expect(find(container, playIcon)).toBeDefined();
    });
    it('Should render a lock icon when video is in locked state', () => {
        const { container } = Component({
            locked: 'true',
        });
        expect(find(container, lockIcon)).toBeDefined();
    });
    it('Should render 2 Text component for sub title, duration', () => {
        const { container } = Component({});
        expect(container.findAllByType(Text)).toHaveLength(2);
    });
    it('Should render a BoldText component when video card is not a first card', () => {
        const { container } = Component({
            isFirstCard: false,
        });
        expect(container.findByType(BoldText)).toBeDefined();
    });
    it('Should render a MediumBoldText component when video card is a first card', () => {
        const { container } = Component({
            isFirstCard: true,
        });
        expect(container.findByType(MediumBoldText)).toBeDefined();
    });
    it('Should call video card press event when user clicks on Video card', () => {
        const onMasterClassProgressSummaryVideoCardPressMock = jest.fn();
        const { container } = Component({
            isFirstCard: 'true',
            onMasterClassProgressSummaryVideoCardPress: onMasterClassProgressSummaryVideoCardPressMock,
            masterClassId: 'mockId',
            locked: true,
            progressSummaryToastMessage: 'mockMessage',
        });
        fireEvent(find(container, videoCardButton), 'Press');
        expect(
            onMasterClassProgressSummaryVideoCardPressMock,
        ).toHaveBeenCalledWith('mockId', true, 'mockMessage');
    });
});
