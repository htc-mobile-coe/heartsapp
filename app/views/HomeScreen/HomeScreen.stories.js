import React from 'react';
import { storiesOf } from '@storybook/react-native';
import '../../i18n';
import HomeScreen from './HomeScreen';

storiesOf('HomeScreen', module)
    .add('Default', () => <HomeScreen attested={false} />)
    .add('Sign Out', () => (
        <HomeScreen
            userName={'Shankar'}
            canSignOut={true}
            additionalAbhyasisCount={0}
        />
    ))
    .add('Preceptor', () => (
        <HomeScreen
            userName={'Shankar'}
            canSignOut={true}
            additionalAbhyasisCount={0}
            isPreceptor={true}
        />
    ));
