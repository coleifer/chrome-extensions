(function(bookmarkFolder, displayFavicons) {
  function updateClock() {
    Date.getMinutesTwoDigits = function() {
      var retval = now.getMinutes();
      if (retval < 10) return ("0" + retval.toString());
      else return retval.toString();
    }
    Date.getHoursModTwelve = function() {
      var retval = now.getHours();
      retval = retval%12;
      if (retval == 0) retval = 12;
      return retval;
    }
    var now = new Date(),
        time = Date.getHoursModTwelve() + ':' + Date.getMinutesTwoDigits();
    document.getElementById('time').innerHTML = ["", time].join('');
    setTimeout(updateClock, 1000);
  }

  function addSearch(elementId, callback) {
    var elem = document.getElementById(elementId);
    elem.addEventListener('keypress', function(evt) {
      if (evt.keyCode == 13) {
        callback(elem.value);
      }
    });
  }

  function _makeDelayed() {
    var timer = 0;
    return function(callback, ms) {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  }

  function bindNoteHandlers() {
    var elem = document.getElementById('noteText'),
        saveHandler = _makeDelayed();
    function save() {
      chrome.storage.sync.set({'noteText': elem.value});
    }
    // Throttle save so that it only occurs after 1 second without a keypress.
    elem.addEventListener('keypress', function() {
      saveHandler(save, 1000);
    });
    elem.addEventListener('blur', save);
    chrome.storage.sync.get('noteText', function(data) {
      elem.value = data.noteText ? data.noteText : '';
    });
  }

  function searchHistory() {
    // Only look at the past 7 days.
    var cutoff = new Date().getTime() - (1000 * 60 * 60 * 24 * 7),
        elem = document.getElementById('historyText'),
        parts = elem.value.split(' '),
        regex = new RegExp(parts.join('.*[\/\.].*')),
        urls = [];

    // Search for all history.
    chrome.history.search({
      'text': '',
      'maxResults': 500, 
      'startTime': cutoff
    }, function(items) {
      for (var i = 0; i < items.length; i++) {
        if (items[i].url.match(regex)) {
          urls.push([items[i].lastVisit, items[i].url]);
        }
      }
      if (urls.length) {
        elem.value = urls[0][1];
      }
    });
  }

  function bindHistory() {
    var elem = document.getElementById('historyText'),
        searchHandler = _makeDelayed();

    elem.addEventListener('keypress', function(e) {
      if (e.keyCode == 13 && elem.value) {
        window.location.href = elem.value;
      } else if (e.keyCode == 35) {
        e.preventDefault();
        elem.value = '';
      } else {
        searchHandler(searchHistory, 1200);
      }
    });
  }

  function zip() {
    var list_of_lists = arguments[0];
    var argLength = list_of_lists[0].length;
    var zipped = [];
    for (var i = 0; i < argLength; i++) {
      var row = [];
      for (var j = 0; j < list_of_lists.length; j++) {
        row.push(list_of_lists[j][i]);
      }
      zipped.push(row);
    }
    return zipped;
  }

  function getFavicon(url) {
    domainInfo = /https?:\/\/([^\/]+)/.exec(url);
    if (domainInfo) {
      return 'https://plus.google.com/_/favicon?domain=' + domainInfo[1];
    }
  }

  function createRow(bookmarks) {
    var row = document.createElement('tr');
    for (var i = 0, l = bookmarks.length; i < l; i++) {
      var td = document.createElement('td');
      var link = document.createElement('a');
      if (displayFavicons) {
        faviconUrl = getFavicon(bookmarks[i].url);
        if (faviconUrl) {
          var img = document.createElement('img');
          img.src = getFavicon(bookmarks[i].url);
          link.appendChild(img);
          link.appendChild(document.createTextNode(' '));
        }
      }
      link.appendChild(document.createTextNode(bookmarks[i].title));
      link.href = bookmarks[i].url;
      td.appendChild(link);
      row.appendChild(td);
    }
    return row;
  }

  function _processFavorites(favorites) {
    var header = [];
        accum = [];

    for (var i = 0; i < favorites.length; i++) {
      header.push(favorites[i].title);
      accum.push(favorites[i].children);
    }
    _displayFavorites(header, accum);
  }

  function _displayFavorites(header, bookmarks) {
    var table = document.getElementById('bookmarks');
    // Create header row.
    var headerRow = document.createElement('tr');
    for (var i = 0; i < header.length; i++) {
      var th = document.createElement('th');
      th.appendChild(document.createTextNode(header[i]));
      headerRow.appendChild(th);
    }
    table.appendChild(headerRow);

    var zipped = zip(bookmarks);
    for (var i = 0; i < zipped.length; i++) {
      table.appendChild(createRow(zipped[i]));
    }
  }

  function loadBookmarks(folderName) {
    function search(nodes) {
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].title == folderName) {
          _processFavorites(nodes[i].children);
          return;
        } else if (nodes[i].children && nodes[i].children.length > 0) {
            search(nodes[i].children);
        }
      }
    }
    chrome.bookmarks.getTree(function(nodes) { search(nodes); });
  }

  addSearch('search', function(s) {
    window.location.href = 'https://www.google.com/#q=' + s;
  });
  addSearch('subreddit', function(s) {
    window.location.href = 'http://www.reddit.com/r/' + s;
  });
  addSearch('issue', function(s) {
    window.location.href = 'https://github.counsyl.com/dev/website/issues/' + s;
  });
  addSearch('weather', function(s) {
    window.location.href = 'http://www.wunderground.com/cgi-bin/findweather/getForecast?query=' + s;
  });
  addSearch('testp', function(s) {
    window.location.href = 'https://testp-' + s + '.counsyl.com/helpdesk/';
  });
  addSearch('djangome', function(s) {
    window.location.href = 'http://django.me/' + s;
  });

  updateClock();
  bindNoteHandlers();
  bindHistory();
  loadBookmarks(bookmarkFolder);
})('Favorites', false);
