import React from 'react';
import MasterClassesProgressSummary from './index';
import MasterClassesIntro from './MasterClassesIntro';
import MasterClassesVideoInfo from './MasterClassesVideoInfo';
import { getMasterClassScreenConfig } from 'app/services/firebase/RemoteConfigService';
import MasterClassInfo from '../MasterClassInfo';
import { render, fireEvent } from 'app/utils/TestUtils';

describe('MasterClassesProgressSummary', () => {
    const masterClassesFinishedDatesMock = {
        introductionAboutMasterClasses: '2021-07-14T05:55:36.360Z',
        day1: '2021-07-14T05:55:47.881Z',
        day2: null,
        day3: null,
    };
    const videoUnlockedStateMock = {
        introductionAboutMasterClasses: true,
        day1: true,
        day2: false,
        day3: false,
    };
    const Component = props => {
        return render(<MasterClassesProgressSummary
            {...props}
            config={getMasterClassScreenConfig()}
            selectedLanguage={'en'}
            masterClassesFinishedDates={masterClassesFinishedDatesMock}
            unlockedState={videoUnlockedStateMock}
            takenIntroSittings={false}
        />);
    };

    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });
    it('Should have a MasterClassesIntro component for rendering MasterClasses progress summary intro content', () => {
        const { container } = Component({});
        expect(container.findByType(MasterClassesIntro)).toBeDefined();
    });
    it('Should have a MasterClassesVideoInfo component for rendering video info cards', () => {
        const { container } = Component();
        expect(container.findByType(MasterClassesVideoInfo)).toBeDefined();
    });
    it('Should render a MasterClassInfo component when user clicks on info button', () => {
        const { container } = Component({ showMasterClassInfo: true });
        expect(container.findByType(MasterClassInfo)).toBeDefined();
    });
    it('Should call back press event when user clicks on back button', () => {
        const onBackPressMock = jest.fn();
        const { container } = Component({
            onBackPress: onBackPressMock,
        });
        fireEvent(container.findByType(MasterClassesIntro), 'BackPress');
        expect(onBackPressMock).toHaveBeenCalled();
    });
    it('Should call MasterClassProgressSummary press event when user clicks on info button', () => {
        const onMasterClassProgressSummaryInfoPressMock = jest.fn();
        const { container } = Component({
            onMasterClassProgressSummaryInfoPress: onMasterClassProgressSummaryInfoPressMock,
        });
        fireEvent(container.findByType(MasterClassesIntro), 'MasterClassProgressSummaryInfoPress');
        expect(onMasterClassProgressSummaryInfoPressMock).toHaveBeenCalled();
    });
    it('Should show expanded intro view when user clicks on meet daaji button & showExpandedIntroView is in false state', () => {
        const onMeetDaajiButtonPressMock = jest.fn();
        const { container } = Component({
            onMeetDaajiButtonPress: onMeetDaajiButtonPressMock,
        });
        fireEvent(container.findByType(MasterClassesIntro), 'MeetDaajiButtonPress');
        expect(container.findByType(MasterClassesIntro)).toHaveProp('showExpandedIntroView', true);
    });
    it('Should hide expanded intro view when user clicks on arrow up button', () => {
        const onToggleUpButtonPressMock = jest.fn();
        const { container } = Component({
            showExpandedIntroView: 'true',
            onToggleUpButtonPress: onToggleUpButtonPressMock,
        });
        fireEvent(container.findByType(MasterClassesIntro), 'ToggleUpButtonPress');
        expect(container.findByType(MasterClassesIntro)).toHaveProp('showExpandedIntroView', false);
    });
    it('Should call MasterClassProgressSummary video card press event when user clicks on video card', () => {
        const onMasterClassProgressSummaryVideoCardPressMock = jest.fn();
        const { container } = Component({
            onMasterClassProgressSummaryVideoCardPress: onMasterClassProgressSummaryVideoCardPressMock,
        });
        fireEvent(container.findByType(MasterClassesVideoInfo), 'MasterClassProgressSummaryVideoCardPress');
        expect(
            onMasterClassProgressSummaryVideoCardPressMock,
        ).toHaveBeenCalled();
    });
});
