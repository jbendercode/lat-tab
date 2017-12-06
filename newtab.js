/** Josh Bender - jbendercode@gmail.com
 *  Last Updated: Sept 23rd, 2017
 */

// Latin phrases
const phrases = [];

/**
 * On document loaded
 */
document.addEventListener("DOMContentLoaded", function() {
  $.getJSON("/latin_phrases.json", function(json) {
    console.log(json);
    $(json).each(function(layer, value){
      // console.log(layer);
      // console.log(value);
      phrases.push(value);
      console.log(phrases);
    });
  newTab();
  });
});

/**
 * Once a new tab is open initalize
 */
function newTab() {
  // Initialize refresh and footer element
  var refresh = document.getElementById("refresh");
  var footer = document.getElementById("footer");

  // Fade in footer
  fadeIn(refresh);
  setTimeout(fadeIn, 550, footer);

  // Set content on load
  refreshContent();

  // Set on click listener for refresh button
  var refresh = document.getElementById("refresh");
  refresh.addEventListener("click", refreshContent);
};

/**
 * Refresh content on page
 */
function refreshContent(){
  // Get random phrase
  var latinObj = getRandomFromArray(phrases);

  // Assign DOM objects
  var phrase = document.getElementById('phrase');
  var meaning = document.getElementById('meaning');



  // Set values of inner HTML objects
  phrase.innerHTML = latinObj.lat;
  meaning.innerHTML = latinObj.meaning;

  fadeIn(phrase);
  fadeIn(meaning);
}

/**
 * Get a random item from an array
 * @param {Array} arrayToChooseFrom
 */
function getRandomFromArray(arrayToChooseFrom){
  var randomIndx =  Math.floor(Math.random() * arrayToChooseFrom.length);

  return arrayToChooseFrom[randomIndx];
}

/**
 * Fade in element
 * @param {HTMLElement} element
 */
function fadeIn(element) {
  // Set opacity to zero
  element.style.opacity = 0;

  // Set up inner function for animation
  var tick = function() {
    element.style.opacity = +element.style.opacity + 0.01;


    if (+element.style.opacity < 1) {
      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
    }
  };

  // Animate
  tick();
}

