import React from 'react';
import { storiesOf } from '@storybook/react-native';
import DeleteReloginPopup from './DeleteReloginPopup';
import CenterView from '../shared/CenterView';

storiesOf('Delete Relogin Popup', module)
    .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
    .add('Default', () => <DeleteReloginPopup />);
