import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';
const localePath = process.env.NODE_ENV === 'production' ? 'locales' : 'locales';
i18n.use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        // have a common namespace used around the full app
        ns: ['translations'],
        defaultNS: 'translations',
        preload: ['en', 'zh', 'vi'],
        backend: {
            loadPath: `${localePath}/{{ns}}/enjson_{{lng}}.json`,
        },
        debug: false,
        interpolation: {
            escapeValue: false, // not needed for react!!
        },
        react: {
            wait: true,
            useSuspense: false,
        },
    });

export default i18n;
