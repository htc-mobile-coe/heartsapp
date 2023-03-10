import i18n from 'i18next';
export const REGISTER = 'REGISTER';
export const QRCODE = 'QRCODE';
export const VIEW = 'VIEW';
export const SEARCH = 'SEARCH';
export const EVENT_TRACKER = 'EVENT_TRACKER';
export const OTHERS = 'OTHERS';
export const TrainersSectionData = [
    {
        id: REGISTER,
        title: i18n.t('trainersSection:register'),
        subTitle: i18n.t('trainersSection:registerNewSeeker'),
        image: 'registerNewSeeker',
    },
    {
        id: QRCODE,
        title: i18n.t('trainersSection:shareQRCode'),
        subTitle: i18n.t('trainersSection:forSelf'),
        image: 'shareQRCode',
    },
    {
        id: VIEW,
        title: i18n.t('trainersSection:view'),
        subTitle: i18n.t('trainersSection:seekersAssignedToMe'),
        image: 'viewSeekers',
    },
    {
        id: SEARCH,
        title: i18n.t('trainersSection:search'),
        subTitle: i18n.t('trainersSection:searchForSeekers'),
        image: 'searchForSeekers',
    },
    {
        id: EVENT_TRACKER,
        title: i18n.t('trainersSection:eventTracker'),
        subTitle: i18n.t('trainersSection:clickAndLaunchEventTracker'),
        image: 'eventTracker',
    },
    {
        id: OTHERS,
        title: i18n.t('trainersSection:others'),
        subTitle: i18n.t('trainersSection:clickAndLaunchForHeartfulness'),
        image: 'others',
    },
];
