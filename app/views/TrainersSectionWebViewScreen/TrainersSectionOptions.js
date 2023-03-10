import i18n from 'i18next';
import {
    REGISTER,
    QRCODE,
    VIEW,
    SEARCH,
    EVENT_TRACKER,
    OTHERS,
} from '../TrainersSectionScreen/TrainersSectionData';

export const TrainersSectionOptions = [
    {
        id: REGISTER,
        title: i18n.t('trainersSectionWebViewScreen:register'),
        page: '/trainer/register-practitioner',
    },
    {
        id: QRCODE,
        title: i18n.t('trainersSectionWebViewScreen:qrCode'),
        page: '/trainer/qrcode',
    },
    {
        id: VIEW,
        title: i18n.t('trainersSectionWebViewScreen:view'),
        page: '/trainer/my-practitioners',
    },
    {
        id: SEARCH,
        title: i18n.t('trainersSectionWebViewScreen:search'),
        page: '/trainer/search-practitioners',
    },
    {
        id: EVENT_TRACKER,
        title: i18n.t('trainersSectionWebViewScreen:eventTracker'),
        page: '',
    },
    {
        id: OTHERS,
        title: i18n.t('trainersSectionWebViewScreen:others'),
        page: '',
    },
];
