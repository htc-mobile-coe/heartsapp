import React from 'react';
import { storiesOf } from '@storybook/react-native';
import '../../i18n';
import ProfileScreen from './ProfileScreen';

storiesOf('Profile Screen', module)
    .add('Default', () => (
        <ProfileScreen
            printName={'Shankar'}
            abhyasiId={'CNSYAA231'}
            shouldPlayGuidedRelaxationAudio={false}
        />
    ))
    .add('GuidedRelaxationAudio', () => (
        <ProfileScreen isUserPreceptor={true} />
    ));
