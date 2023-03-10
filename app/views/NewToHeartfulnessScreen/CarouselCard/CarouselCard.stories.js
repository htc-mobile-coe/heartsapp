import React from 'react';
import { storiesOf } from '@storybook/react-native';
import '../../../i18n';
import CarouselCard from './index';
import CenterView from '../../shared/CenterView';
import Images from '../img/peach';

storiesOf('CarouselCard', module)
    .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
    .add('Default', () => (
        <CarouselCard
            image={Images.carousel_card_1}
            title={'Experience the unique benefits of'}
            heading={'Yogic Transmission'}
            description={'Heartfulness practitioners'}
        />
    ))
    .add('show more', () => (
        <CarouselCard
            image={Images.carousel_card_3}
            title={'Experience the unique benefits of'}
            heading={'Yogic Transmission'}
            description={
                "with a Heartfulness trainer.Yogic transmission is a specialfeature of Heartfulness. Through it,a trainer can direct the flow of subtle energy into the practitioner's heart which aid in the quicker experience of peace and inner transformation"
            }
        />
    ));
