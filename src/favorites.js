import {log} from './util.js'

export function check_favorite(currently, name){
  const key = currently + "_fav_" + name[0].toLowerCase()
  log(key)
  chrome.storage.sync.get([key], function(result) {
    var favs_hash = {};
    if(result[key] !== undefined){
      favs_hash = JSON.parse(result[key])
      log(favs_hash);
      if(favs_hash[name] == 1){
        $("#favorite").toggleClass("liked", true);
        return true;
      }
    }
    $("#favorite").toggleClass("liked", false);
    return false;
  });
}

export function is_favoriting(currently, name, liking){
  const key = currently + "_fav_" + name[0].toLowerCase()

  chrome.storage.sync.get([key], function(result) {
    var favs_hash = {};
    if(result[key] !== undefined){
      favs_hash = JSON.parse(result[key])
    }
    log(favs_hash);
    $("#favorite").toggleClass("liked", liking);
    favs_hash[name] = liking

    //Now save it
    var new_likes  = {}
    new_likes[key] = JSON.stringify(favs_hash);
    chrome.storage.sync.set(new_likes);
  });
}
