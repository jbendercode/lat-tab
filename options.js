var rootExamples = true;
$(document).ready(function(){
  chrome.storage.sync.get(['rootExamples'], function(data) {
    if (typeof(data.rootExamples) != "undefined") rootExamples = data.rootExamples;
    $('#rootExamples').prop('checked', rootExamples)
  });
  $('#rootExamples').click(function() {
    rootExamples = $('#rootExamples').prop('checked');
    chrome.storage.sync.set({'rootExamples': rootExamples}, function() {
      console.log("Saved rootExamples");
    });
  });
});
