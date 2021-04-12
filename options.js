boolean_buttons = ['hideCount', 'rootExamples']
$(function () {
  $.each(boolean_buttons, function (i, boolean_button) {
    window[boolean_button] = false
    chrome.storage.sync.get([boolean_button], function (data) {
      if (typeof data[boolean_button] != 'undefined') {
        window[boolean_button] = data[boolean_button]
      }
      $('#' + boolean_button).prop('checked', window[boolean_button])
      $('#' + boolean_button).click(function (event) {
        var chrome_key_value = {}
        chrome_key_value[boolean_button] = $('#' + boolean_button).prop(
          'checked'
        )
        chrome.storage.sync.set(chrome_key_value, function () {
          console.log('Saved!', chrome_key_value)
        })
        $('.notice').html('Refresh required!')
      })
    })
  })
  $('#clear-favorites').click(function () {
    if (confirm('Are you sure you want to clear your favorites?')) {
      $('abcdefghijklmnopqrstuvwxyz'.split('')).each(function (index, letter) {
        chrome.storage.sync.remove('fav_root_' + letter)
        chrome.storage.sync.remove('fav_proverb_' + letter)
      })
      $('.notice').html('Favorites cleared!')
    }
  })
  $('#clear-count').click(function () {
    if (
      confirm(
        'Are you sure you want to clear the count of times you have seen each root & proverb?'
      )
    ) {
      $('abcdefghijklmnopqrstuvwxyz'.split('')).each(function (index, letter) {
        chrome.storage.sync.remove('root_' + letter)
        chrome.storage.sync.remove('proverb_' + letter)
      })
      $('.notice').html('Counts cleared!')
    }
  })
})
