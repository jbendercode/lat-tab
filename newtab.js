/**
 *  Skylar Bolton - skylar.bolton@gmail.com
 *  Josh Bender   - jbendercode@gmail.com
 *  Last Updated  - 2019/01/12
**/

const proverbs    = [];
const latin_roots = [];
var searching_in  = "Latin";
var currently     = "proverb";
var refresh;
var roots_select;
var footer;
var phrase;
var meaning;
var example;
var phrases_select;
var debug = false;

/**
 * On document loaded
 */
document.addEventListener("DOMContentLoaded", function() {
  $('abcdefghijlmnopqrstuvx'.split("")).each(function(index, file_name){
    $.getJSON("/lib/latin/roots/"+file_name+".json", function(json) {
      $(json).each(function(layer, value){
        latin_roots.push(value);
      });
    });
  });
  $.getJSON("/lib/latin_phrases.json", function(json) {
    $(json).each(function(layer, value){
      proverbs.push(value);
    });
    newTab();
  });
  $('#exchange-icon').click(function(){
    if(searching_in == "Latin"){
      searching_in = "English"
    }else{
      searching_in = "Latin"
    }
    $('#search-roots-and-proverbs').attr("placeholder", "Searching "+currently+"s in "+searching_in);
    $("#search-roots-and-proverbs").focus();
  });
  $('#search-icon').click(function(){
    $('#search-icon').hide();
    $("#search-and-exchange").slideDown();
    $("#search-roots-and-proverbs").focus();
  });
  $('#search-form').on('submit', function(e) { //use on if jQuery 1.7+
    e.preventDefault();
  });
  $('#search-roots-and-proverbs').keyup(function() {
    var search_text  = $('#search-roots-and-proverbs').val().trim().toLowerCase();
    if(search_text .length > 0) {
      search_for(search_text);
    }
  });
});

function search_for(search_text){
  check  = ""
  search = ""
  if(searching_in == "Latin"){
    if(currently == "root"){
      search = latin_roots
      check  = "root"
    }else{
      search = proverbs
      check  = "lat"
    }
  }else{
    check = "meaning"
    if(currently == "root"){
      search = latin_roots
    }else{
      search = proverbs
    }
  }
  var result = $.grep(search, function(e){ return matchRuleShort(e[check].toLowerCase(), search_text); });
  if (result != null){
    if(result.length > 1){
      pushResults(result);
    }else if(result.length == 1){
      result = result[0];
      if(currently == "root"){
        displayLatinRoot(result);
      }else{
        displayProverb(result);
      }
    }else{
      phrase.html("No search matches");
      meaning.html("use the wildcard (*)");
      example.html("");
    }
  }
}

function pushResults(results){
  options = [];
  $(results).each(function(index, value){
    if(searching_in == "English"){
      if(currently == "proverb"){
        options.push("<a href='#' class='load-proverb'>"+value.meaning +"</a>");
      }else{
        options.push("<a href='#' class='load-root'>"+value.meaning +"</a>");
      }
    }else{
      if(currently == "proverb"){
        options.push("<a href='#' class='load-proverb'>"+value.lat +"</a>");
      }else{
        options.push("<a href='#' class='load-root'>"+value.root +"</a>");
      }
    }
  });
  phrase.html(options.join(" | "));
  meaning.html("");
  example.html("");
  if(currently == "root"){
    loadRootListener();
  }else{
    loadProverbListener();
  }
}

function loadRootListener(){
  $('.load-root').click(function(selected_search){
    var result;
    if(searching_in == "Latin"){
      result = $.grep(latin_roots, function(e){ return matchRuleShort(e.root, $(selected_search.target).text())})[0];
    }else{
      result = $.grep(latin_roots, function(e){ return matchRuleShort(e.meaning, $(selected_search.target).text())})[0];
    }
    displayLatinRoot(result);
    $('#search-icon').show();
    $("#search-and-exchange").hide();
    $('#search-roots-and-proverbs').val("");
  });
}

function loadProverbListener(){
  $('.load-proverb').click(function(selected_search){
    var result;
    if(searching_in == "Latin"){
      result = $.grep(proverbs, function(e){ return matchRuleShort(e.lat, $(selected_search.target).text())})[0];
    }else{
      result = $.grep(proverbs, function(e){ return matchRuleShort(e.meaning, $(selected_search.target).text())})[0];
    }
    displayProverb(result);
    $('#search-icon').show();
    $("#search-and-exchange").hide();
    $('#search-roots-and-proverbs').val("");
  });
}

