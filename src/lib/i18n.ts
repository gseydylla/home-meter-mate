export type Lang = "en" | "ru" | "tk";

export const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
  { code: "tk", label: "Türkmençe" },
];

export type UtilityKey = "gas" | "electric" | "water";

export const UTILITIES: UtilityKey[] = ["gas", "electric", "water"];

export const UNIT_LABEL: Record<UtilityKey, string> = {
  gas: "m³",
  electric: "kWh",
  water: "m³",
};

type Dict = {
  appName: string;
  tagline: string;
  chooseLanguage: string;
  chooseLanguageHint: string;
  continue: string;
  gas: string;
  electric: string;
  water: string;
  settings: string;
  history: string;
  back: string;
  previousReading: string;
  currentReading: string;
  save: string;
  calculate: string;
  used: string;
  unitPrice: string;
  total: string;
  errNumbers: string;
  errCurrentLower: string;
  saved: string;
  needCalc: string;
  noRecords: string;
  all: string;
  deleted: string;
  clearAll: string;
  clearAllConfirm: string;
  cancel: string;
  theme: string;
  light: string;
  dark: string;
  system: string;
  language: string;
  prices: string;
  currency: string;
  data: string;
  cleared: string;
  perUnit: string;
  date: string;
};

const en: Dict = {
  appName: "MeterPay",
  tagline: "Gas, electricity and water bills — offline",
  chooseLanguage: "Choose your language",
  chooseLanguageHint: "You can change this later in Settings.",
  continue: "Continue",
  gas: "Gas",
  electric: "Electricity",
  water: "Water",
  settings: "Settings",
  history: "History",
  back: "Back",
  previousReading: "Previous meter reading",
  currentReading: "Current meter reading",
  save: "Save",
  calculate: "Calculate",
  used: "Used",
  unitPrice: "Unit price",
  total: "Total",
  errNumbers: "Please enter valid numbers.",
  errCurrentLower: "Current reading must be greater than or equal to the previous one.",
  saved: "Record saved",
  needCalc: "Enter both readings first.",
  noRecords: "No records yet.",
  all: "All",
  deleted: "Record deleted",
  clearAll: "Clear all data",
  clearAllConfirm: "This deletes all saved records on this device. Continue?",
  cancel: "Cancel",
  theme: "Appearance",
  light: "Light",
  dark: "Dark",
  system: "System",
  language: "Language",
  prices: "Prices",
  currency: "Currency",
  data: "Data",
  cleared: "All data cleared",
  perUnit: "per",
  date: "Date",
};

const ru: Dict = {
  appName: "MeterPay",
  tagline: "Газ, свет и вода — офлайн расчёт",
  chooseLanguage: "Выберите язык",
  chooseLanguageHint: "Позже можно изменить в настройках.",
  continue: "Продолжить",
  gas: "Газ",
  electric: "Свет",
  water: "Вода",
  settings: "Настройки",
  history: "История",
  back: "Назад",
  previousReading: "Предыдущее показание счётчика",
  currentReading: "Текущее показание счётчика",
  save: "Сохранить",
  calculate: "Рассчитать",
  used: "Расход",
  unitPrice: "Цена за единицу",
  total: "Итого",
  errNumbers: "Введите корректные числа.",
  errCurrentLower: "Текущее показание должно быть не меньше предыдущего.",
  saved: "Запись сохранена",
  needCalc: "Сначала введите оба показания.",
  noRecords: "Записей пока нет.",
  all: "Все",
  deleted: "Запись удалена",
  clearAll: "Удалить все данные",
  clearAllConfirm: "Все сохранённые записи на этом устройстве будут удалены. Продолжить?",
  cancel: "Отмена",
  theme: "Оформление",
  light: "Светлая",
  dark: "Тёмная",
  system: "Системная",
  language: "Язык",
  prices: "Цены",
  currency: "Валюта",
  data: "Данные",
  cleared: "Все данные удалены",
  perUnit: "за",
  date: "Дата",
};

const tk: Dict = {
  appName: "MeterPay",
  tagline: "Gaz, tok we suw hasaby — internetsiz",
  chooseLanguage: "Dili saýlaň",
  chooseLanguageHint: "Soňra sazlamalarda üýtgedip bilersiňiz.",
  continue: "Dowam et",
  gas: "Gaz",
  electric: "Tok",
  water: "Suw",
  settings: "Sazlamalar",
  history: "Taryh",
  back: "Yza",
  previousReading: "Öňki sanaç görkezijisi",
  currentReading: "Häzirki sanaç görkezijisi",
  save: "Ýatda sakla",
  calculate: "Hasapla",
  used: "Ulanylan",
  unitPrice: "Birlik bahasy",
  total: "Jemi",
  errNumbers: "Dogry san giriziň.",
  errCurrentLower: "Häzirki görkeziji öňkiden kiçi bolmaly däl.",
  saved: "Ýazgy saklandy",
  needCalc: "Ilki iki görkezijini giriziň.",
  noRecords: "Häzir ýazgy ýok.",
  all: "Ählisi",
  deleted: "Ýazgy pozuldy",
  clearAll: "Ähli maglumaty poz",
  clearAllConfirm: "Bu enjamdaky ähli ýazgylar pozulýar. Dowam edilsinmi?",
  cancel: "Ýatyr",
  theme: "Görnüş",
  light: "Ýagty",
  dark: "Garaňky",
  system: "Ulgam",
  language: "Dil",
  prices: "Bahalar",
  currency: "Pul birligi",
  data: "Maglumat",
  cleared: "Ähli maglumat pozuldy",
  perUnit: "her",
  date: "Senesi",
};

export const DICTS: Record<Lang, Dict> = { en, ru, tk };

export type TranslationKey = keyof Dict;
