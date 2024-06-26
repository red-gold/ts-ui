/* eslint-disable no-unused-vars */
/**
 * ISO 639-1 defines abbreviations for languages.
 * Reference for country codes
 * https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
 */
export enum LanguageType {
    Abkhazian = 'ab',
    Afar = 'aa',
    Afrikaans = 'af',
    Akan = 'ak',
    Albanian = 'sq',
    Amharic = 'am',
    Arabic = 'ar',
    Aragonese = 'an',
    Armenian = 'hy',
    Assamese = 'as',
    Avaric = 'av',
    Avestan = 'ae',
    Aymara = 'ay',
    Azerbaijani = 'az',
    Bambara = 'bm',
    Bashkir = 'ba',
    Basque = 'eu',
    Belarusian = 'be',
    BengaliBangla = 'bn',
    Bihari = 'bh',
    Bislama = 'bi',
    Bosnian = 'bs',
    Breton = 'br',
    Bulgarian = 'bg',
    Burmese = 'my',
    Catalan = 'ca',
    Chamorro = 'ch',
    Chechen = 'ce',
    ChichewaChewaNyanja = 'ny',
    Chinese = 'zh',
    ChineseSimplified = 'zh-Hans',
    ChineseTraditional = 'zh-Hant',
    Chuvash = 'cv',
    Cornish = 'kw',
    Corsican = 'co',
    Cree = 'cr',
    Croatian = 'hr',
    Czech = 'cs',
    Danish = 'da',
    DivehiDhivehiMaldivian = 'dv',
    Dutch = 'nl',
    Dzongkha = 'dz',
    English = 'en',
    Esperanto = 'eo',
    Estonian = 'et',
    Ewe = 'ee',
    Faroese = 'fo',
    Fijian = 'fj',
    Finnish = 'fi',
    French = 'fr',
    FulaFulahPulaarPular = 'ff',
    Galician = 'gl',
    GaelicScottish = 'gd',
    GaelicManx = 'gv',
    Georgian = 'ka',
    German = 'de',
    Greek = 'el',
    Greenlandic = 'kl',
    Guarani = 'gn',
    Gujarati = 'gu',
    HaitianCreole = 'ht',
    Hausa = 'ha',
    Hebrew = 'he',
    Herero = 'hz',
    Hindi = 'hi',
    HiriMotu = 'ho',
    Hungarian = 'hu',
    Icelandic = 'is',
    Ido = 'io',
    Igbo = 'ig',
    Indonesian = 'in',
    Interlingua = 'ia',
    Interlingue = 'ie',
    Inuktitut = 'iu',
    Inupiak = 'ik',
    Irish = 'ga',
    Italian = 'it',
    Japanese = 'ja',
    Javanese = 'jv',
    KalaallisutGreenlandic = 'kl',
    Kannada = 'kn',
    Kanuri = 'kr',
    Kashmiri = 'ks',
    Kazakh = 'kk',
    Khmer = 'km',
    Kikuyu = 'ki',
    KinyarwandaRwanda = 'rw',
    Kirundi = 'rn',
    Kyrgyz = 'ky',
    Komi = 'kv',
    Kongo = 'kg',
    Korean = 'ko',
    Kurdish = 'ku',
    Kwanyama = 'kj',
    Lao = 'lo',
    Latin = 'la',
    LatvianLettish = 'lv',
    LimburgishLimburger = 'li',
    Lingala = 'ln',
    Lithuanian = 'lt',
    LugaKatanga = 'lu',
    LugandaGanda = 'lg',
    Luxembourgish = 'lb',
    Manx = 'gv',
    Macedonian = 'mk',
    Malagasy = 'mg',
    Malay = 'ms',
    Malayalam = 'ml',
    Maltese = 'mt',
    Maori = 'mi',
    Marathi = 'mr',
    Marshallese = 'mh',
    Moldavian = 'mo',
    Mongolian = 'mn',
    Nauru = 'na',
    Navajo = 'nv',
    Ndonga = 'ng',
    NorthernNdebele = 'nd',
    Nepali = 'ne',
    Norwegian = 'no',
    Norwegianbokmål = 'nb',
    NorwegianNynorsk = 'nn',
    Nuosu = 'ii',
    Occitan = 'oc',
    Ojibwe = 'oj',
    OldChurchSlavonicOldBulgarian = 'cu',
    Oriya = 'or',
    OromoAfaanOromo = 'om',
    Ossetian = 'os',
    Pāli = 'pi',
    PashtoPushto = 'ps',
    PersianFarsi = 'fa',
    Polish = 'pl',
    Portuguese = 'pt',
    PunjabiEastern = 'pa',
    Quechua = 'qu',
    Romansh = 'rm',
    Romanian = 'ro',
    Russian = 'ru',
    Sami = 'se',
    Samoan = 'sm',
    Sango = 'sg',
    Sanskrit = 'sa',
    Serbian = 'sr',
    SerboCroatian = 'sh',
    Sesotho = 'st',
    Setswana = 'tn',
    Shona = 'sn',
    SichuanYi = 'ii',
    Sindhi = 'sd',
    Sinhalese = 'si',
    Siswati = 'ss',
    Slovak = 'sk',
    Slovenian = 'sl',
    Somali = 'so',
    SouthernNdebele = 'nr',
    Spanish = 'es',
    Sundanese = 'su',
    SwahiliKiswahili = 'sw',
    Swati = 'ss',
    Swedish = 'sv',
    Tagalog = 'tl',
    Tahitian = 'ty',
    Tajik = 'tg',
    Tamil = 'ta',
    Tatar = 'tt',
    Telugu = 'te',
    Thai = 'th',
    Tibetan = 'bo',
    Tigrinya = 'ti',
    Tonga = 'to',
    Tsonga = 'ts',
    Turkish = 'tr',
    Turkmen = 'tk',
    Twi = 'tw',
    Uyghur = 'ug',
    Ukrainian = 'uk',
    Urdu = 'ur',
    Uzbek = 'uz',
    Venda = 've',
    Vietnamese = 'vi',
    Volapük = 'vo',
    Wallon = 'wa',
    Welsh = 'cy',
    Wolof = 'wo',
    WesternFrisian = 'fy',
    Xhosa = 'xh',
    Yiddish = 'yi',
    Yoruba = 'yo',
    ZhuangChuang = 'za',
    Zulu = 'zu',
}
