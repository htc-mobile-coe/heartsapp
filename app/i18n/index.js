import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { NativeModules } from 'react-native';
import StorageService from '../services/native/AppStorageService';
import { setAppLocale } from '../services/firebase/AnalyticsService';
import { split, get, replace, lowerCase } from 'lodash';
import { IsAndroid, IsIOS } from '../shared/Constants';

import de from './de'; // German
import en from './en'; // English
import es from './es'; // Spanish
import fr from './fr'; // French
import hi from './hi'; // Hindi
import it from './it'; // Italian
import zh_hans from './zh-Hans'; // Simplified Chinese
import zh_hant from './zh-Hant'; // Traditional Chinese
import zh_hk from './zh-HK'; // Traditional Chinese Hong Kong
import te from './te'; // Telugu
import ta from './ta'; // Tamil
import kn from './kn'; // Kannada
import mr from './mr'; // Marathi
import gu from './gu'; // Gujarati
import ml from './ml'; // Malayalam
import ru from './ru'; // Russian
import pt from './pt'; // Portuguese
import fi from './fi'; // Finnish
import ro from './ro'; // Romanian
import hr from './hr'; // Croatian
import bn from './bn'; // Bengali
import pt_br from './pt-BR'; //Brazilian Portuguese (pt-br)

const localeMap = {
    zh: structuredLocale => {
        switch (lowerCase(get(structuredLocale, 'variantCode'))) {
            case 'hans':
                return 'zh-Hans';

            case 'hant':
                return 'zh-Hant';

            case 'hk':
                return 'zh-HK';

            default:
                return 'zh-Hans';
        }
    },
    pt: structuredLocale => {
        switch (lowerCase(get(structuredLocale, 'countryCode'))) {
            case 'br':
                return 'pt-BR';

            default:
                return 'pt';
        }
    },
};

const ENABLE_LOCALE_DETECTION = true;

const localeWithoutVariant = structuredLocale => {
    const localeCode = get(structuredLocale, 'localeCode');
    return localeCode || 'en';
};

const getStructuredLocale = () => {
    if (IsAndroid) {
        const deviceLocaleId = NativeModules.I18nManager.localeIdentifier;
        const localeIdParts = split(deviceLocaleId, '_');

        return {
            localeCode: get(localeIdParts, '[0]'),
            countryCode: get(localeIdParts, '[1]'),
            variantCode: replace(get(localeIdParts, '[2]'), '#', ''),
        };
    }

    if (IsIOS) {
        const deviceLocaleId =
            NativeModules.SettingsManager.settings.AppleLocale ||
            get(NativeModules.SettingsManager.settings.AppleLanguages, '[0]');

        const localeIdParts = split(deviceLocaleId, '_');
        const localeCodePart = get(localeIdParts, '[0]');
        const localeCodeParts = split(localeCodePart, '-');

        return {
            localeCode: get(localeCodeParts, '[0]'),
            countryCode: get(localeIdParts, '[1]'),
            variantCode: get(localeCodeParts, '[1]'),
        };
    }
};

const getAppSupportedLocale = structuredLocale => {
    const determineAppSupportedLocale = get(
        localeMap,
        get(structuredLocale, 'localeCode'),
        localeWithoutVariant,
    );

    return determineAppSupportedLocale(structuredLocale);
};

// creating a language detection plugin using expo
// http://i18n.com/docs/ownplugin/#languagedetector
const languageDetector = {
    init: () => {},
    type: 'languageDetector',
    async: true, // flags below detection to be async
    detect: async callback => {
        if (ENABLE_LOCALE_DETECTION) {
            const appLocale = await StorageService.appLocale.getValue();
            const lng = appLocale ? appLocale : undefined;

            if (lng) {
                return lng;
            }

            const structuredLocale = getStructuredLocale();
            const selectedLanguge = getAppSupportedLocale(structuredLocale);

            callback(selectedLanguge);
            setAppLocale(selectedLanguge);
        } else {
            callback('en');
            setAppLocale('en');
        }
    },
    cacheUserLanguage: () => {},
};

i18n.use(languageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        resources: {
            de,
            en,
            es,
            fr,
            hi,
            it,
            te,
            ta,
            kn,
            mr,
            gu,
            ml,
            ru,
            pt,
            fi,
            ro,
            hr,
            bn,
            'pt-BR': pt_br,
            'zh-Hans': zh_hans,
            'zh-Hant': zh_hant,
            'zh-HK': zh_hk,
        },
        ns: ['common'],
        defaultNS: 'common',
        debug: true,
        interpolation: {
            escapeValue: false, // not needed for react as it does escape per default to prevent xss!
        },
    });

export default i18n;
