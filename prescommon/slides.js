/*
 * Copyright 2013 Google Inc.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */

/*
  Google HTML5 slides template

  Authors: Luke Mahé (code)
           Marcin Wichary (code and design)

           Dominic Mazzoni (browser compatibility)
           Charles Chen (ChromeVox support)

  URL: http://code.google.com/p/html5slides/
  
  Additions: Martin Gorner
  
   --- localization support
   
   To localize your slides, add ?lang=xx to the URL.
   A list of strings needing localization will be displayed.
   If XX is the language in which your slides are
   originally written, then say so by adding a lang attribute
   to the tag <section class="slides" lang="xx"> and the 
   localization warnings will disappear.
   To localize your slides to language xx, add a
   <translation lang="xx"> tag to each <article>.
   The tag should contain translated strings, one per line.
   To leave a string untranslated, use --self--
*/

var PERMANENT_URL_PREFIX = '../prescommon/';

var SLIDE_CLASSES_NB = 5;
var SLIDE_CLASSES = ['far-past', 'past', 'current', 'next', 'far-next'];

var PM_TOUCH_SENSITIVITY = 15;

var curSlide;



/* Slide movement */

function getSlideEl(no) {
  if ((no < 0) || (no >= slideEls.length)) { 
    return null;
  } else {
    return slideEls[no];
  }
};

function updateSlideClass(slideNo, className) {
  var el = getSlideEl(slideNo);
  
  if (!el) {
    return;
  }
  
  if (className) {
    el.classList.add(className);
  }
    
  for (var i=0; i< SLIDE_CLASSES_NB; i++) {
    if (className != SLIDE_CLASSES[i]) {
      el.classList.remove(SLIDE_CLASSES[i]);
    }
  }
};

function updateSlides() {
  for (var i = 0; i < slideEls.length; i++) {
    switch (i) {
      case curSlide - 2:
        updateSlideClass(i, 'far-past');
        break;
      case curSlide - 1:
        updateSlideClass(i, 'past');
        break;
      case curSlide: 
        updateSlideClass(i, 'current');
        break;
      case curSlide + 1:
        updateSlideClass(i, 'next');      
        break;
      case curSlide + 2:
        updateSlideClass(i, 'far-next');      
        break;
      default:
        updateSlideClass(i);
        break;
    }
  }

  triggerLeaveEvent(curSlide - 1);
  triggerEnterEvent(curSlide);

  window.setTimeout(function() {
    // Hide after the slide
    disableSlideFrames(curSlide - 2);
  }, 301);

  enableSlideFrames(curSlide - 1);
  enableSlideFrames(curSlide + 2);
  
  if (isChromeVoxActive()) {
    speakAndSyncToNode(slideEls[curSlide]);
  }  

  updateHash();
};

function buildNextItem() {
  var toBuild  = slideEls[curSlide].querySelectorAll('.to-build');

  if (!toBuild.length) {
    return false;
  }

  toBuild[0].classList.remove('to-build');

  if (isChromeVoxActive()) {
    speakAndSyncToNode(toBuild[0]);
  }

  return true;
};

function prevSlide() {
  if (curSlide > 0) {
    curSlide--;

    updateSlides();
  }
};

function nextSlide() {
  if (buildNextItem()) {
    return;
  }

  if (curSlide < slideEls.length - 1) {
    curSlide++;

    updateSlides();
  }
};

/* Slide events */

function triggerEnterEvent(no) {
  var el = getSlideEl(no);
  if (!el) {
    return;
  }

  var onEnter = el.getAttribute('onslideenter');
  if (onEnter) {
    new Function(onEnter).call(el);
  }

  var evt = document.createEvent('Event');
  evt.initEvent('slideenter', true, true);
  evt.slideNumber = no + 1; // Make it readable

  el.dispatchEvent(evt);
};

function triggerLeaveEvent(no) {
  var el = getSlideEl(no);
  if (!el) {
    return;
  }

  var onLeave = el.getAttribute('onslideleave');
  if (onLeave) {
    new Function(onLeave).call(el);
  }

  var evt = document.createEvent('Event');
  evt.initEvent('slideleave', true, true);
  evt.slideNumber = no + 1; // Make it readable
  
  el.dispatchEvent(evt);
};

/* Touch events */

function handleTouchStart(event) {
  if (event.touches.length == 1) {
    touchDX = 0;
    touchDY = 0;

    touchStartX = event.touches[0].pageX;
    touchStartY = event.touches[0].pageY;

    document.body.addEventListener('touchmove', handleTouchMove, true);
    document.body.addEventListener('touchend', handleTouchEnd, true);
  }
};

