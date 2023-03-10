import React from 'react';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import MasterClassesIntro from './index';
import { Avatar } from 'native-base';
import { Text } from 'app/views/shared';

describe('MasterClassesIntro', () => {
    const backButton = 'masterClassesIntro_back--button';
    const infoButton = 'masterClassesIntro_info--button';
    const meetDaajiButton = 'masterClassesIntro__meetDaaji--button';
    const arrowUpButton = 'masterClassesIntro_arrowUp--button';

    const Component = props => {
        return render(<MasterClassesIntro
            {...props}
            selectedLanguage={'en'}
            points={{
                point:
                    'Learn to manage your life and your emotions the Heartfulness way.',
            }}
        />);
    };
    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });
    it('Should have a Avatar component for rendering daaji image', () => {
        const { container } = Component({});
        expect(container.findByType(Avatar)).toBeDefined();
    });
    it('Should have 3 Text component for rendering points & content', () => {
        const { container } = Component({showExpandedIntroView: true});
        expect(container.findAllByType(Text)).toHaveLength(3);
    });
    it('Should call back press event when user clicks on back button', () => {
        const onBackPressMock = jest.fn();
        const { container } = Component({
            onBackPress: onBackPressMock,
        });
        fireEvent(find(container, backButton), 'BackPress');
        expect(onBackPressMock).toHaveBeenCalled();
    });
    it('Should call MasterClassProgressSummary press event when user clicks on info button', () => {
        const onMasterClassProgressSummaryInfoPressMock = jest.fn();
        const { container } = Component({
            onMasterClassProgressSummaryInfoPress: onMasterClassProgressSummaryInfoPressMock,
        });
        fireEvent(find(container, infoButton), 'Press');
        expect(onMasterClassProgressSummaryInfoPressMock).toHaveBeenCalled();
    });
    it('Should call meet daaji button press event when user clicks on meet daaji button', () => {
        const onMeetDaajiButtonPressMock = jest.fn();
        const { container } = Component({
            onMeetDaajiButtonPress: onMeetDaajiButtonPressMock,
        });
        fireEvent(find(container, meetDaajiButton), 'Press');
        expect(onMeetDaajiButtonPressMock).toHaveBeenCalled();
    });
    it('Should call arrow up button press event when user clicks on arrow up button', () => {
        const onToggleUpButtonPressMock = jest.fn();
        const { container } = Component({
            showExpandedIntroView: 'true',
            onToggleUpButtonPress: onToggleUpButtonPressMock,
        });
        fireEvent(find(container, arrowUpButton), 'Press');
        expect(onToggleUpButtonPressMock).toHaveBeenCalled();
    });
});
