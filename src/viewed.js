import { log } from './util.js'

export function viewed(currently, name) {
  const key = currently + '_count_' + name[0].toLowerCase()
  log(key)
  chrome.storage.sync.get([key], function (result) {
    let views_hash = {}
    log(result)
    if (result[key] !== undefined) {
      views_hash = JSON.parse(result[key])
    }

    let count = views_hash[name]
    if (count === undefined) {
      count = 1
    } else {
      count++
    }
    $('#count').html(count)
    views_hash[name] = count
    log(views_hash)

    //Now save it
    let new_count = {}
    new_count[key] = JSON.stringify(views_hash)
    chrome.storage.sync.set(new_count)
  })
}
