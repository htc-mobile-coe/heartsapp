import { storiesOf } from '@storybook/react-native';
import BasicPracticesScreen from './BasicPracticesScreen';
import { BASIC_PRACTICES_VIDEOS } from '../../shared/Constants';
import React from 'react';
import Images from '../MasterClassesScreen/MasterClassVideoInformation/img';

const basicPracticesConfig = {
    languages: [{ label: 'English', value: 'en' }],
    en: {
        heading: 'Basic Practices',
        relaxation: {
            id: BASIC_PRACTICES_VIDEOS.RELAXATION,
            titlePart2: 'Relaxation',
            previewImageURL: Images.intro_to_heartfulness,
            videoURL: '',
        },
        meditation: {
            id: BASIC_PRACTICES_VIDEOS.MEDITATION,
            titlePart2: 'Meditation',
            previewImageURL: Images.intro_to_masterclass,
            videoURL: '',
        },
        cleaning: {
            id: BASIC_PRACTICES_VIDEOS.CLEANING,
            titlePart2: 'Cleaning',
            previewImageURL: Images.day1Video,
            videoURL: '',
        },
        prayer: {
            id: BASIC_PRACTICES_VIDEOS.PRAYER,
            titlePart2: 'Prayer',
            previewImageURL: Images.day2Video,
            videoURL: '',
        },
    },
};

storiesOf('Basic Practices Screen', module)
    .add('Relaxation', () => (
        <BasicPracticesScreen
            config={basicPracticesConfig}
            selectedLanguage={'en'}
            expandedCard={BASIC_PRACTICES_VIDEOS.RELAXATION}
        />
    ))
    .add('Meditation', () => (
        <BasicPracticesScreen
            config={basicPracticesConfig}
            selectedLanguage={'en'}
            expandedCard={BASIC_PRACTICES_VIDEOS.MEDITATION}
        />
    ));
