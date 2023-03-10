import React from 'react';
import { storiesOf } from '@storybook/react-native';
import '../../i18n';
import HelpDeskScreen from './HelpDeskScreen';
import {
    getContactUsNumber,
    getHelpAndSupportEmailID,
    getTollFreeNumber,
} from '../../services/firebase/RemoteConfigService';

storiesOf('HelpDesk Screen', module).add('All', () => (
    <HelpDeskScreen
        showSuccessMessage={false}
        contactInfoTollFreeNo={getTollFreeNumber()}
        contactInfoMobile={getContactUsNumber()}
        contactInfoEmail={getHelpAndSupportEmailID()}
    />
));
