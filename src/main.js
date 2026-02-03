import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import render from './view.js'
import onChange from 'on-change'
import * as yup from 'yup'
import initI18n from './locales/initI18n.js'
import fetchRss from './controllers/rss.js'

initI18n().then((i18n) => { // NOSONAR
  const state = {
    form: {
      status: 'idle', // idle | success | failed | sending
      error: null,
      url: '',
    },
    feeds: [],
    posts: [],
    ui: {
      readPostsIds: [],
      modalPostId: null,
    },
  }

  const form = document.getElementById('rss-form')

  const watchedState = onChange(state, () => {
    render(watchedState, i18n)
  })

  const schema = yup
    .string()
    .trim()
    .required()
    .url()
    .test('is-duplicate-rss', 'errors.duplicate', (url) => {
      return !watchedState.feeds.some(item => item.url === url)
    })

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const input = document.getElementById('url-input')
    watchedState.form.url = input.value.trim()
    schema
      .validate(watchedState.form.url)
      .then(() => {
        watchedState.form.status = 'sending'
        watchedState.form.error = null
        return fetchRss(watchedState.form.url)
      })
      .then(({ feed, posts }) => {
        const url = watchedState.form.url
        const randomId = crypto.randomUUID()
        const newFeed = {
          id: randomId,
          url: url,
          title: feed.title,
          description: feed.description,
        }
        const newPosts = posts.map((item) => {
          return {
            id: crypto.randomUUID(),
            feedId: randomId,
            title: item.title,
            description: item.description,
            link: item.link,
          }
        })
        watchedState.feeds.push(newFeed)
        watchedState.posts = newPosts.concat(watchedState.posts)
        watchedState.form.status = 'success'
        watchedState.form.url = ''
        watchedState.form.error = null
      })
      .catch((err) => {
        watchedState.form.status = 'failed'
        if (err.name === 'ValidationError') {
          watchedState.form.error = err.message
          return
        }

        if (
          typeof err.message === 'string'
          && err.message.startsWith('errors.')
        ) {
          watchedState.form.error = err.message
          return
        }

        watchedState.form.error = 'errors.network'
      })
  })

  const postsContainer = document.getElementById('posts-container')
  postsContainer.addEventListener('click', (e) => {
    const element = e.target.closest('[data-id]')
    if (!element) {
      return
    }
    const id = element.dataset.id
    if (!watchedState.ui.readPostsIds.includes(id)) {
      watchedState.ui.readPostsIds = [...watchedState.ui.readPostsIds, id]
    }
    watchedState.ui.modalPostId = id
  })

  const addNewPosts = (feed, posts, existingLinks) => {
    const newPosts = posts.filter(post => !existingLinks.has(post.link))
    newPosts.forEach(p => existingLinks.add(p.link))

    const newPostsWithId = newPosts.map(p => ({
      id: crypto.randomUUID(),
      feedId: feed.id,
      title: p.title,
      description: p.description,
      link: p.link,
    }))

    watchedState.posts = newPostsWithId.concat(watchedState.posts)
  }

  const schedulePolling = fn => setTimeout(fn, 5000)

  const pollFeeds = () => {
    const existingLinks = new Set(watchedState.posts.map(p => p.link))

    const requests = watchedState.feeds.map(feed =>
      fetchRss(feed.url)
        .then(({ posts }) => addNewPosts(feed, posts, existingLinks))
        .catch(() => {
          // ignor error
        }),
    )

    return Promise.all(requests).finally(() => schedulePolling(pollFeeds))
  }

  render(watchedState, i18n)
  pollFeeds()
})