function handleTouchMove(event) {
  if (event.touches.length > 1) {
    cancelTouch();
  } else {
    touchDX = event.touches[0].pageX - touchStartX;
    touchDY = event.touches[0].pageY - touchStartY;
  }
};

function handleTouchEnd(event) {
  var dx = Math.abs(touchDX);
  var dy = Math.abs(touchDY);

  if ((dx > PM_TOUCH_SENSITIVITY) && (dy < (dx * 2 / 3))) {
    if (touchDX > 0) {
      prevSlide();
    } else {
      nextSlide();
    }
  }
  
  cancelTouch();
};

function cancelTouch() {
  document.body.removeEventListener('touchmove', handleTouchMove, true);
  document.body.removeEventListener('touchend', handleTouchEnd, true);  
};

/* Preloading frames */

function disableSlideFrames(no) {
  var el = getSlideEl(no);
  if (!el) {
    return;
  }

  var frames = el.getElementsByTagName('iframe');
  for (var i = 0, frame; frame = frames[i]; i++) {
    disableFrame(frame);
  }
};

function enableSlideFrames(no) {
  var el = getSlideEl(no);
  if (!el) {
    return;
  }

  var frames = el.getElementsByTagName('iframe');
  for (var i = 0, frame; frame = frames[i]; i++) {
    enableFrame(frame);
  }
};

function disableFrame(frame) {
  frame.src = 'about:blank';
};

function enableFrame(frame) {
  var src = frame._src;

  if (frame.src != src && src != 'about:blank') {
    frame.src = src;
  }
};

function setupFrames() {
  var frames = document.querySelectorAll('iframe');
  for (var i = 0, frame; frame = frames[i]; i++) {
    frame._src = frame.src;
    disableFrame(frame);
  }
  
  enableSlideFrames(curSlide);
  enableSlideFrames(curSlide + 1);
  enableSlideFrames(curSlide + 2);  
};

function setupInteraction() {
  /* Clicking and tapping */
  
	/*
  var el = document.createElement('div');
  el.className = 'slide-area';
  el.id = 'prev-slide-area';  
  el.addEventListener('click', prevSlide, false);
  document.querySelector('section.slides').appendChild(el);

  var el = document.createElement('div');
  el.className = 'slide-area';
  el.id = 'next-slide-area';  
  el.addEventListener('click', nextSlide, false);
  document.querySelector('section.slides').appendChild(el);  
  */
  /* Swiping */
  
  document.body.addEventListener('touchstart', handleTouchStart, false);
}

/* ChromeVox support */

function isChromeVoxActive() {
  if (typeof(cvox) == 'undefined') {
    return false;
  } else {
    return true;
  }
};

function speakAndSyncToNode(node) {
  if (!isChromeVoxActive()) {
    return;
  }
  
  cvox.ChromeVox.navigationManager.switchToStrategy(
      cvox.ChromeVoxNavigationManager.STRATEGIES.LINEARDOM, 0, true);  
  cvox.ChromeVox.navigationManager.syncToNode(node);
  cvox.ChromeVoxUserCommands.finishNavCommand('');
  var target = node;
  while (target.firstChild) {
    target = target.firstChild;
  }
  cvox.ChromeVox.navigationManager.syncToNode(target);
};

function speakNextItem() {
  if (!isChromeVoxActive()) {
    return;
  }
  
  cvox.ChromeVox.navigationManager.switchToStrategy(
      cvox.ChromeVoxNavigationManager.STRATEGIES.LINEARDOM, 0, true);
  cvox.ChromeVox.navigationManager.next(true);
  if (!cvox.DomUtil.isDescendantOfNode(
      cvox.ChromeVox.navigationManager.getCurrentNode(), slideEls[curSlide])){
    var target = slideEls[curSlide];
    while (target.firstChild) {
      target = target.firstChild;
    }
    cvox.ChromeVox.navigationManager.syncToNode(target);
    cvox.ChromeVox.navigationManager.next(true);
  }
  cvox.ChromeVoxUserCommands.finishNavCommand('');
};

function speakPrevItem() {
  if (!isChromeVoxActive()) {
    return;
  }
  
  cvox.ChromeVox.navigationManager.switchToStrategy(
      cvox.ChromeVoxNavigationManager.STRATEGIES.LINEARDOM, 0, true);
  cvox.ChromeVox.navigationManager.previous(true);
  if (!cvox.DomUtil.isDescendantOfNode(
      cvox.ChromeVox.navigationManager.getCurrentNode(), slideEls[curSlide])){
    var target = slideEls[curSlide];
    while (target.lastChild){
      target = target.lastChild;
    }
    cvox.ChromeVox.navigationManager.syncToNode(target);
    cvox.ChromeVox.navigationManager.previous(true);
  }
  cvox.ChromeVoxUserCommands.finishNavCommand('');
};

