var params = 'url=' + location.href;
if (!location.href.match(/\.(jpg|jpeg|gif|png)/i)) {
  params += '&title='+encodeURIComponent(document.title);
}
location.href = 'https://playground.charlesleifer.com/add-note/?' + params;
