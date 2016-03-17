## Improved "new tab" page

This is a simple chrome extension I hacked together which was inspired by an
[awesome post](http://www.reddit.com/r/unixporn/comments/1po1wd/where_work_gets_done/) I saw on reddit (thanks iFargle and -Lubber-).

### Features

* Replace new tab page with "improved" version.
* Loads bookmarks from a Chrome bookmarks folder of your choosing.
* Has customizable "quick search" capabilities.
* Persistent "notepad" using Chrome's storage API.
* Quick jump to URL using mnemonics (i.e. "gi co chro" -> https://github.com/coleifer/chrome-extensions)
* Support for displaying favicons.

### Screenshot

![](http://i.imgur.com/2oexNI1.png)


### Setup & Installation

Navigate to [chrome://extensions/](chrome://extensions/) and click the "Load 
unpacked extension..." button. Navigate to and select this directory. You 
should then see an "Improved new tab page" extension and see the app when
you open a new tab.

This extension will look for a folder named "Favorites" in your bookmarks.
You should create a folder named favorites, for instance under your
"Bookmarks Bar" folder in your bookmarks. Within "Favorites," you can
create additional directories which will become the headings on your
list of pages, and the bookmarks within thos directories will be the
links.
