import { useTranslation } from 'react-i18next';
// material
import { enUS, deDE, frFR } from '@mui/material/locale';

// ----------------------------------------------------------------------

const LANGS = [
    {
        label: 'English',
        value: 'en',
        systemValue: enUS,
        icon: '/static/icons/ic_flag_en.svg',
    },
    {
        label: 'German',
        value: 'de',
        systemValue: deDE,

        icon: '/static/icons/ic_flag_de.svg',
    },
    {
        label: 'French',
        value: 'fr',
        systemValue: frFR,
        icon: '/static/icons/ic_flag_fr.svg',
    },
];

// ----------------------------------------------------------------------

export default function useLocales() {
    const { i18n, t } = useTranslation();
    const langStorage = localStorage.getItem('i18nextLng');
    const currentLang = LANGS.find((_lang) => _lang.value === langStorage) || LANGS[1];

    const handleChangeLanguage = (newlang: string) => {
        i18n.changeLanguage(newlang);
    };

    return {
        onChangeLang: handleChangeLanguage,
        t,
        currentLang,
        allLang: LANGS,
    };
}
