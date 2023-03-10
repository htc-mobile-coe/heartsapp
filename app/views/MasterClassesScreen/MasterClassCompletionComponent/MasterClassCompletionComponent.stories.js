import React from 'react';
import { storiesOf } from '@storybook/react-native';
import '../../i18n';
import MasterClassCompletionComponent from './index';

const content = {
    title: 'Congratulations',
    subTitle: 'on completing your final step',
    description:
        'You have now learnt to connect with your inner self by listening to the heart’s voice. which will help you make wise choices to',
    descriptionHighlightedText: 'weave your own destiny.',
    descriptionHighlightedText2: undefined,
    descriptionSuffix1: undefined,
    descriptionSuffix2: undefined,
    image: 'masterClassCompletion_carousel_card_1',
};
storiesOf('MasterClassCompletionComponent', module).add('Default', () => (
    <MasterClassCompletionComponent content={content} />
));
