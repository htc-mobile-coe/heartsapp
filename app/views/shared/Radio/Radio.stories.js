import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import '../../../i18n';
import Radio from './index';
import CenterView from '../CenterView';
import { MASTERCLASS_VIDEOS } from 'app/shared/Constants';

const IntroductorySittingDaysCompletionEnquiryOptions = [
    {
        id: MASTERCLASS_VIDEOS.DAY1,
        label: 'DAY 1',
    },
    {
        id: MASTERCLASS_VIDEOS.DAY2,
        label: 'DAY 1 & 2',
    },
    {
        id: MASTERCLASS_VIDEOS.DAY3,
        label: 'DAY 1, 2 & 3',
    },
];

storiesOf('Radio', module)
    .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
    .add('Radio UnSelected', () => (
        <Radio onPress={action('clicked')}
            data={IntroductorySittingDaysCompletionEnquiryOptions}
            selected={false}
            text={"unChecked"}
            color={'#9F9F9F'}
        />
    ))
    .add('Radio Selected', () => (
        <Radio
            data={IntroductorySittingDaysCompletionEnquiryOptions}
            selected
            selectedColor={'#FF7D6A'}
            text={"Checked"}
        />
    ));
