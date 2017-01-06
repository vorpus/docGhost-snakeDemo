/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const DOMNodeCollection = __webpack_require__(1);
	
	let ready = false;
	const functions = [];
	
	function $l (selector) {
	  if (selector instanceof Function) {
	    if (ready) {
	      selector();
	    } else {
	      functions.push(selector);
	    }
	  } else if (selector instanceof HTMLElement) {
	    return new DOMNodeCollection([selector]);
	  } else if (typeof selector === "string") {
	    const nodeList = Array.prototype.slice.call(document.querySelectorAll(selector));
	    return new DOMNodeCollection(nodeList);
	  }
	}
	
	const executeFunctions = function() {
	  ready = true;
	  for (let i = 0; i < functions.length; i++) {
	    functions[i]();
	  }
	};
	
	window.$l = $l;
	document.addEventListener("DOMContentLoaded", executeFunctions);
	
	$l.extend = function () {
	  let args = Array.from(arguments);
	  let newObj = {};
	  for (let i = 0; i < args.length; i++) {
	    for (let attrname in args[i]) { newObj[attrname] = args[i][attrname]; }
	  }
	  return newObj;
	};
	
	$l.ajax = function (options) {
	  let defaultOptions = {
	    dataType: 'json',
	    method: 'GET',
	    success: () => {},
	    error: () => {},
	    url: 'http://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=bcb83c4b54aee8418983c2aff3073b3b'
	  };
	
	  const newObj = this.extend(defaultOptions, options);
	  const xhr = new XMLHttpRequest();
	
	  xhr.open(newObj.method, newObj.url);
	
	  xhr.onload = function () {
	    if (xhr.status === 200) {
	      newObj.success(xhr.response);
	    } else {
	      newObj.error(xhr.response);
	    }
	  };
	
	  xhr.send(newObj);
	};


/***/ },
/* 1 */
/***/ function(module, exports) {

	class DOMNodeCollection {
	  constructor(HTMLElements) {
	    this.elements = HTMLElements;
	  }
	
	  get(el) {
	    return this.elements[el];
	  }
	
	  each(cb) {
	    this.elements.forEach(cb);
	  }
	
	  html(string) {
	    if (string === undefined) {
	      return this.elements[0].innerHTML;
	    } else {
	      this.each( (element) => {
	        element.innerHTML = string;
	      });
	    }
	  }
	
	  empty() {
	    this.each( (element) => {
	      $l(element).html("");
	    });
	  }
	
	  append(elementToAppend) {
	    if (elementToAppend instanceof DOMNodeCollection) {
	      this.each((element) => {
	        for (let j = 0; j < elementToAppend.elements.length; j++) {
	          element.appendChild(elementToAppend.elements[j].cloneNode(true));
	        }
	      });
	    } else if (elementToAppend instanceof HTMLElement) {
	      this.append($l(elementToAppend));
	    } else if (typeof elementToAppend === 'string') {
	      this.each( (element) =>  element.innerHTML += elementToAppend );
	    }
	    return this.elements;
	  }
	
	  attr(key, val) {
	    if (typeof val === 'string') {
	      this.each( (element) => element.setAttribute(key, val) );
	    } else {
	      return this.elements[0].getAttribute(key);
	    }
	  }
	
	  addClass(classToAdd) {
	    this.each( (element) => element.classList.add(classToAdd));
	  }
	
	  removeClass(classToRemove) {
	    this.each( (element) => element.classList.remove(classToRemove));
	  }
	
	  children() {
	    let childNodes = [];
	    this.each( (element) => {
	      const childNodeList = element.children;
	      childNodes = childNodes.concat(Array.from(childNodeList));
	    });
	    return new DOMNodeCollection(childNodes);
	  }
	
	  parent() {
	    let parentNodes = [];
	    this.each( (element) => {
	      parentNodes = parentNodes.concat(element.parentNode);
	    });
	    return new DOMNodeCollection(parentNodes);
	  }
	
	  find(selector) {
	    let found = [];
	    this.each( (element) => {
	      found = found.concat(Array.from(element.querySelectorAll(selector)));
	    });
	    return new DOMNodeCollection(found);
	  }
	
	  remove() {
	    this.each( (element) => {
	      element.parentNode.removeChild(element)
	    });
	  }
	
	  on(handler, cb) {
	    this.each( (element) => {
	      element.addEventListener(handler, cb);
	      const eventKey = `docGhostEvents-${handler}`;
	      if (typeof element[eventKey] === "undefined") {
	        element[eventKey] = [];
	      }
	      element[eventKey].push(cb);
	    });
	  }
	
	  off(handler) {
	    this.each( (element) => {
	      const eventKey = `docGhostEvents-${handler}`;
	      if (element[eventKey]) {
	        element[eventKey].forEach(cb => {
	          element.removeEventListener(handler, cb);
	        });
	      }
	      element[eventKey] = [];
	    });
	  }
	
	}
	
	module.exports = DOMNodeCollection;


/***/ }
/******/ ]);
//# sourceMappingURL=docGhost.js.map