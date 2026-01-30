const render = (watchedState, i18n) => {
  const feedsContainer = document.getElementById('feeds-container')
  const postsContainer = document.getElementById('posts-container')
  const feedback = document.querySelector('.feedback')
  const input = document.getElementById('url-input')
  input.value = watchedState.form.url

  const modalTitle = document.querySelector('.modal-title')
  const modalBody = document.querySelector('.modal-body')
  const modalLink = document.querySelector('.full-article')

  if (watchedState.ui.modalPostId !== null) {
    const id = watchedState.ui.modalPostId
    const post = watchedState.posts.find((p) => p.id === id)
    if (!post) return
    modalTitle.textContent = post.title
    modalBody.textContent = post.description
    modalLink.href = post.link
  }

  const renderFeeds = () => {
    feedsContainer.innerHTML = ''
    if (watchedState.feeds.length === 0) {
      return
    }
    const feedBorder = document.createElement('div')
    feedBorder.classList.add('card', 'border-0')

    const feedBody = document.createElement('div')
    feedBody.classList.add('card-body')

    const feedTitle = document.createElement('h2')
    feedTitle.classList.add('card-title', 'h4')
    feedTitle.textContent = i18n.t('feeds.title')

    const listUl = document.createElement('ul')
    listUl.classList.add('list-group', 'border-0', 'rounded-0')

    feedBody.append(feedTitle)
    feedBorder.append(feedBody, listUl)
    feedsContainer.append(feedBorder)

    watchedState.feeds.forEach((feed) => {
      const listLi = document.createElement('li')
      listLi.classList.add('list-group-item', 'border-0', 'border-end-0')

      const titleEl = document.createElement('h3')
      titleEl.classList.add('h6', 'm-0')
      titleEl.textContent = feed.title

      const descEl = document.createElement('p')
      descEl.classList.add('m-0', 'small', 'text-black-50')
      descEl.textContent = feed.description

      listLi.append(titleEl, descEl)
      listUl.append(listLi)
    })
  }

  const renderPosts = () => {
    postsContainer.innerHTML = ''
    if (watchedState.posts.length === 0) {
      return
    }
    const postBorder = document.createElement('div')
    postBorder.classList.add('card', 'border-0')

    const postBody = document.createElement('div')
    postBody.classList.add('card-body')

    const postTitle = document.createElement('h2')
    postTitle.classList.add('card-title', 'h4')
    postTitle.textContent = i18n.t('posts.title')

    const listUl = document.createElement('ul')
    listUl.classList.add('list-group', 'border-0', 'rounded-0')

    postBody.append(postTitle)
    postBorder.append(postBody, listUl)
    postsContainer.append(postBorder)

    watchedState.posts.forEach((post) => {
      const listLi = document.createElement('li')
      listLi.classList.add(
        'list-group-item',
        'd-flex',
        'justify-content-between',
        'align-items-start',
        'border-0',
        'border-end-0',
      )

      const link = document.createElement('a')

      if (watchedState.ui.readPostsIds.includes(post.id)) {
        link.classList.add('fw-normal', 'link-secondary')
      } else {
        link.classList.add('fw-bold')
      }

      link.href = post.link
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      link.textContent = post.title
      link.dataset.id = post.id

      const button = document.createElement('button')
      button.classList.add('btn', 'btn-outline-primary', 'btn-sm')
      button.type = 'button'
      button.dataset.id = post.id
      button.textContent = i18n.t('posts.preview')
      button.dataset.bsToggle = 'modal'
      button.dataset.bsTarget = '#modal'

      listLi.append(link, button)
      listUl.append(listLi)
    })
  }

  renderFeeds()
  renderPosts()

  if (watchedState.form.status === 'sending') {
    input.classList.remove('is-invalid')
  } else if (watchedState.form.status === 'failed') {
    input.classList.add('is-invalid')
    feedback.classList.remove('text-success')
    feedback.classList.add('text-danger')
  } else {
    input.classList.remove('is-invalid')
  }
  if (watchedState.form.status === 'failed') {
    feedback.textContent = i18n.t(watchedState.form.error)
  } else if (watchedState.form.status === 'success') {
    input.classList.remove('is-invalid')
    feedback.textContent = i18n.t('feedback.success')
    feedback.classList.remove('text-danger')
    feedback.classList.add('text-success')
    input.focus()
  } else if (watchedState.form.status === 'idle') {
    feedback.textContent = ''
    feedback.classList.remove('text-danger', 'text-success')
  }
}

export default render
