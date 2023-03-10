import i18n from 'i18next';

export const PostMeditationExperienceOptions = [
    {
        id: 5,
        title: i18n.t('postMeditationExperiencePopup:relaxed'),
        image: 'relaxedImage',
        imageDisabled: 'relaxedDisabledImage',
        isSelected: false,
    },
    {
        id: 6,
        title: i18n.t('postMeditationExperiencePopup:energized'),
        image: 'energizedImage',
        imageDisabled: 'energizedDisabledImage',
        isSelected: false,
    },
    {
        id: 7,
        title: i18n.t('postMeditationExperiencePopup:nothing'),
        image: 'nothingImage',
        imageDisabled: 'nothingDisabledImage',
        isSelected: false,
    },
];
