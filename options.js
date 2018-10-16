var hideCount    = false;
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
    $('.notice').html("Refresh required");
  });

  chrome.storage.sync.get(['hideCount'], function(data) {
    console.log("hideCount...");
    if (typeof(data.hideCount) != "undefined") hideCount = data.hideCount;
    $('#hideCount').prop('checked', hideCount)
  });
  $('#hideCount').click(function() {
    hideCount = $('#hideCount').prop('checked');
    chrome.storage.sync.set({'hideCount': hideCount}, function() {
      console.log("Saved hideCount");
    });
    $('.notice').html("Refresh required.");
  });
});
