import React from 'react';
import { storiesOf } from '@storybook/react-native';
import '../../../i18n';
import Carousel from './index';
import CenterView from '../../../shared/CenterView';
import Images from '../img/peach';

storiesOf('Carousel', module)
    .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
    .add('Default', () => (
        <Carousel
            image={Images.masterClassCompletion_carousel_card_1}
            title={'Experience the unique benefits of'}
            subTitle={'on completing your final step'}
            description={
                'You have now learnt to connect with your inner self by listening to the heart’s voice. which will help you make wise choices to'
            }
            descriptionHighlightedText={'weave your own destiny.'}
        />
    ));
