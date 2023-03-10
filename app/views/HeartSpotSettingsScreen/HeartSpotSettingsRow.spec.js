import React from 'react';
import HeartSpotSettingsRow from './HeartSpotSettingsRow';
import Switch from 'app/views/shared/Switch';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import { Image } from 'react-native';
import { MediumBoldText, Text } from '../shared';

describe('HeartSpotSettingsRow', () => {
    const iconImage = 'heartSpotSettingRow__icon--Image';
    const Component = props => {
        return render(<HeartSpotSettingsRow {...props} />);
    };

    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });

    it('Should have 1 Image component for displaying icons', () => {
        const { container } = Component({});
        expect(container.findByType(Image)).toBeDefined();
    });
    it('Should have 1 Switch', () => {
        const { container } = Component({});
        expect(container.findByType(Switch)).toBeDefined();
    });
    it('Should have 1 Text, when MediumBoldText is valid', () => {
        const { container } = Component({ subTitle: 'test' });
        expect(container.findByType(Text)).toBeDefined();
    });
    it('Should have 2 Text when imageSource is null', () => {
        const { container } = Component({
            imageSource: null,
            profilePhotoText: 'P5',
        });
        expect(container.findAllByType(Text)).toHaveLength(2);
    });
    it('Should have 1 MediumBoldText component, when SubTitle is valid', () => {
        const { container } = Component({ subTitle: 'test' });
        expect(container.findByType(MediumBoldText)).toBeDefined();
    });

    it('Should fire onToggleValue press event, when change the switch status', () => {
        const valueChangeMock = jest.fn();
        const { container } = Component({
            onToggleValue: valueChangeMock,
        });

        fireEvent(container.findByType(Switch), 'ValueChange');
        expect(valueChangeMock).toBeCalled();
    });

    it('Should render Image source', () => {
        const imageSourceMock = require('./img/peach/visibilityIcon.png');
        const { container } = Component({
            imageSource: imageSourceMock,
        });

        expect(find(container, iconImage)).toBeDefined();

        expect(find(container, iconImage)).toHaveProp('source',
            imageSourceMock,
        );
    });

    it('Switch should be disabled when disabled is true', () => {
        const { container } = Component({
            disabled: true,
        });

        expect(container.findByType(Switch)).toHaveProp('disabled', true);
    });
});
