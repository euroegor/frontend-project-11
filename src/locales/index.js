import i18next from "i18next";
import yupLocale from "./yupLocale.js";

const resources = {
  ru: {
    translation: {
      success: "RSS успешно загружен",
      errors: {
        required: "Поле не должно быть пустым",
        url: "Ссылка должна быть валидным URL",
        duplicate: "RSS уже существует",
      },
    },
  },
};

const initI18n = () =>
  i18next
    .init({
      lng: "ru",
      debug: false,
      resources,
    })
    .then(() => {
      yupLocale();
    });

export default initI18n;
