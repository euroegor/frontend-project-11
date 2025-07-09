const renderFeedback = (elements, state) => {
  const { feedback, input } = elements;

  if (state.form.status === 'valid') {
    feedback.textContent = 'RSS успешно загружен';
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    input.classList.remove('is-invalid');
  }

  if (state.form.status === 'invalid') {
    feedback.textContent = state.form.error;
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
    input.classList.add('is-invalid');
  }

  if (state.form.status === 'idle') {
    feedback.textContent = '';
    feedback.classList.remove('text-success', 'text-danger');
    input.classList.remove('is-invalid');
  }
};

const initView = (state, elements) => {
  return (path) => {
    if (path === 'form.status' || path === 'form.error') {
      renderFeedback(elements, state);
    }
  };
};

export default initView;