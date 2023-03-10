import React from 'react';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import MasterClassContentCard from './index';
import { Select } from 'native-base';

describe('MasterClassContentCard', () => {
    const headerText = 'masterClassContentCard-header--text';
    const dayTitleText = 'masterClassContentCard-dayTitle--text';
    const titleText = 'masterClassContentCard-title--text';
    const primaryDescriptionText =
        'masterClassContentCard-primaryDescription--text';
    const highlightedDescriptionText =
        'masterClassContentCard-highlightedDescription--text';
    const endDescriptionText = 'masterClassContentCard-endDescription--text';
    const learnMoreButton =
        'masterClassContentCard-learnMore--TouchableOpacity';
    const continueButton = 'masterClassContentCard__continue--button';
    const scrollView = 'masterClassContentCard__scrollView';

    const Component = props => {
        return render(<MasterClassContentCard {...props} selectedLanguage={'en'} />);
    };

    it('Should have a ScrollView component', () => {
        const { container } = Component();
        expect(find(container, scrollView)).toBeDefined();
    });

    it('Should render a header Text and dayTitle, when both are available', () => {
        const { container } = Component({
            heading: 'mock',
            dayTitle: 'Day 1/3',
        });
        expect(find(container, headerText)).toBeDefined();
        expect(find(container, dayTitleText)).toBeDefined();
    });
    it('Should render a header Text, when dayTitle is empty', () => {
        const { container } = Component({
            heading: 'mock',
            dayTitle: '',
        });
        expect(find(container, headerText)).toBeDefined();
    });
    it('Should have a title Text', () => {
        const { container } = Component({
            title: 'mock',
        });
        expect(find(container, titleText)).toBeDefined();
    });
    it('Should have a primaryDescription Text', () => {
        const { container } = Component({
            description: 'mock',
        });
        expect(find(container, primaryDescriptionText)).toBeDefined();
    });
    it('Should have a highlightedDescription Text', () => {
        const { container } = Component({
            highlightedDescription: 'mock',
        });
        expect(find(container, highlightedDescriptionText)).toBeDefined();
    });
    it('Should have a endDescription Text', () => {
        const { container } = Component({
            endDescription: 'mock',
        });
        expect(find(container, endDescriptionText)).toBeDefined();
    });
    it('Should have a LearnMore button', () => {
        const { container } = Component({ learnMore: 'Learn More' });
        expect(find(container, learnMoreButton)).toBeDefined();
    });
    it('Should have a Continue button', () => {
        const { container } = Component({
            enableContinueButton: false,
        });
        expect(find(container, continueButton)).toBeDefined();
    });
    it('Should call learnMore press event when user clicks on Learn More button', () => {
        const onLearnMorePressMock = jest.fn();
        const { container } = Component({
            learnMore: 'Learn More',
            onLearnMorePress: onLearnMorePressMock,
        });
        fireEvent(find(container, learnMoreButton), 'Press');
        expect(onLearnMorePressMock).toHaveBeenCalled();
    });
    it('Should call continue press event when user clicks on Continue button', () => {
        const onContinueButtonPressMock = jest.fn();
        const { container } = Component({
            enableContinueButton: true,
            onContinueButtonPress: onContinueButtonPressMock,
            data: 'mockData',
        });
        fireEvent(find(container, continueButton), 'Press');
        expect(onContinueButtonPressMock).toHaveBeenCalledWith('mockData');
    });
    it('Should call selectedLanguage change event when user clicks on languages dropdown', () => {
        const onSelectedLanguageChangeMock = jest.fn();
        const { container } = Component({
            languages: [{ label: 'English', value: 'en' }],
            showLanguagePicker: true,
            selectedLanguage: 'en',
            onSelectedLanguageChange: onSelectedLanguageChangeMock,
        });
        expect(container.findByType(Select)).toHaveProp('selectedValue', 'en');
        fireEvent(container.findByType(Select), 'ValueChange', 'da');
        expect(onSelectedLanguageChangeMock).toHaveBeenCalledWith('da');
    });
});
