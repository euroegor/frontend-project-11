import i18next from "i18next";
import * as yup from "yup";
import ru from "./ru.js";

const initI18n = () =>
  i18next
    .init({
      lng: "ru",
      debug: false,
      resources: {
        ru,
      },
    })
    .then(() => {
      yup.setLocale({
        mixed: { required: "errors.required" },
        string: { url: "errors.invalidUrl" },
      });
      return i18next;
    });

export default initI18n;