/* Hash functions */

function getCurSlideFromHash() {
  var slideNo = parseInt(location.hash.substr(1));

  if (slideNo) {
    curSlide = slideNo - 1;
  } else {
    curSlide = 0;
  }
};

function updateHash() {
  location.hash = curSlide + 1;
};

/* Event listeners */

function handleBodyKeyDown(event) {
  switch (event.keyCode) {
    case 39: // right arrow
    case 13: // Enter
    case 32: // space
    case 34: // PgDn
      nextSlide();
      event.preventDefault();
      break;

    case 37: // left arrow
    //case 8: // Backspace
    case 33: // PgUp
      prevSlide();
      event.preventDefault();
      break;

    case 40: // down arrow
      if (isChromeVoxActive()) {
        speakNextItem();
      } else {
        nextSlide();
      }
      event.preventDefault();
      break;

    case 38: // up arrow
      if (isChromeVoxActive()) {
        speakPrevItem();
      } else {
        prevSlide();
      }
      event.preventDefault();
      break;
  }
};

function addEventListeners() {
  document.addEventListener('keydown', handleBodyKeyDown, false);
  window.addEventListener('popstate', function(e)
		  {
		  	getCurSlideFromHash();
		  	updateSlides();
		  });
};

/* Initialization */

function addPrettify() {
  var els = document.querySelectorAll('pre');
  for (var i = 0, el; el = els[i]; i++) {
    if (!el.classList.contains('noprettyprint')) {
      el.classList.add('prettyprint');
    }
  }
  
  var el = document.createElement('script');
  el.type = 'text/javascript';
  el.src = PERMANENT_URL_PREFIX + 'prettify.js';
  el.onload = function() {
    prettyPrint();
  }
  document.body.appendChild(el);
};

function addFontStyle() {
  var el = document.createElement('link');
  el.rel = 'stylesheet';
  el.type = 'text/css';
  el.href = 'http://fonts.googleapis.com/css?family=' +
            'Open+Sans:regular,semibold,italic,italicsemibold|Droid+Sans+Mono';

  document.body.appendChild(el);
};

function addGeneralStyle() {
  var el = document.createElement('link');
  el.rel = 'stylesheet';
  el.type = 'text/css';
  el.href = PERMANENT_URL_PREFIX + 'styles.css';
  document.body.appendChild(el);
  
  var el = document.createElement('meta');
  el.name = 'viewport';
  el.content = 'width=1100,height=750';
  document.querySelector('head').appendChild(el);
  
  var el = document.createElement('meta');
  el.name = 'apple-mobile-web-app-capable';
  el.content = 'yes';
  document.querySelector('head').appendChild(el);
};

function makeBuildLists() {
  for (var i = curSlide, slide; slide = slideEls[i]; i++) {
      makeBuildList(slide)
  }
};
function makeBuildList(slideElem) {
        var items = slideElem.querySelectorAll('.build > *');
        for (var j = 0, item; item = items[j]; j++) {
            if (item.classList) {
                item.classList.add('to-build');
            }
        }
};

function handleDomLoaded() {
  slideEls = document.querySelectorAll('section.slides > article');

  localizeAllSlides(slideEls, getQueryVariable('lang'));
  addPageNumbers(slideEls);
  
  setupFrames();

  addFontStyle();
  addGeneralStyle();
  addPrettify();
  addEventListeners();

  updateSlides();

  setupInteraction();
  makeBuildLists();

  document.body.classList.add('loaded');
}

/* page numbers */
function addPageNumbers(slides)
{
	for (var slide=1;  slide<slides.length; slide++)
	{
		var articleElement = slides[slide];
		var el = document.createElement('div');
		el.innerHTML = slide+1 +"/"+slides.length;
		el.classList.add("pagenumber");
		articleElement.appendChild(el);
	}
}

/* localization helpers */

