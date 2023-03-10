import React from 'react';
import { storiesOf } from '@storybook/react-native';
import '../../../i18n';
import BenefitsCarouselCard from './index';
import CenterView from '../../shared/CenterView';
import Images from '../img/peach';

storiesOf('BenefitsCarouselCard', module)
    .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
    .add('Default', () => (
        <BenefitsCarouselCard
            image={Images.carousel_card_1}
            title={'Experience the unique benefits of'}
            description={'Heartfulness practitioners'}
            descriptionHighlightedText={'Yogic Transmission'}
            descriptionSuffix={'Mock Heartfulness practitioners'}
        />
    ));
