/**
 *  Skylar Bolton - skylar.bolton@gmail.com
 *  Josh Bender   - jbendercode@gmail.com
 *  Last Updated  - 2021/04/11
 **/

const latinPhrases = []
const latinRoots = []
let searchingIn = 'Latin'
let currently = 'proverb'
let check = ''
let options = ''
let search
let refresh
let rootsSelect
let phrase
let meaning
let example
let phrasesSelect

const rootStartingLetter = 'abcdefghijlmnopqrstuvx'

import { viewed } from './src/viewed.js'
import { check_favorite, is_favoriting } from './src/favorites.js'
import { getRandomFromArray, fadeIn, log, matchRuleShort } from './src/util.js'

$(function () {
  $(rootStartingLetter.split('')).each(function (index, file_name) {
    $.getJSON('/lib/latin/roots/' + file_name + '.json', function (json) {
      $(json).each(function (layer, value) {
        latinRoots.push(value)
      })
    })
  })
  $.getJSON('/lib/latin_phrases.json', function (json) {
    $(json).each(function (layer, value) {
      latinPhrases.push(value)
    })
    newTab()
  })
  loadClickListeners()
})

function loadClickListeners() {
  $('#exchange-icon').click(function () {
    setSearchingIn(searchingIn == 'Latin' ? 'English' : 'Latin')
    setSearchPlaceholder()
    $('#search-roots-and-proverbs').focus()
  })

  $('#search-icon').click(function () {
    $('#search-icon').hide()
    $('#search-and-exchange').slideDown()
    $('#search-roots-and-proverbs').focus()
  })

  $('#search-roots-and-proverbs').keyup(function () {
    const search_text = $('#search-roots-and-proverbs')
      .val()
      .trim()
      .toLowerCase()
    if (search_text.length > 0) {
      search_for(search_text)
    }
  })
  $('#favorite').click(function () {
    is_favoriting(currently, phrase.html(), !$('#favorite').hasClass('liked'))
  })
}

function search_for(search_text) {
  let result = $.grep(search, function (e) {
    return matchRuleShort(e[check].toLowerCase(), search_text)
  })
  if (result != null) {
    if (result.length > 1) {
      pushResults(result)
    } else if (result.length == 1) {
      result = result[0]
      if (currently == 'root') {
        displayLatinRoot(result)
      } else {
        displayProverb(result)
      }
    } else {
      phrase.html('No search matches')
      meaning.html('use the wildcard (*)')
      example.html('')
    }
  }
}

function pushResults(results) {
  options = []
  $(results).each(function (index, value) {
    if (searchingIn == 'English') {
      if (currently == 'proverb') {
        options.push(
          "<a href='#' class='load-proverb'>" + value.meaning + '</a>'
        )
      } else {
        options.push("<a href='#' class='load-root'>" + value.meaning + '</a>')
      }
    } else {
      if (currently == 'proverb') {
        options.push("<a href='#' class='load-proverb'>" + value.lat + '</a>')
      } else {
        options.push("<a href='#' class='load-root'>" + value.root + '</a>')
      }
    }
  })
  phrase.html(options.join(' | '))
  meaning.html('')
  example.html('')
  if (currently == 'root') {
    loadRootListener()
  } else {
    loadProverbListener()
  }
}

function loadRootListener() {
  $('.load-root').click(function (selected_search) {
    let result
    if (searchingIn == 'Latin') {
      result = $.grep(latinRoots, function (e) {
        return matchRuleShort(e.root, $(selected_search.target).text())
      })[0]
    } else {
      result = $.grep(latinRoots, function (e) {
        return matchRuleShort(e.meaning, $(selected_search.target).text())
      })[0]
    }
    displayLatinRoot(result)
    $('#search-icon').show()
    $('#search-and-exchange').hide()
    $('#search-roots-and-proverbs').val('')
  })
}