/**
 * Once a new tab is open initalize
 */
function newTab() {
  // Initialize refresh and footer element
  search         = $("#search-roots-and-proverbs");
  refresh        = $("#refresh");
  footer         = $("#footer");
  phrase         = $("#phrase");
  meaning        = $("#meaning");
  example        = $("#example");
  roots_select   = $("#roots_select");
  phrases_select = $("#phrases_select");

  chrome.storage.sync.get("default", function(item) {
    if (item['default'] == "root"){
      roots_select.toggleClass("selected-mode");
      currently = "root";
      $('#search-roots-and-proverbs').attr("placeholder", "Search "+currently+"s in "+searching_in);
    } else {
      phrases_select.toggleClass("selected-mode");
      currently = "proverb";
      $('#search-roots-and-proverbs').attr("placeholder", "Search "+currently+"s in "+searching_in);
    }
    if(hideCount){
      $("#count").hide();
    }

    fadeIn(refresh);
    refreshDisplay();

    refresh.click(refreshDisplay);
    phrases_select.click(function(){
      if (currently != "proverb"){
        setPhrase();
      }
    });
    roots_select.click(function(){
      if (currently != "root"){
        setRoot();
      }
    });
  });
};

/**
 * Refresh content on page
 */
function refreshDisplay(){
  log("refreshDisplay");
  if (currently == "root"){
    displayLatinRoot(getRandomFromArray(latin_roots));
  } else {
    displayProverb(getRandomFromArray(proverbs));
  }
  fadeIn(meaning);
  fadeIn(example);
}

function setExample(examples){
  log("setExample");
  var array = examples.split(";");

  var formatted = "<table><tbody>";
  var word_and_use = [];
  $(array).each(function(index, value){
    word_and_use = value.split(" - ");
    formatted += "<tr><td>"+word_and_use[0]+":</td><td>"+word_and_use[1]+"<td></tr>";
  });
  formatted += "</tbody></table>";

  example.html(formatted);
}

function viewed(name, is_root){
  // TODO store count in JSON for Roots and Proverbs
  // https://developer.chrome.com/extensions/storage#property-local
  key = "";
  if(is_root){
    key = "root_"+name[0]
  }else{
    key = "proverb_"+name[0]
  }

  chrome.storage.sync.get([key], function(result) {
    var views_hash = {};
    if(result[key] !== undefined){
      views_hash = JSON.parse(result[key])
    }

    var count = views_hash[name];
    if(count === undefined){
      count = 1;
    }else{
      count++;
    }
    $("#count").html(count);
    views_hash[name] = count

    //Now save it
    var news_counts  = {}
    news_counts[key] = JSON.stringify(views_hash);
    chrome.storage.sync.set(news_counts);
  });
}

function setRoot(){
  log("setRoot");
  currently = "root";
  chrome.storage.sync.set({"default": "root"});
  phrases_select.toggleClass("selected-mode");
  roots_select.toggleClass("selected-mode");
  refreshDisplay();
}

function setPhrase(){
  log("setPhrase");
  chrome.storage.sync.set({"default": "phrase"});
  currently = "proverb";
  phrases_select.toggleClass("selected-mode");
  roots_select.toggleClass("selected-mode");
  refreshDisplay();
}

function displayLatinRoot(root){
  phrase.html(root.root);
  meaning.html(root.meaning);
  if (rootExamples){
    setExample(root.examples_definitions);
  }
  $('#search-roots-and-proverbs').attr("placeholder", "Search Latin roots");
  viewed(root.root, true)
}

function displayProverb(proverb){
  phrase.html(proverb.lat);
  meaning.html(proverb.meaning);
  example.html("");
  $('#search-roots-and-proverbs').attr("placeholder", "Searching "+currently+"s in "+searching_in);
  viewed(proverb.lat, false)
}

function getRandomFromArray(arrayToChooseFrom){
  var randomIndx =  Math.floor(Math.random() * arrayToChooseFrom.length);
  return arrayToChooseFrom[randomIndx];
}

function fadeIn(element) {
  element.css('opacity', 0);
  element.fadeTo( "slow", .8);
}

function log(objext){
  if(debug){
    console.log(object);
  }
}

//https://stackoverflow.com/questions/26246601/wildcard-string-comparison-in-javascript
function matchRuleShort(str, rule) {
  return new RegExp("^" + rule.replace("*", ".+?") + "$").test(str);
}
