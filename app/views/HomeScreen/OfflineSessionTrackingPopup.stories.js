import React from 'react';
import { storiesOf } from '@storybook/react-native';
import '../../i18n';
import OfflineSessionTrackingPopup from './OfflineSessionTrackingPopup';

storiesOf('OfflineSessionTrackingPopup', module).add('Default', () => (
    <OfflineSessionTrackingPopup showOfflineSessionTrackingPopup={true} />
));
