if (location.href.match(/\.(jpg|jpeg|gif|png)/i)) {
  location.href = 'https://playground.charlesleifer.com/images/add/?url='+location.href;
} else {
  location.href = 'https://playground.charlesleifer.com/bookmarks/add/?url='+location.href+'&title='+encodeURIComponent(document.title);
}
