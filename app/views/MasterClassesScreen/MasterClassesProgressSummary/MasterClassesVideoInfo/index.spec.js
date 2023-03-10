import React from 'react';
import { get } from 'lodash';
import MasterClassesVideoInfo from './index';
import VideoCard from './VideoCard';
import { getMasterClassScreenConfig } from 'app/services/firebase/RemoteConfigService';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import { Circle } from '../../../shared/Icon';

describe('MasterClassesVideoInfo', () => {
    const Component = props => {
        return render(<MasterClassesVideoInfo
            {...props}
            masterClassesData={get(getMasterClassScreenConfig(), 'en')}
        />);
    };
    const meditatorImage = 'masterClassesVideoInfo__meditatorImage--image';
    const lockedIcon = 'masterClassesVideoInfo__locked--icon';

    it('Should exist', () => {
        const { container } = Component({
            masterClassesFinishedDates: {
                introductionAboutMasterClasses: '2021-07-14T05:55:36.360Z',
                day1: '2021-07-14T05:55:47.881Z',
                day2: null,
                day3: null,
            },
            unlockedState: {
                introductionAboutMasterClasses: true,
                day1: true,
                day2: false,
                day3: false,
            },
            takenIntroSittings: false,
        });
        expect(container).toBeDefined();
    });
    it('Should render 4 VideoCard ', () => {
        const { container } = Component({
            masterClassesFinishedDates: {
                introductionAboutMasterClasses: '2021-07-14T05:55:36.360Z',
                day1: '2021-07-14T05:55:47.881Z',
                day2: null,
                day3: null,
            },
            unlockedState: {
                introductionAboutMasterClasses: true,
                day1: true,
                day2: false,
                day3: false,
            },
            takenIntroSittings: true,
        });
        expect(container.findAllByType(VideoCard)).toHaveLength(4);
    });
    it('Should render 2 circle icon, when video card is not in locked state & master classes finished date is not null', () => {
        const { container } = Component({
            masterClassesFinishedDates: {
                introductionAboutMasterClasses: '2021-07-14T05:55:36.360Z',
                day1: '2021-07-14T05:55:47.881Z',
                day2: null,
                day3: null,
            },
            unlockedState: {
                introductionAboutMasterClasses: true,
                day1: true,
                day2: true,
                day3: false,
            },
            takenIntroSittings: false,
        });
        expect(container.findAllByType(Circle)).toHaveLength(2);
    });
    it('Should render a meditator image, when video card is in unlocked state & master classes finished date is null', () => {
        const { container } = Component({
            masterClassesFinishedDates: {
                introductionAboutMasterClasses: '2021-07-14T05:55:36.360Z',
                day1: '2021-07-14T05:55:47.881Z',
                day2: null,
                day3: null,
            },
            unlockedState: {
                introductionAboutMasterClasses: true,
                day1: true,
                day2: true,
                day3: false,
            },
            takenIntroSittings: false,
        });
        expect(find(container, meditatorImage)).toBeDefined();
    });
    it('Should render a Locked icon, when video card is in locked state & master classes finished date is null', () => {
        const { container } = Component({
            masterClassesFinishedDates: {
                introductionAboutMasterClasses: '2021-07-14T05:55:36.360Z',
                day1: '2021-07-14T05:55:47.881Z',
                day2: null,
                day3: null,
            },
            unlockedState: {
                introductionAboutMasterClasses: true,
                day1: true,
                day2: true,
                day3: false,
            },
            takenIntroSittings: false,
            isFirstCard: false,
        });
        expect(find(container, lockedIcon)).toBeDefined();
    });
    it('Should call MasterClassProgressSummary press event when user clicks on any video card', () => {
        const onMasterClassProgressSummaryVideoCardPressMock = jest.fn();
        const { container } = Component({
            masterClassesFinishedDates: {
                introductionAboutMasterClasses: '2021-07-14T05:55:36.360Z',
                day1: null,
                day2: null,
                day3: null,
            },
            unlockedState: {
                introductionAboutMasterClasses: true,
                day1: true,
                day2: false,
                day3: false,
            },
            takenIntroSittings: false,
            onMasterClassProgressSummaryVideoCardPress: onMasterClassProgressSummaryVideoCardPressMock,
        });
        fireEvent(container.findByType(MasterClassesVideoInfo), 'MasterClassProgressSummaryVideoCardPress', 'day1');
        expect(
            onMasterClassProgressSummaryVideoCardPressMock,
        ).toHaveBeenCalled();
    });
    it('Should handle MasterClassProgressSummary press event when user clicks on any video card and its in locked state', () => {
        const onMasterClassProgressSummaryVideoCardPressMock = jest.fn();
        const { container } = Component({
            masterClassesFinishedDates: {
                introductionAboutMasterClasses: '2021-07-14T05:55:36.360Z',
                day1: null,
                day2: null,
                day3: null,
            },
            unlockedState: {
                introductionAboutMasterClasses: true,
                day1: false,
                day2: false,
                day3: false,
            },
            takenIntroSittings: false,
            onMasterClassProgressSummaryVideoCardPress: onMasterClassProgressSummaryVideoCardPressMock,
        });
        fireEvent(container.findByType(MasterClassesVideoInfo), 'MasterClassProgressSummaryVideoCardPress', 'day1');
        expect(
            onMasterClassProgressSummaryVideoCardPressMock,
        ).toHaveBeenCalled();
    });
});