function localizeAllSlides(slides, lang)
{
	// if language not specified, assume english
	if (lang === undefined || lang == '')
		lang = 'en';
	lang = lang.toLowerCase();
	
	// get the base language of the slides (english assumed if not specified)
	var slideslang = 'en';
	var topnode = document.querySelector('section.slides');
	if (topnode !== undefined && topnode.getAttribute('lang') !== null && topnode.getAttribute('lang') != '')
		slideslang = topnode.getAttribute('lang');
	slideslang = slideslang.toLowerCase();
	
	// nothing to do if the language is already the correct one
	if (lang == slideslang)
		return;
	
	// otherwise, we need to localize
	var tolocalizeall = '';
	for (var slide=0;  slide<slides.length; slide++)
	{
		var translations = getTranslations(slides[slide], lang);
		var tolocalize = localize(slides[slide], translations);
		var imagestolocalize = localizeImages(slides[slide], slideslang, lang);
		if (tolocalize !== '')
		{
			tolocalizeall += '<div><b>Slide ' + (slide+1) + ' needs localization to lang=\"' + lang + '\"' + ': </b><br/>';
			tolocalizeall += tolocalize;
			tolocalizeall += imagestolocalize;
			tolocalizeall += '</div>';
		}
	}

	// write unlocalized elements to the screen
	var el = document.querySelector('section.slides');
	var nel = document.createElement('div');
	nel.innerHTML = tolocalizeall;
	el.appendChild(nel);
}

function getTranslations(nod, lang)
{
	var selector = "translation[lang|=\"" + lang + "\"]";
	var translations = nod.querySelectorAll(selector)[0];
	if (translations !== undefined)
	{
		var translated =  translations.textContent.split('\n');
		var cleantranslated = new Array;
		for (var i=0,j=0; i<translated.length; i++)
		{
			if ( !isallblanks(translated[i]) )
				cleantranslated[j++] = translated[i];
		}
		var result = new Object;
		result.strings = cleantranslated;
		result.current = 0;
		result.count = function() {return this.strings.length - this.current;};
		return result;
	}
}

function localize(nod, translations, codelevel)
{
	// returns a string vith all non yet localized strings in this node
	var result = '';
	for (var i=0; i<nod.childNodes.length; i++)
	{
		var child = nod.childNodes[i];
		if (child.nodeType === 3 && !isallblanks(child.nodeValue)) // 3 = Node.TEXT_NODE
		{
			if (codelevel === undefined || isNaN(codelevel) || codelevel > 0) // skip code in <pre> tag unless it is marked with any kind of tag
			{
				if (translations !== undefined && translations.count() > 0)
				{ // yes, we have a translation
				  // --self-- stands for "do not translate"
					if (translations.strings[translations.current].indexOf('--self--') == -1)
						child.nodeValue = translations.strings[translations.current++];
					else
						translations.current++;
				}
				else
				{ // no, we do not have a translation
					result += child.nodeValue + '<br/>';
				}
			}
		}
		
		// continue recursion but skip <translation> tags
		if (child.childNodes.length > 0 && child.localName != 'translation')
		{
			var skip = false;
			if (child.localName == 'pre')
				result += localize(child, translations, 0); // codelevel 0 on entering <pre> tag, goes up after that
			else
				result += localize(child, translations, codelevel+1);
		}
	}
	return result;
}

function localizeImages(nod, langin, langout)
{
	// looking for images names like toto_en.gif
	// replacing them with toto_fr.gif
	var result = '';
	var langin_str = '_' + langin + '.';
	var langout_str = '_' + langout + '.';
	var images = nod.querySelectorAll('img');
	for (var i=0; i<images.length; i++)
	{
		images[i].src = images[i].src.replace(langin_str, langout_str);
		if (images[i].src.indexOf(langout_str) > 0)
			result += 'Image localized: ' + images[i].src + '<br/>';
	}
	return result;
}

function isallblanks(string)
{
	if (string === undefined)
		return true;
	for (var i=0; i<string.length; i++)
	{
		if (string.charCodeAt(i) != 32 && // space
			string.charAt(i) != '\t' &&     // tab
			string.charCodeAt(i) != 10 && // CR
			string.charCodeAt(i) != 13 && // LF
			string.charCodeAt(i) != 160)   // No-break space (&nbsp;)
			return false;
	}
	return true;
}

function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++)
    {
        var pair = vars[i].split("=");
        if (pair[0] == variable)
            return unescape(pair[1]);
    }
}

function initialize() {
  getCurSlideFromHash();

  if (window['_DEBUG']) {
    PERMANENT_URL_PREFIX = '../';
  }

  if (window['_DCL']) {
    handleDomLoaded();
  } else {
    document.addEventListener('DOMContentLoaded', handleDomLoaded, false);
  }
}

// If ?debug exists then load the script relative instead of absolute
if (!window['_DEBUG'] && document.location.href.indexOf('?debug') !== -1) {
  document.addEventListener('DOMContentLoaded', function() {
    // Avoid missing the DomContentLoaded event
    window['_DCL'] = true
  }, false);

  window['_DEBUG'] = true;
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = '../slides.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(script, s);

  // Remove this script
  s.parentNode.removeChild(s);
} else {
  initialize();
}
