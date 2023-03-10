import { render, fireEvent } from 'app/utils/TestUtils';
import React from 'react';
import Header from './Header';
import { TouchableOpacity } from 'react-native';
import { MediumBoldText, Text } from '../shared';
import { Thumbnail } from 'native-base';
import { SignIn, SignOut } from '../shared/Icon';
import { find, findByProps } from '../../utils/TestUtils';

describe('HomeScreenHeader', () => {
    const profileImageButton = 'HomeScreen__profileImage--button';
    const profileTextButton = 'HomeScreen__profileText--button';
    const Component = (props) => render(<Header {...props} />);

    it('Should exist', () => {
        const { container } = Component();
        expect(container).toBeDefined();
    });

    it('Should have 2 TouchableOpacity component', () => {
        const { container } = Component();
        expect(container.findAllByType(TouchableOpacity)).toHaveLength(2);
    });

    it('Should have 2 MediumBoldText for displaying header userName in bold', () => {
        const { container } = Component();
        expect(container.findAllByType(MediumBoldText)).toHaveLength(2);
    });

    it('Should render a Thumbnail component for displaying profile picture', () => {
        const { container } = Component({
            profilePic: 'https://mock.org/profile.png',
        });

        expect(container.findAllByType(Thumbnail)).toBeDefined();
    });

    it('Should render a Text component', () => {
        const { container } = Component({
            userName: 'john',
            name: 'John M',
            profilePic: null,
        });
        expect(container.findAllByType(Text)).toHaveLength(1);
    });

    it('Should able to render SignIn component ', () => {
        const { container } = Component({});
        expect(container.findAllByType(SignIn)).toHaveLength(1);
    });

    it('Should able to render SignOut component ', () => {
        const { container } = Component({ canSignOut: true });
        expect(container.findAllByType(SignOut)).toHaveLength(1);
    });

    describe('#renderLeftContainer', () => {
        it('Should fire onPress event, when profileImageButton is pressed', () => {
            const onProfilePressMock = jest.fn();
            const { container } = Component({
                profilePic: 'https://mock.org/profile.png',
                onProfilePress: onProfilePressMock,
            });
            fireEvent.press(find(container, profileImageButton), 'Press');
            expect(
                findByProps(
                    container,
                    'profilePic',
                    'https://mock.org/profile.png',
                ),
            ).toBeDefined();
            expect(onProfilePressMock).toBeCalled();
        });
        it('Should fire onPress event, when profileTextButton pressed', () => {
            const onProfilePressMock = jest.fn();
            const { container } = Component({
                name: 'John M',
                profilePic: null,
                onProfilePress: onProfilePressMock,
            });
            fireEvent.press(find(container, profileTextButton), 'Press');
            expect(findByProps(container, 'name', 'John M')).toBeDefined();
            expect(onProfilePressMock).toBeCalled();
        });
    });
});
