const parseRss = xmlString => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xmlString, 'application/xml')
  if (doc.querySelector('parsererror') !== null) {
    throw new Error('errors.notRss')
  }
  const rss = doc.querySelector('rss')
  const atom = doc.querySelector('feed')
  if (rss === null && atom === null) {
    throw new Error('errors.notRss')
  }
  const getText = node => (node ? node.textContent.trim() : '')
  if (rss) {
    const titleEl = doc.querySelector('channel > title')
    const titleFeed = getText(titleEl)
    const descriptionEl = doc.querySelector('channel > description')
    const descriptionFeed = getText(descriptionEl)
    const items = doc.querySelectorAll('item')
    const posts = Array.from(items).map(item => {
      return {
        title: getText(item.querySelector('title')),
        link: getText(item.querySelector('link')),
        description: getText(item.querySelector('description')),
      }
    })
    return {
      feed: { title: titleFeed, description: descriptionFeed },
      posts,
    }
  }
}
export default parseRss
