import { setLocale } from 'yup';
import i18next from 'i18next';

export default () => {
  setLocale({
    mixed: {
      required: () => i18next.t('errors.required'),
      notOneOf: () => i18next.t('errors.duplicate'),
    },
    string: {
      url: () => i18next.t('errors.url'),
    },
  });
};