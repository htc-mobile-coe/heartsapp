import i18n from 'i18next';
export const COMPLETED_INTRO_SESSIONS_AT_EVENT = 'EVENT';
export const COMPLETED_INTRO_SESSIONS_WITH_TRAINER = 'PRECEPTOR_SITTING';
export const COMPLETED_INTRO_SESSIONS_IN_ONLINE = 'WEBSITE_OR_YOUTUBE';
export const COMPLETED_INTRO_SESSIONS_USING_HEARTSAPP = 'HEARTSAPP';
export const IntroductorySittingsAttestationOptions = [
    {
        id: COMPLETED_INTRO_SESSIONS_AT_EVENT,
        label: i18n.t('introductorySittingsAttestationScreen:anEvent'),
        firebaseEvent: 'taken3Sittings_atEvent',
    },
    {
        id: COMPLETED_INTRO_SESSIONS_WITH_TRAINER,
        label: i18n.t('introductorySittingsAttestationScreen:fromTrainer'),
        firebaseEvent: 'taken3Sittings_fromTrainer',
    },
    {
        id: COMPLETED_INTRO_SESSIONS_IN_ONLINE,
        label: i18n.t('introductorySittingsAttestationScreen:online'),
        firebaseEvent: 'taken3Sittings_online',
    },
    {
        id: COMPLETED_INTRO_SESSIONS_USING_HEARTSAPP,
        label: i18n.t('introductorySittingsAttestationScreen:usingHeartsApp'),
        firebaseEvent: 'taken3Sittings_heartsApp',
    },
];