function loadProverbListener() {
  $('.load-proverb').click(function (selected_search) {
    let result
    if (searchingIn == 'Latin') {
      result = $.grep(latinPhrases, function (e) {
        return matchRuleShort(e.lat, $(selected_search.target).text())
      })[0]
    } else {
      result = $.grep(latinPhrases, function (e) {
        return matchRuleShort(e.meaning, $(selected_search.target).text())
      })[0]
    }
    displayProverb(result)
    $('#search-icon').show()
    $('#search-and-exchange').hide()
    $('#search-roots-and-proverbs').val('')
  })
}

/**
 * Once a new tab is open initalize
 */
function newTab() {
  // Initialize refresh and footer element
  search = $('#search-roots-and-proverbs')
  refresh = $('#refresh')
  phrase = $('#phrase')
  meaning = $('#meaning')
  example = $('#example')
  rootsSelect = $('#rootsSelect')
  phrasesSelect = $('#phrasesSelect')

  chrome.storage.sync.get('default', function (item) {
    if (item['default'] == 'root') {
      rootsSelect.toggleClass('selected-mode')
      setCurrently('root')
      setSearchPlaceholder()
    } else {
      phrasesSelect.toggleClass('selected-mode')
      setCurrently('proverb')
      setSearchPlaceholder()
    }
    if (hideCount) {
      $('#count').hide()
    }

    fadeIn(refresh)
    refreshDisplay()

    refresh.click(refreshDisplay)
    phrasesSelect.click(function () {
      if (currently != 'proverb') {
        setPhrase()
      }
    })
    rootsSelect.click(function () {
      if (currently != 'root') {
        setRoot()
      }
    })
  })
}

/**
 * Refresh content on page
 */
function refreshDisplay() {
  log('refreshDisplay')
  if (currently == 'root') {
    displayLatinRoot(getRandomFromArray(latinRoots))
  } else {
    displayProverb(getRandomFromArray(latinPhrases))
  }
  fadeIn(meaning)
  fadeIn(example)
}

function setExample(examples) {
  log('setExample')
  const array = examples.split(';')
  let formatted = '<table><tbody>'
  let word_and_use = []
  $(array).each(function (index, value) {
    word_and_use = value.split(' - ')
    formatted +=
      '<tr><td>' +
      word_and_use[0] +
      ':</td><td>' +
      word_and_use[1] +
      '<td></tr>'
  })
  formatted += '</tbody></table>'
  example.html(formatted)
}

function setRoot() {
  log('setRoot')
  setCurrently('root')
  chrome.storage.sync.set({ default: 'root' })
  phrasesSelect.toggleClass('selected-mode')
  rootsSelect.toggleClass('selected-mode')
  refreshDisplay()
}

function setPhrase() {
  log('setPhrase')
  chrome.storage.sync.set({ default: 'phrase' })
  setCurrently('proverb')
  phrasesSelect.toggleClass('selected-mode')
  rootsSelect.toggleClass('selected-mode')
  refreshDisplay()
}

function setSearchingIn(newSearchingIn) {
  searchingIn = newSearchingIn
  updateSearchAndCheck()
}

function setCurrently(newCurrently) {
  currently = newCurrently
  updateSearchAndCheck()
}

function updateSearchAndCheck() {
  if (searchingIn == 'Latin') {
    if (currently == 'root') {
      search = latinRoots
      check = 'root'
    } else {
      search = latinPhrases
      check = 'lat'
    }
  } else {
    check = 'meaning'
    if (currently == 'root') {
      search = latinRoots
    } else {
      search = latinPhrases
    }
  }
}

function setSearchPlaceholder() {
  $('#search-roots-and-proverbs').attr(
    'placeholder',
    'Search in ' + searchingIn
  )
}

function displayLatinRoot(root) {
  log('displayLatinRoot')
  phrase.html(root.root)
  meaning.html(root.meaning)
  if (rootExamples) {
    setExample(root.examples_definitions)
  }
  setSearchPlaceholder()
  viewed(currently, root.root)
  check_favorite(currently, root.root)
}

function displayProverb(proverb) {
  log('displayProverb')
  phrase.html(proverb.lat)
  meaning.html(proverb.meaning)
  example.html('')
  setSearchPlaceholder()
  viewed(currently, proverb.lat)
  check_favorite(currently, proverb.lat)
}
