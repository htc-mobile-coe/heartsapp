import React from 'react';
import { storiesOf } from '@storybook/react-native';
import '../../i18n';
import DataDoesNotMatchScreen from './DataDoesNotMatchScreen';

storiesOf('DataDoesNotMatch Screen', module).add('All', () => (
    <DataDoesNotMatchScreen
        errorMessage={'ERRORRRRRRR'}
        showSuccessMessage={false}
    />
));
