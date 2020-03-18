boolean_buttons = ['hideCount', 'rootExamples'];
$(function() {
  $.each(boolean_buttons, function(i, boolean_button){
    window[boolean_button] = false;
    chrome.storage.sync.get([boolean_button], function(data) {
      if (typeof(data[boolean_button]) != "undefined") {
        window[boolean_button] = data[boolean_button];
      }
      $('#'+boolean_button).prop('checked', window[boolean_button])
      $('#'+boolean_button).click(function(event) {
        var chrome_key_value = {};
        chrome_key_value[boolean_button] = $('#'+boolean_button).prop('checked');
        chrome.storage.sync.set(chrome_key_value, function() {
          console.log("Saved!", chrome_key_value);
        });
        $('.notice').html("Refresh required!");
      });
    });

  });
});
