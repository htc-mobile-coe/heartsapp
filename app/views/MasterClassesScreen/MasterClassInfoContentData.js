import i18n from 'i18next';

export const MASTER_CLASS_INFO_CONTENT = {
    DAY_1_CONGRATULATIONS: 'DAY_1_CONGRATULATIONS',
    DAY_1_WELCOME_BACK: 'DAY_1_WELCOME_BACK',
    DAY_2_CONGRATULATIONS: 'DAY_2_CONGRATULATIONS',
    DAY_2_WELCOME_BACK: 'DAY_2_WELCOME_BACK',
    DAY_3_CONGRATULATIONS: 'DAY_3_CONGRATULATIONS',
};

export const MASTER_CLASS_INFO_CONTENT_DATA = {
    DAY_1_CONGRATULATIONS: {
        title: i18n.t('masterClassesScreen:congratulations'),
        subTitle: i18n.t('masterClassesScreen:onYourFirstStep'),
        description1: i18n.t(
            'masterClassesScreen:onDay2YouWillLearnToDetoxYourMind',
        ),
        description2: i18n.t('masterClassesScreen:and'),

        descriptionHighlightedText1: i18n.t('masterClassesScreen:relaxation'),
        descriptionHighlightedText2: i18n.t('masterClassesScreen:meditation'),
        image: 'masterClass_day_1',
        descriptionFullStop: '.',
    },
    DAY_1_WELCOME_BACK: {
        title: i18n.t('masterClassesScreen:welcomeBack'),
        subTitle: i18n.t('masterClassesScreen:toDay2'),
        description1: i18n.t('masterClassesScreen:inThisSessionYouWillLearnA'),
        description2: undefined,
        description3: i18n.t(
            'masterClassesScreen:toDetoxYourMindLearnToRefresh',
        ),
        descriptionHighlightedText1: i18n.t(
            'masterClassesScreen:simpleRejuvenatingMethod',
        ),
        descriptionHighlightedText2: undefined,
        image: 'masterClass_day_2',
    },
    DAY_2_CONGRATULATIONS: {
        title: i18n.t('masterClassesScreen:congratulations'),
        subTitle: i18n.t('masterClassesScreen:onYourSecondStep'),
        description1: i18n.t('masterClassesScreen:youHaveNowLearntHow'),
        description2: i18n.t('masterClassesScreen:and'),
        description3: i18n.t('masterClassesScreen:onDay3YouWillLearnToConnect'),
        descriptionHighlightedText1: i18n.t('masterClassesScreen:detox'),
        descriptionHighlightedText2: i18n.t('masterClassesScreen:rejuvenate'),
        image: 'masterClass_day_2',
        descriptionFullStop: '.',
    },
    DAY_2_WELCOME_BACK: {
        title: i18n.t('masterClassesScreen:welcomeBack'),
        subTitle: i18n.t('masterClassesScreen:toTheFinalStepDay3'),
        description1: i18n.t('masterClassesScreen:inThisSessionYouWillLearn'),
        description2: undefined,
        description3: i18n.t('masterClassesScreen:toWeaveYourOwnDestiny'),
        descriptionHighlightedText1: i18n.t(
            'masterClassesScreen:makeWiseChoices',
        ),
        descriptionHighlightedText2: undefined,
        image: 'masterClass_day_3',
    },
    DAY_3_CONGRATULATIONS: [
        {
            title: i18n.t('masterClassesScreen:congratulations'),
            subTitle: i18n.t('masterClassesScreen:onCompletingYourFinalStep'),
            description1: i18n.t(
                'masterClassesScreen:youHaveNowLearntToConnect',
            ),
            descriptionHighlightedText1: i18n.t(
                'masterClassesScreen:weaveYourOwnDestiny',
            ),
            image: 'masterClassCompletion_carousel_card_1',
        },
        {
            title: undefined,
            subTitle: i18n.t(
                'masterClassesScreen:everydayIsAChanceToTrainYour',
            ),
            description1: i18n.t(
                'masterClassesScreen:moveAheadInHeartfulnessJourneyByFollowing',
            ),
            descriptionHighlightedText1: i18n.t(
                'masterClassesScreen:guidedPracticeDaily',
            ),
            descriptionHighlightedText2: i18n.t(
                'masterClassesScreen:meditateWithTrainerWeekly',
            ),
            description2: i18n.t('masterClassesScreen:and'),
            image: 'masterClassCompletion_carousel_card_2',
        },
    ],
};
