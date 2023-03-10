import React from 'react';
import MasterClassVideoInformation from './index';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import MasterClassContentCard from './MasterClassContent';
import MasterClassVideoCard from './MasterClassVideoPreview';
import { getMasterClassScreenConfig } from 'app/services/firebase/RemoteConfigService';
import LearnMore from '../LearnMore';
import MasterClassInfo from '../MasterClassInfo';
describe('MasterClassVideoInformation', () => {
    const backButton = 'masterClassesScreen_back--button';
    const Component = props => {
        return render(<MasterClassVideoInformation
            {...props}
            config={getMasterClassScreenConfig()}
            selectedLanguage={'en'}
            showContinue={true}
            selectedContent={'day2'}
        />);
    };

    it('Should exist', () => {
        const { container } = Component({
            content: 'day2',
            videoThumbnailURL: 'day2',
        });
        expect(container).toBeDefined();
    });
    it('Should have a back button', () => {
        const { container } = Component({
            content: 'day1',
        });
        expect(find(container, backButton)).toBeDefined();
    });
    it('Should have a MasterClassVideoPreview component for rendering VideoCard', () => {
        const { container } = Component({
            content: 'day1',
        });
        expect(container.findByType(MasterClassVideoCard)).toBeDefined();
    });
    it('Should have a MasterClassContent component for rendering content', () => {
        const { container } = Component({
            content: 'day1',
        });
        expect(container.findByType(MasterClassContentCard)).toBeDefined();
    });
    it('Should have a LearnMore component for rendering LearnMore content', () => {
        const { container } = Component({ showLearnMore: true, content: 'day1' });
        expect(container.findByType(LearnMore)).toBeDefined();
    });
    it('Should render a MasterClassInfo component when user clicks on info button', () => {
        const { container } = Component({
            showLearnMore: true,
            content: 'introductionAboutMasterClasses',
        });
        expect(container.findByType(MasterClassInfo)).toBeDefined();
    });
    it('Should able to call back press event when user clicks on back button', () => {
        const onBackPressMock = jest.fn();
        const { container } = Component({
            onBackPress: onBackPressMock,
            content: 'day1',
        });
        fireEvent(find(container, backButton), 'Press');
        expect(onBackPressMock).toHaveBeenCalled();
    });
    it('Should able to call play press event when user clicks on Play button in MasterClassVideoPreview', () => {
        const onPlayPressMock = jest.fn();
        const { container } = Component({
            onPlayPress: onPlayPressMock,
            content: 'day1',
        });
        fireEvent(container.findByType(MasterClassVideoCard), 'PlayPress');
        expect(onPlayPressMock).toHaveBeenCalled();
    });
    it('Should able to call selected language change event when user clicks on picker in MasterClassContent', () => {
        const onSelectedLanguageChangeMock = jest.fn();
        const { container } = Component({
            onSelectedLanguageChange: onSelectedLanguageChangeMock,
            content: 'day1',
        });
        fireEvent(container.findByType(MasterClassContentCard), 'SelectedLanguageChange');
        expect(onSelectedLanguageChangeMock).toHaveBeenCalled();
    });
    it('Should able to call learn more event when user clicks on Learn More button in MasterClassContent', () => {
        const onLearnMorePressMock = jest.fn();
        const { container } = Component({
            onLearnMorePress: onLearnMorePressMock,
            content: 'day1',
        });
        fireEvent(container.findByType(MasterClassContentCard), 'LearnMorePress');
        expect(onLearnMorePressMock).toHaveBeenCalled();
    });
    it('Should able to call continue press event when user clicks on Continue button in MasterClassContent', () => {
        const onContinueButtonPressMock = jest.fn();
        const { container } = Component({
            onContinueButtonPress: onContinueButtonPressMock,
            content: 'day1',
        });
        fireEvent(container.findByType(MasterClassContentCard), 'ContinueButtonPress');
        expect(onContinueButtonPressMock).toHaveBeenCalled();
    });
    it('Should able to call learnMoreBackPress event when user clicks on back button in LearnMore', () => {
        const onLearnMoreBackPressMock = jest.fn();
        const { container } = Component({
            showLearnMore: true,
            onLearnMoreBackPress: onLearnMoreBackPressMock,
            content: 'day1',
        });
        fireEvent(container.findByType(LearnMore), 'LearnMoreBackPress');
        expect(onLearnMoreBackPressMock).toHaveBeenCalled();
    });
    it('Should able to call learnMoreBackPress event when user clicks on back button in  get started LearnMore', () => {
        const onLearnMoreBackPressMock = jest.fn();
        const { container } = Component({
            showLearnMore: true,
            onLearnMoreBackPress: onLearnMoreBackPressMock,
            content: 'introductionAboutMasterClasses',
        });
        fireEvent(container.findByType(MasterClassInfo), 'BackPress');
        expect(onLearnMoreBackPressMock).toHaveBeenCalled();
    });
});
