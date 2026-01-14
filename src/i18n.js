import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        heroTitle: "Free Online Calculators for Everyday Needs",
        explore: "Explore Free Calculators",
      },
    },
    hi: {
      translation: {
        heroTitle: "दैनिक उपयोग के लिए मुफ्त कैलकुलेटर",
        explore: "कैलकुलेटर देखें",
      },
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
