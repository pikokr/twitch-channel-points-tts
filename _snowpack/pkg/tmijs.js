import { c as createCommonjsModule, g as getDefaultExportFromNamespaceIfNotNamed, a as commonjsGlobal } from './common/_commonjsHelpers-798ad6a7.js';

// native patch for: node-fetch, whatwg-fetch
// ref: https://github.com/tc39/proposal-global
var getGlobal = function () {
  if (typeof self !== 'undefined') { return self; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  throw new Error('unable to locate global object');
};
var global = getGlobal();
var nodeFetch = global.fetch.bind(global);
const Headers = global.Headers;
const Request = global.Request;
const Response = global.Response;

var nodeFetch$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': nodeFetch,
  Headers: Headers,
  Request: Request,
  Response: Response
});

/* SNOWPACK PROCESS POLYFILL (based on https://github.com/calvinmetcalf/node-process-es6) */
function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;
var globalContext;
if (typeof window !== 'undefined') {
    globalContext = window;
} else if (typeof self !== 'undefined') {
    globalContext = self;
} else {
    globalContext = {};
}
if (typeof globalContext.setTimeout === 'function') {
    cachedSetTimeout = setTimeout;
}
if (typeof globalContext.clearTimeout === 'function') {
    cachedClearTimeout = clearTimeout;
}

function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue$1 = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue$1 = currentQueue.concat(queue$1);
    } else {
        queueIndex = -1;
    }
    if (queue$1.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue$1.length;
    while(len) {
        currentQueue = queue$1;
        queue$1 = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue$1.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
function nextTick(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue$1.push(new Item(fun, args));
    if (queue$1.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
}
// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
var title = 'browser';
var platform = 'browser';
var browser = true;
var argv = [];
var version = ''; // empty string to avoid regexp issues
var versions = {};
var release = {};
var config = {};

function noop() {}

var on = noop;
var addListener = noop;
var once = noop;
var off = noop;
var removeListener = noop;
var removeAllListeners = noop;
var emit = noop;

function binding(name) {
    throw new Error('process.binding is not supported');
}

function cwd () { return '/' }
function chdir (dir) {
    throw new Error('process.chdir is not supported');
}function umask() { return 0; }

// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
var performance = globalContext.performance || {};
var performanceNow =
  performance.now        ||
  performance.mozNow     ||
  performance.msNow      ||
  performance.oNow       ||
  performance.webkitNow  ||
  function(){ return (new Date()).getTime() };

// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
function hrtime(previousTimestamp){
  var clocktime = performanceNow.call(performance)*1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor((clocktime%1)*1e9);
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];
    if (nanoseconds<0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  return [seconds,nanoseconds]
}

var startTime = new Date();
function uptime() {
  var currentTime = new Date();
  var dif = currentTime - startTime;
  return dif / 1000;
}

var process = {
  nextTick: nextTick,
  title: title,
  browser: browser,
  env: {"NODE_ENV":"production"},
  argv: argv,
  version: version,
  versions: versions,
  on: on,
  addListener: addListener,
  once: once,
  off: off,
  removeListener: removeListener,
  removeAllListeners: removeAllListeners,
  emit: emit,
  binding: binding,
  cwd: cwd,
  chdir: chdir,
  umask: umask,
  hrtime: hrtime,
  platform: platform,
  release: release,
  config: config,
  uptime: uptime
};

var utils = createCommonjsModule(function (module) {
var actionMessageRegex = /^\u0001ACTION ([^\u0001]+)\u0001$/;
var justinFanRegex = /^(justinfan)(\d+$)/;
var unescapeIRCRegex = /\\([sn:r\\])/g;
var escapeIRCRegex = /([ \n;\r\\])/g;
var ircEscapedChars = { s: ' ', n: '', ':': ';', r: '' };
var ircUnescapedChars = { ' ': 's', '\n': 'n', ';': ':', '\r': 'r' };
var self = module.exports = {
	// Return the second value if the first value is undefined..
	get: (obj1, obj2) => typeof obj1 === "undefined" ? obj2 : obj1,

	// Value is a boolean..
	isBoolean: obj => typeof obj === "boolean",

	// Value is a finite number..
	isFinite: int => isFinite(int) && !isNaN(parseFloat(int)),

	// Value is an integer..
	isInteger: int => !isNaN(self.toNumber(int, 0)),

	// Username is a justinfan username..
	isJustinfan: username => justinFanRegex.test(username),

	// Value is null..
	isNull: obj => obj === null,

	// Value is a regex..
	isRegex: str => /[\|\\\^\$\*\+\?\:\#]/.test(str),

	// Value is a string..
	isString: str => typeof(str) === "string",

	// Value is a valid url..
	isURL: str => new RegExp("^(?:(?:https?|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))\\.?)(?::\\d{2,5})?(?:[/?#]\\S*)?$","i").test(str),

	// Return a random justinfan username..
	justinfan: () => `justinfan${Math.floor((Math.random() * 80000) + 1000)}`,

	// Return a valid token..
	token: str => str ? str.toLowerCase().replace("oauth:", "") : "",

	// Return a valid password..
	password: str => {
		const token = self.token(str);
		return token ? `oauth:${token}` : '';
	},

	// Race a promise against a delay..
	promiseDelay: time => new Promise(resolve => setTimeout(resolve, time)),

	// Replace all occurences of a string using an object..
	replaceAll: (str, obj) => {
		if(str === null || typeof str === "undefined") {
			return null;
		}
		for (var x in obj) {
			str = str.replace(new RegExp(x, "g"), obj[x]);
		}
		return str;
	},

	unescapeHtml: safe =>
		safe.replace(/\\&amp\\;/g, "&")
			.replace(/\\&lt\\;/g, "<")
			.replace(/\\&gt\\;/g, ">")
			.replace(/\\&quot\\;/g, "\"")
			.replace(/\\&#039\\;/g, "'"),

	// Escaping values:
	// http://ircv3.net/specs/core/message-tags-3.2.html#escaping-values
	unescapeIRC: msg => !msg || !msg.includes('\\') ?
		msg :
		msg.replace(
			unescapeIRCRegex,
			(m, p) => p in ircEscapedChars ? ircEscapedChars[p] : p
		),
	
	escapeIRC: msg => !msg ? msg :
		msg.replace(
			escapeIRCRegex,
			(m, p) => p in ircUnescapedChars ? `\\${ircUnescapedChars[p]}` : p
		),

	actionMessage: msg => msg.match(actionMessageRegex),

	// Add word to a string..
	addWord: (line, word) => line.length ? line + " " + word : line + word,

	// Return a valid channel name..
	channel: str => {
		var channel = (str ? str : "").toLowerCase();
		return channel[0] === "#" ? channel : "#" + channel;
	},

	// Extract a number from a string..
	extractNumber: str => {
		var parts = str.split(" ");
		for (var i = 0; i < parts.length; i++) {
			if(self.isInteger(parts[i])) {
				return ~~parts[i];
			}
		}
		return 0;
	},

	// Format the date..
	formatDate: date => {
		var hours = date.getHours();
		var mins  = date.getMinutes();

		hours = (hours < 10 ? "0" : "") + hours;
		mins = (mins < 10 ? "0" : "") + mins;

		return `${hours}:${mins}`;
	},

	// Inherit the prototype methods from one constructor into another..
	inherits: (ctor, superCtor) => {
		ctor.super_ = superCtor;
		var TempCtor = function () {};
		TempCtor.prototype = superCtor.prototype;
		ctor.prototype = new TempCtor();
		ctor.prototype.constructor = ctor;
	},

	// Return whether inside a Node application or not..
	isNode: () => {
		try {
			return "object" === typeof process &&
				Object.prototype.toString.call(process) === "[object process]";
		} catch(e) {}
		return false;
	},

	// Merge two objects..
	merge: Object.assign,

	// Split a line but try not to cut a word in half..
	splitLine: (input, length) => {
		var lastSpace = input.substring(0, length).lastIndexOf(" ");
		// No spaces found, split at the very end to avoid a loop..
		if(lastSpace === -1) {
			lastSpace = length - 1;
		}
		return [input.substring(0, lastSpace), input.substring(lastSpace + 1)];
	},

	// Parse string to number. Returns NaN if string can't be parsed to number..
	toNumber: (num, precision) => {
		if(num === null) {
			return 0;
		}
		var factor = Math.pow(10, self.isFinite(precision) ? precision : 0);
		return Math.round(num * factor) / factor;
	},

	// Merge two arrays..
	union: (a, b) => [ ...new Set([ ...a, ...b ]) ],

	// Return a valid username..
	username: str => {
		var username = (str ? str : "").toLowerCase();
		return username[0] === "#" ? username.slice(1) : username;
	}
};
});

var fetch = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(nodeFetch$1);

var api = function api(options, callback) {
	// Set the url to options.uri or options.url..
	var url = options.url !== undefined ? options.url : options.uri;

	// Make sure it is a valid url..
	if(!utils.isURL(url)) {
		url = `https://api.twitch.tv/kraken${url[0] === "/" ? url : `/${url}`}`;
	}

	// We are inside a Node application, so we can use the node-fetch module..
	if(utils.isNode()) {
		var opts = utils.merge({ method: "GET", json: true }, options, { url });
		var url = opts.url;
		if(opts.qs) {
			var qs = new URLSearchParams(opts.qs);
			url += `?${qs}`;
		}
		var response = {};
		/** @type {ReturnType<import('node-fetch')['default']>} */
		const fetchPromise = fetch(url, {
			method: opts.method,
			headers: opts.headers,
			body: opts.body
		});
		fetchPromise.then(res => {
			response = { statusCode: res.status, headers: res.headers };
			return opts.json ? res.json() : res.text();
		})
		.then(
			data => callback(null, response, data),
			err => callback(err, response, null)
		);
	}
	// Web application, extension, React Native etc.
	else {
		var opts = utils.merge({ method: "GET", headers: {} }, options, { url });
		// prepare request
		var xhr = new XMLHttpRequest();
		xhr.open(opts.method, opts.url, true);
		for(var name in opts.headers) {
			xhr.setRequestHeader(name, opts.headers[name]);
		}
		xhr.responseType = "json";
		// set request handler
		xhr.addEventListener("load", ev => {
			if(xhr.readyState == 4) {
				if(xhr.status != 200) {
					callback(xhr.status, null, null);
				}
				else {
					callback(null, null, xhr.response);
				}
			}
		});
		// submit
		xhr.send();
	}
};

var api_1 = api;

// Enable followers-only mode on a channel..
function followersonly(channel, minutes) {
	channel = utils.channel(channel);
	minutes = utils.get(minutes, 30);

	// Send the command to the server and race the Promise against a delay..
	return this._sendCommand(this._getPromiseDelay(), channel, `/followers ${minutes}`, (resolve, reject) => {
		// Received _promiseFollowers event, resolve or reject..
		this.once("_promiseFollowers", err => {
			if(!err) { resolve([channel, ~~minutes]); }
			else { reject(err); }
		});
	});
}

// Disable followers-only mode on a channel..
function followersonlyoff(channel) {
	channel = utils.channel(channel);

	// Send the command to the server and race the Promise against a delay..
	return this._sendCommand(this._getPromiseDelay(), channel, "/followersoff", (resolve, reject) => {
		// Received _promiseFollowersoff event, resolve or reject..
		this.once("_promiseFollowersoff", err => {
			if(!err) { resolve([channel]); }
			else { reject(err); }
		});
	});
}

// Leave a channel..
function part(channel) {
	channel = utils.channel(channel);

	// Send the command to the server and race the Promise against a delay..
	return this._sendCommand(this._getPromiseDelay(), null, `PART ${channel}`, (resolve, reject) => {
		// Received _promisePart event, resolve or reject..
		this.once("_promisePart", err => {
			if(!err) { resolve([channel]); }
			else { reject(err); }
		});
	});
}

// Enable R9KBeta mode on a channel..
function r9kbeta(channel) {
	channel = utils.channel(channel);

	// Send the command to the server and race the Promise against a delay..
	return this._sendCommand(this._getPromiseDelay(), channel, "/r9kbeta", (resolve, reject) => {
		// Received _promiseR9kbeta event, resolve or reject..
		this.once("_promiseR9kbeta", err => {
			if(!err) { resolve([channel]); }
			else { reject(err); }
		});
	});
}

// Disable R9KBeta mode on a channel..
function r9kbetaoff(channel) {
	channel = utils.channel(channel);

	// Send the command to the server and race the Promise against a delay..
	return this._sendCommand(this._getPromiseDelay(), channel, "/r9kbetaoff", (resolve, reject) => {
		// Received _promiseR9kbetaoff event, resolve or reject..
		this.once("_promiseR9kbetaoff", err => {
			if(!err) { resolve([channel]); }
			else { reject(err); }
		});
	});
}

// Enable slow mode on a channel..
function slow(channel, seconds) {
	channel = utils.channel(channel);
	seconds = utils.get(seconds, 300);

	// Send the command to the server and race the Promise against a delay..
	return this._sendCommand(this._getPromiseDelay(), channel, `/slow ${seconds}`, (resolve, reject) => {
		// Received _promiseSlow event, resolve or reject..
		this.once("_promiseSlow", err => {
			if(!err) { resolve([channel, ~~seconds]); }
			else { reject(err); }
		});
	});
}

// Disable slow mode on a channel..
function slowoff(channel) {
	channel = utils.channel(channel);

	// Send the command to the server and race the Promise against a delay..
	return this._sendCommand(this._getPromiseDelay(), channel, "/slowoff", (resolve, reject) => {
		// Received _promiseSlowoff event, resolve or reject..
		this.once("_promiseSlowoff", err => {
			if(!err) { resolve([channel]); }
			else { reject(err); }
		});
	});
}

var commands = {
	// Send action message (/me <message>) on a channel..
	action(channel, message) {
		channel = utils.channel(channel);
		message = `\u0001ACTION ${message}\u0001`;

		// Send the command to the server and race the Promise against a delay..
		return this._sendMessage(this._getPromiseDelay(), channel, message, (resolve, reject) => {
			// At this time, there is no possible way to detect if a message has been sent has been eaten
			// by the server, so we can only resolve the Promise.
			resolve([channel, message]);
		});
	},

	// Ban username on channel..
	ban(channel, username, reason) {
		channel = utils.channel(channel);
		username = utils.username(username);
		reason = utils.get(reason, "");

		// Send the command to the server and race the Promise against a delay..
		return this._sendCommand(this._getPromiseDelay(), channel, `/ban ${username} ${reason}`, (resolve, reject) => {
			// Received _promiseBan event, resolve or reject..
			this.once("_promiseBan", err => {
				if(!err) { resolve([channel, username, reason]); }
				else { reject(err); }
			});
		});
	},

	// Clear all messages on a channel..
	clear(channel) {
		channel = utils.channel(channel);

		// Send the command to the server and race the Promise against a delay..
		return this._sendCommand(this._getPromiseDelay(), channel, "/clear", (resolve, reject) => {
			// Received _promiseClear event, resolve or reject..
			this.once("_promiseClear", err => {
				if(!err) { resolve([channel]); }
				else { reject(err); }
			});
		});
	},

	// Change the color of your username..
	color(channel, newColor) {
		newColor = utils.get(newColor, channel);

		// Send the command to the server and race the Promise against a delay..
		return this._sendCommand(this._getPromiseDelay(), "#tmijs", `/color ${newColor}`, (resolve, reject) => {
			// Received _promiseColor event, resolve or reject..
			this.once("_promiseColor", err => {
				if(!err) { resolve([newColor]); }
				else { reject(err); }
			});
		});
	},

	// Run commercial on a channel for X seconds..
	commercial(channel, seconds) {
		channel = utils.channel(channel);
		seconds = utils.get(seconds, 30);

		// Send the command to the server and race the Promise against a delay..
		return this._sendCommand(this._getPromiseDelay(), channel, `/commercial ${seconds}`, (resolve, reject) => {
			// Received _promiseCommercial event, resolve or reject..
			this.once("_promiseCommercial", err => {
				if(!err) { resolve([channel, ~~seconds]); }
				else { reject(err); }
			});
		});
	},
	
	// Delete a specific message on a channel
	deletemessage(channel, messageUUID) {
		channel = utils.channel(channel);

		// Send the command to the server and race the Promise against a delay..
		return this._sendCommand(this._getPromiseDelay(), channel, `/delete ${messageUUID}`, (resolve, reject) => {
			// Received _promiseDeletemessage event, resolve or reject..
			this.once("_promiseDeletemessage", err => {
				if(!err) { resolve([channel]); }
				else { reject(err); }
			});
		});
	},

	// Enable emote-only mode on a channel..
	emoteonly(channel) {
		channel = utils.channel(channel);

		// Send the command to the server and race the Promise against a delay..
		return this._sendCommand(this._getPromiseDelay(), channel, "/emoteonly", (resolve, reject) => {
			// Received _promiseEmoteonly event, resolve or reject..
			this.once("_promiseEmoteonly", err => {
				if(!err) { resolve([channel]); }
				else { reject(err); }
			});
		});
	},

	// Disable emote-only mode on a channel..
	emoteonlyoff(channel) {
		channel = utils.channel(channel);

		// Send the command to the server and race the Promise against a delay..
		return this._sendCommand(this._getPromiseDelay(), channel, "/emoteonlyoff", (resolve, reject) => {
			// Received _promiseEmoteonlyoff event, resolve or reject..
			this.once("_promiseEmoteonlyoff", err => {
				if(!err) { resolve([channel]); }
				else { reject(err); }
			});
		});
	},

	// Enable followers-only mode on a channel..
	followersonly: followersonly,

	// Alias for followersonly()..
	followersmode: followersonly,

	// Disable followers-only mode on a channel..
	followersonlyoff: followersonlyoff,

	// Alias for followersonlyoff()..
	followersmodeoff: followersonlyoff,

	// Host a channel..
	host(channel, target) {
		channel = utils.channel(channel);
		target = utils.username(target);

		// Send the command to the server and race the Promise against a delay..
		return this._sendCommand(2000, channel, `/host ${target}`, (resolve, reject) => {
			// Received _promiseHost event, resolve or reject..
			this.once("_promiseHost", (err, remaining) => {
				if(!err) { resolve([channel, target, ~~remaining]); }
				else { reject(err); }
			});
		});
	},

	// Join a channel..
	join(channel) {
		channel = utils.channel(channel);

		// Send the command to the server ..
		return this._sendCommand(null, null, `JOIN ${channel}`, (resolve, reject) => {
			var eventName = "_promiseJoin";
			var hasFulfilled = false;
			var listener = (err, joinedChannel) => {
				if(channel === utils.channel(joinedChannel)) {
					// Received _promiseJoin event for the target channel, resolve or reject..
					this.removeListener(eventName, listener);
					hasFulfilled = true;
					if(!err) { resolve([channel]); }
					else { reject(err); }
				}
			};
			this.on(eventName, listener);
			// Race the Promise against a delay..
			var delay = this._getPromiseDelay();
			utils.promiseDelay(delay).then(() => {
				if(!hasFulfilled) {
					this.emit(eventName, "No response from Twitch.", channel);
				}
			});
		});
	},

	// Mod username on channel..
	mod(channel, username) {
		channel = utils.channel(channel);
		username = utils.username(username);

		// Send the command to the server and race the Promise against a delay..
		return this._sendCommand(this._getPromiseDelay(), channel, `/mod ${username}`, (resolve, reject) => {
			// Received _promiseMod event, resolve or reject..
			this.once("_promiseMod", err => {
				if(!err) { resolve([channel, username]); }
				else { reject(err); }
			});
		});
	},

	// Get list of mods on a channel..
	mods(channel) {
		channel = utils.channel(channel);

		// Send the command to the server and race the Promise against a delay..
		return this._sendCommand(this._getPromiseDelay(), channel, "/mods", (resolve, reject) => {
			// Received _promiseMods event, resolve or reject..
			this.once("_promiseMods", (err, mods) => {
				if(!err) {
					// Update the internal list of moderators..
					mods.forEach(username => {
						if(!this.moderators[channel]) { this.moderators[channel] = []; }
						if(!this.moderators[channel].includes(username)) { this.moderators[channel].push(username); }
					});
					resolve(mods);
				}
				else { reject(err); }
			});
		});
	},

	// Leave a channel..
	part: part,

	// Alias for part()..
	leave: part,

	// Send a ping to the server..
	ping() {
		// Send the command to the server and race the Promise against a delay..
		return this._sendCommand(this._getPromiseDelay(), null, "PING", (resolve, reject) => {
			// Update the internal ping timeout check interval..
			this.latency = new Date();
			this.pingTimeout = setTimeout(() => {
				if(this.ws !== null) {
					this.wasCloseCalled = false;
					this.log.error("Ping timeout.");
					this.ws.close();

					clearInterval(this.pingLoop);
					clearTimeout(this.pingTimeout);
				}
			}, utils.get(this.opts.connection.timeout, 9999));

			// Received _promisePing event, resolve or reject..
			this.once("_promisePing", latency => resolve([parseFloat(latency)]));
		});
	},

	// Enable R9KBeta mode on a channel..
	r9kbeta: r9kbeta,

	// Alias for r9kbeta()..
	r9kmode: r9kbeta,

	// Disable R9KBeta mode on a channel..
	r9kbetaoff: r9kbetaoff,

	// Alias for r9kbetaoff()..
	r9kmodeoff: r9kbetaoff,

	// Send a raw message to the server..
	raw(message) {
		// Send the command to the server and race the Promise against a delay..
		return this._sendCommand(this._getPromiseDelay(), null, message, (resolve, reject) => {
			resolve([message]);
		});
	},

	// Send a message on a channel..
	say(channel, message) {
		channel = utils.channel(channel);

		if((message.startsWith(".") && !message.startsWith("..")) || message.startsWith("/") || message.startsWith("\\")) {
			// Check if the message is an action message..
			if(message.substr(1, 3) === "me ") {
				return this.action(channel, message.substr(4));
			}
			else {
				// Send the command to the server and race the Promise against a delay..
				return this._sendCommand(this._getPromiseDelay(), channel, message, (resolve, reject) => {
					// At this time, there is no possible way to detect if a message has been sent has been eaten
					// by the server, so we can only resolve the Promise.
					resolve([channel, message]);
				});
			}
		}

		// Send the command to the server and race the Promise against a delay..
		return this._sendMessage(this._getPromiseDelay(), channel, message, (resolve, reject) => {
			// At this time, there is no possible way to detect if a message has been sent has been eaten
			// by the server, so we can only resolve the Promise.
			resolve([channel, message]);
		});
	},

	// Enable slow mode on a channel..
	slow: slow,

	// Alias for slow()..
	slowmode: slow,

	// Disable slow mode on a channel..
	slowoff: slowoff,

	// Alias for slowoff()..
	slowmodeoff: slowoff,

	// Enable subscribers mode on a channel..
	subscribers(channel) {
		channel = utils.channel(channel);

		// Send the command to the server and race the Promise against a delay..
		return this._sendCommand(this._getPromiseDelay(), channel, "/subscribers", (resolve, reject) => {
			// Received _promiseSubscribers event, resolve or reject..
			this.once("_promiseSubscribers", err => {
				if(!err) { resolve([channel]); }
				else { reject(err); }
			});
		});
	},

	// Disable subscribers mode on a channel..
	subscribersoff(channel) {
		channel = utils.channel(channel);

		// Send the command to the server and race the Promise against a delay..
		return this._sendCommand(this._getPromiseDelay(), channel, "/subscribersoff", (resolve, reject) => {
			// Received _promiseSubscribersoff event, resolve or reject..
			this.once("_promiseSubscribersoff", err => {
				if(!err) { resolve([channel]); }
				else { reject(err); }
			});
		});
	},

	// Timeout username on channel for X seconds..
	timeout(channel, username, seconds, reason) {
		channel = utils.channel(channel);
		username = utils.username(username);

		if(!utils.isNull(seconds) && !utils.isInteger(seconds)) {
			reason = seconds;
			seconds = 300;
		}

		seconds = utils.get(seconds, 300);
		reason = utils.get(reason, "");

		// Send the command to the server and race the Promise against a delay..
		return this._sendCommand(this._getPromiseDelay(), channel, `/timeout ${username} ${seconds} ${reason}`, (resolve, reject) => {
			// Received _promiseTimeout event, resolve or reject..
			this.once("_promiseTimeout", err => {
				if(!err) { resolve([channel, username, ~~seconds, reason]); }
				else { reject(err); }
			});
		});
	},

	// Unban username on channel..
	unban(channel, username) {
		channel = utils.channel(channel);
		username = utils.username(username);

		// Send the command to the server and race the Promise against a delay..
		return this._sendCommand(this._getPromiseDelay(), channel, `/unban ${username}`, (resolve, reject) => {
			// Received _promiseUnban event, resolve or reject..
			this.once("_promiseUnban", err => {
				if(!err) { resolve([channel, username]); }
				else { reject(err); }
			});
		});
	},

	// End the current hosting..
	unhost(channel) {
		channel = utils.channel(channel);

		// Send the command to the server and race the Promise against a delay..
		return this._sendCommand(2000, channel, "/unhost", (resolve, reject) => {
			// Received _promiseUnhost event, resolve or reject..
			this.once("_promiseUnhost", err => {
				if(!err) { resolve([channel]); }
				else { reject(err); }
			});
		});
	},

	// Unmod username on channel..
	unmod(channel, username) {
		channel = utils.channel(channel);
		username = utils.username(username);

		// Send the command to the server and race the Promise against a delay..
		return this._sendCommand(this._getPromiseDelay(), channel, `/unmod ${username}`, (resolve, reject) => {
			// Received _promiseUnmod event, resolve or reject..
			this.once("_promiseUnmod", err => {
				if(!err) { resolve([channel, username]); }
				else { reject(err); }
			});
		});
	},

	// Unvip username on channel..
	unvip(channel, username) {
		channel = utils.channel(channel);
		username = utils.username(username);

		// Send the command to the server and race the Promise against a delay..
		return this._sendCommand(this._getPromiseDelay(), channel, `/unvip ${username}`, (resolve, reject) => {
			// Received _promiseUnvip event, resolve or reject..
			this.once("_promiseUnvip", err => {
				if(!err) { resolve([channel, username]); }
				else { reject(err); }
			});
		});
	},

	// Add username to VIP list on channel..
	vip(channel, username) {
		channel = utils.channel(channel);
		username = utils.username(username);

		// Send the command to the server and race the Promise against a delay..
		return this._sendCommand(this._getPromiseDelay(), channel, `/vip ${username}`, (resolve, reject) => {
			// Received _promiseVip event, resolve or reject..
			this.once("_promiseVip", err => {
				if(!err) { resolve([channel, username]); }
				else { reject(err); }
			});
		});
	},

	// Get list of VIPs on a channel..
	vips(channel) {
		channel = utils.channel(channel);

		// Send the command to the server and race the Promise against a delay..
		return this._sendCommand(this._getPromiseDelay(), channel, "/vips", (resolve, reject) => {
			// Received _promiseVips event, resolve or reject..
			this.once("_promiseVips", (err, vips) => {
				if(!err) { resolve(vips); }
				else { reject(err); }
			});
		});
	},

	// Send an whisper message to a user..
	whisper(username, message) {
		username = utils.username(username);

		// The server will not send a whisper to the account that sent it.
		if(username === this.getUsername()) {
			return Promise.reject("Cannot send a whisper to the same account.");
		}

		// Send the command to the server and race the Promise against a delay..
		return this._sendCommand(this._getPromiseDelay(), "#tmijs", `/w ${username} ${message}`, (resolve, reject) => {
			this.once("_promiseWhisper", (err) => {
				if (err) { reject(err); }
			});
		}).catch((err) => {
			// Either an "actual" error occured or the timeout triggered
			// the latter means no errors have occured and we can resolve
			// else just elevate the error
			if(err && typeof err === 'string' && err.indexOf("No response from Twitch.") !== 0) {
				throw err;
			}
			var from = utils.channel(username),
				userstate = utils.merge({
						"message-type": "whisper",
						"message-id": null,
						"thread-id": null,
						username: this.getUsername()
					}, this.globaluserstate);

			// Emit for both, whisper and message..
			this.emits(["whisper", "message"], [
				[from, userstate, message, true],
				[from, userstate, message, true]
			]);
			return [username, message];
		});
	}
};

/*
 * Copyright Joyent, Inc. and other Node contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to permit
 * persons to whom the Software is furnished to do so, subject to the
 * following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
 * NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
 * USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

function EventEmitter() {
	this._events = this._events || {};
	this._maxListeners = this._maxListeners || undefined;
}

var events = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
	if (!isNumber(n) || n < 0 || isNaN(n)) {
		throw TypeError("n must be a positive number");
	}

	this._maxListeners = n;

	return this;
};

EventEmitter.prototype.emit = function(type) {
	var er, handler, len, args, i, listeners;

	if (!this._events) { this._events = {}; }

	// If there is no 'error' event listener then throw.
	if (type === "error") {
		if (!this._events.error || (isObject(this._events.error) && !this._events.error.length)) {
			er = arguments[1];
			if (er instanceof Error) { throw er; }
			throw TypeError("Uncaught, unspecified \"error\" event.");
		}
	}

	handler = this._events[type];

	if (isUndefined(handler)) { return false; }

	if (isFunction(handler)) {
		switch (arguments.length) {
			// fast cases
			case 1:
				handler.call(this);
				break;
			case 2:
				handler.call(this, arguments[1]);
				break;
			case 3:
				handler.call(this, arguments[1], arguments[2]);
				break;
				// slower
			default:
				args = Array.prototype.slice.call(arguments, 1);
				handler.apply(this, args);
		}
	} else if (isObject(handler)) {
		args = Array.prototype.slice.call(arguments, 1);
		listeners = handler.slice();
		len = listeners.length;
		for (i = 0; i < len; i++) { listeners[i].apply(this, args); }
	}

	return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
	var m;

	if (!isFunction(listener)) { throw TypeError("listener must be a function"); }

	if (!this._events) { this._events = {}; }

	// To avoid recursion in the case that type === "newListener"! Before
	// adding it to the listeners, first emit "newListener".
	if (this._events.newListener) {
		this.emit("newListener", type, isFunction(listener.listener) ? listener.listener : listener);
	}

	// Optimize the case of one listener. Don't need the extra array object.
	if (!this._events[type]) { this._events[type] = listener; }
	// If we've already got an array, just append.
	else if (isObject(this._events[type])) { this._events[type].push(listener); }
	// Adding the second element, need to change to array.
	else { this._events[type] = [this._events[type], listener]; }

	// Check for listener leak
	if (isObject(this._events[type]) && !this._events[type].warned) {
		if (!isUndefined(this._maxListeners)) {
			m = this._maxListeners;
		} else {
			m = EventEmitter.defaultMaxListeners;
		}

		if (m && m > 0 && this._events[type].length > m) {
			this._events[type].warned = true;
			console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[type].length);
			// Not supported in IE 10
			if (typeof console.trace === "function") {
				console.trace();
			}
		}
	}

	return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

// Modified to support multiple calls..
EventEmitter.prototype.once = function(type, listener) {
	if (!isFunction(listener)) { throw TypeError("listener must be a function"); }

	var fired = false;

	if (this._events.hasOwnProperty(type) && type.charAt(0) === "_") {
		var count = 1;
		var searchFor = type;

		for (var k in this._events){
			if (this._events.hasOwnProperty(k) && k.startsWith(searchFor)) {
				count++;
			}
		}
		type = type + count;
	}

	function g() {
		if (type.charAt(0) === "_" && !isNaN(type.substr(type.length - 1))) {
			type = type.substring(0, type.length - 1);
		}
		this.removeListener(type, g);

		if (!fired) {
			fired = true;
			listener.apply(this, arguments);
		}
	}

	g.listener = listener;
	this.on(type, g);

	return this;
};

// Emits a "removeListener" event if the listener was removed..
// Modified to support multiple calls from .once()..
EventEmitter.prototype.removeListener = function(type, listener) {
	var list, position, length, i;

	if (!isFunction(listener)) { throw TypeError("listener must be a function"); }

	if (!this._events || !this._events[type]) { return this; }

	list = this._events[type];
	length = list.length;
	position = -1;
	if (list === listener || (isFunction(list.listener) && list.listener === listener)) {
		delete this._events[type];

		if (this._events.hasOwnProperty(type + "2") && type.charAt(0) === "_") {
			var searchFor = type;
			for (var k in this._events){
				if (this._events.hasOwnProperty(k) && k.startsWith(searchFor)) {
					if (!isNaN(parseInt(k.substr(k.length - 1)))) {
						this._events[type + parseInt(k.substr(k.length - 1) - 1)] = this._events[k];
						delete this._events[k];
					}
				}
			}

			this._events[type] = this._events[type + "1"];
			delete this._events[type + "1"];
		}
		if (this._events.removeListener) { this.emit("removeListener", type, listener); }
	}
	else if (isObject(list)) {
		for (i = length; i-- > 0;) {
			if (list[i] === listener ||
				(list[i].listener && list[i].listener === listener)) {
				position = i;
				break;
			}
		}

		if (position < 0) { return this; }

		if (list.length === 1) {
			list.length = 0;
			delete this._events[type];
		}
		else { list.splice(position, 1); }

		if (this._events.removeListener) { this.emit("removeListener", type, listener); }
	}

	return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
	var key, listeners;

	if (!this._events) { return this; }

	// not listening for removeListener, no need to emit
	if (!this._events.removeListener) {
		if (arguments.length === 0) { this._events = {}; }
		else if (this._events[type]) { delete this._events[type]; }
		return this;
	}

	// emit removeListener for all listeners on all events
	if (arguments.length === 0) {
		for (key in this._events) {
			if (key === "removeListener") { continue; }
			this.removeAllListeners(key);
		}
		this.removeAllListeners("removeListener");
		this._events = {};
		return this;
	}

	listeners = this._events[type];

	if (isFunction(listeners)) { this.removeListener(type, listeners); }
	else if (listeners) { while (listeners.length) { this.removeListener(type, listeners[listeners.length - 1]); } }
	delete this._events[type];

	return this;
};

EventEmitter.prototype.listeners = function(type) {
	var ret;
	if (!this._events || !this._events[type]) { ret = []; }
	else if (isFunction(this._events[type])) { ret = [this._events[type]]; }
	else { ret = this._events[type].slice(); }
	return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
	if (this._events) {
		var evlistener = this._events[type];

		if (isFunction(evlistener)) { return 1; }
		else if (evlistener) { return evlistener.length; }
	}
	return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
	return emitter.listenerCount(type);
};

function isFunction(arg) {
	return typeof arg === "function";
}

function isNumber(arg) {
	return typeof arg === "number";
}

function isObject(arg) {
	return typeof arg === "object" && arg !== null;
}

function isUndefined(arg) {
	return arg === void 0;
}

var currentLevel = "info";
var levels = { "trace": 0, "debug": 1, "info": 2, "warn": 3, "error": 4, "fatal": 5 };

// Logger implementation..
function log(level) {
	// Return a console message depending on the logging level..
	return function(message) {
		if(levels[level] >= levels[currentLevel]) {
			console.log(`[${utils.formatDate(new Date())}] ${level}: ${message}`);
		}
	}
}

var logger = {
	// Change the current logging level..
	setLevel(level) {
		currentLevel = level;
	},
	trace: log("trace"),
	debug: log("debug"),
	info: log("info"),
	warn: log("warn"),
	error: log("error"),
	fatal: log("fatal")
};

/*
	Copyright (c) 2013-2015, Fionn Kelleher All rights reserved.

	Redistribution and use in source and binary forms, with or without modification,
	are permitted provided that the following conditions are met:

		Redistributions of source code must retain the above copyright notice,
		this list of conditions and the following disclaimer.

		Redistributions in binary form must reproduce the above copyright notice,
		this list of conditions and the following disclaimer in the documentation and/or other materials
		provided with the distribution.

	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
	ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
	WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
	IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
	INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
	OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
	WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
	ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY
	OF SUCH DAMAGE.
*/

var nonspaceRegex = /\S+/g;

function parseComplexTag(tags, tagKey, splA = ",", splB = "/", splC) {
	var raw = tags[tagKey];
	
	if(raw === undefined) {
		return tags;
	}

	var tagIsString = utils.isString(raw);
	tags[tagKey + "-raw"] = tagIsString ? raw : null;

	if(raw === true) {
		tags[tagKey] = null;
		return tags;
	}

	tags[tagKey] = {};

	if(tagIsString) {
		var spl = raw.split(splA);

		for (var i = 0; i < spl.length; i++) {
			var parts = spl[i].split(splB);
			var val = parts[1];
			if(splC !== undefined && val) {
				val = val.split(splC);
			}
			tags[tagKey][parts[0]] = val || null;
		}
	}
	return tags;
}

var parser = {
	// Parse Twitch badges..
	badges(tags) {
		return parseComplexTag(tags, "badges");
	},

	// Parse Twitch badge-info..
	badgeInfo(tags) {
		return parseComplexTag(tags, "badge-info");
	},

	// Parse Twitch emotes..
	emotes(tags) {
		return parseComplexTag(tags, "emotes", "/", ":", ",");
	},

	// Parse regex emotes..
	emoteRegex(msg, code, id, obj) {
		nonspaceRegex.lastIndex = 0;
		var regex = new RegExp("(\\b|^|\s)" + utils.unescapeHtml(code) + "(\\b|$|\s)");
		var match;

		// Check if emote code matches using RegExp and push it to the object..
		while ((match = nonspaceRegex.exec(msg)) !== null) {
			if(regex.test(match[0])) {
				obj[id] = obj[id] || [];
				obj[id].push([match.index, nonspaceRegex.lastIndex - 1]);
			}
		}
	},

	// Parse string emotes..
	emoteString(msg, code, id, obj) {
		nonspaceRegex.lastIndex = 0;
		var match;

		// Check if emote code matches and push it to the object..
		while ((match = nonspaceRegex.exec(msg)) !== null) {
			if(match[0] === utils.unescapeHtml(code)) {
				obj[id] = obj[id] || [];
				obj[id].push([match.index, nonspaceRegex.lastIndex - 1]);
			}
		}
	},

	// Transform the emotes object to a string with the following format..
	// emote_id:first_index-last_index,another_first-another_last/another_emote_id:first_index-last_index
	transformEmotes(emotes) {
		var transformed = "";

		Object.keys(emotes).forEach(id => {
			transformed = `${transformed+id}:`;
			emotes[id].forEach(
				index => transformed = `${transformed+index.join("-")},`
			);
			transformed = `${transformed.slice(0,-1)}/`;
		});

		return transformed.slice(0,-1);
	},

	formTags(tags) {
		var result = [];
		for(var key in tags) {
			var value = utils.escapeIRC(tags[key]);
			result.push(`${key}=${value}`);
		}
		return `@${result.join(';')}`;
	},

	// Parse Twitch messages..
	msg(data) {
		var message = {
			raw: data,
			tags: {},
			prefix: null,
			command: null,
			params: []
		};

		// Position and nextspace are used by the parser as a reference..
		var position = 0;
		var nextspace = 0;

		// The first thing we check for is IRCv3.2 message tags.
		// http://ircv3.atheme.org/specification/message-tags-3.2
		if(data.charCodeAt(0) === 64) {
			var nextspace = data.indexOf(" ");

			// Malformed IRC message..
			if(nextspace === -1) {
				return null;
			}

			// Tags are split by a semi colon..
			var rawTags = data.slice(1, nextspace).split(";");

			for (var i = 0; i < rawTags.length; i++) {
				// Tags delimited by an equals sign are key=value tags.
				// If there's no equals, we assign the tag a value of true.
				var tag = rawTags[i];
				var pair = tag.split("=");
				message.tags[pair[0]] = tag.substring(tag.indexOf("=") + 1) || true;
			}

			position = nextspace + 1;
		}

		// Skip any trailing whitespace..
		while (data.charCodeAt(position) === 32) {
			position++;
		}

		// Extract the message's prefix if present. Prefixes are prepended with a colon..
		if(data.charCodeAt(position) === 58) {
			nextspace = data.indexOf(" ", position);

			// If there's nothing after the prefix, deem this message to be malformed.
			if(nextspace === -1) {
				return null;
			}

			message.prefix = data.slice(position + 1, nextspace);
			position = nextspace + 1;

			// Skip any trailing whitespace..
			while (data.charCodeAt(position) === 32) {
				position++;
			}
		}

		nextspace = data.indexOf(" ", position);

		// If there's no more whitespace left, extract everything from the
		// current position to the end of the string as the command..
		if(nextspace === -1) {
			if(data.length > position) {
				message.command = data.slice(position);
				return message;
			}

			return null;
		}

		// Else, the command is the current position up to the next space. After
		// that, we expect some parameters.
		message.command = data.slice(position, nextspace);

		position = nextspace + 1;

		// Skip any trailing whitespace..
		while (data.charCodeAt(position) === 32) {
			position++;
		}

		while (position < data.length) {
			nextspace = data.indexOf(" ", position);

			// If the character is a colon, we've got a trailing parameter.
			// At this point, there are no extra params, so we push everything
			// from after the colon to the end of the string, to the params array
			// and break out of the loop.
			if(data.charCodeAt(position) === 58) {
				message.params.push(data.slice(position + 1));
				break;
			}

			// If we still have some whitespace...
			if(nextspace !== -1) {
				// Push whatever's between the current position and the next
				// space to the params array.
				message.params.push(data.slice(position, nextspace));
				position = nextspace + 1;

				// Skip any trailing whitespace and continue looping.
				while (data.charCodeAt(position) === 32) {
					position++;
				}

				continue;
			}

			// If we don't have any more whitespace and the param isn't trailing,
			// push everything remaining to the params array.
			if(nextspace === -1) {
				message.params.push(data.slice(position));
				break;
			}
		}

		return message;
	}
};

// Initialize the queue with a specific delay..
function queue(defaultDelay) {
	this.queue = [];
	this.index = 0;
	this.defaultDelay = defaultDelay || 3000;
}

// Add a new function to the queue..
queue.prototype.add = function add(fn, delay) {
	this.queue.push({
		fn: fn,
		delay: delay
	});
};

// Run the current queue..
queue.prototype.run = function run(index) {
	(index || index === 0) && (this.index = index);
	this.next();
};

// Go to the next in queue..
queue.prototype.next = function next() {
	var i = this.index++;
	var at = this.queue[i];
	var next = this.queue[this.index];

	if(!at) { return; }

	at.fn();
	next && setTimeout(() => {
		this.next();
	}, next.delay || this.defaultDelay);
};

// Reset the queue..
queue.prototype.reset = function reset() {
	this.index = 0;
};

// Clear the queue..
queue.prototype.clear = function clear() {
	this.index = 0;
	this.queue = [];
};

var queue_1 = queue;

var timer = {
	queue: queue_1
};

var _nodeResolve_empty = {};

var _nodeResolve_empty$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': _nodeResolve_empty
});

var require$$1 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(_nodeResolve_empty$1);

var client_1 = createCommonjsModule(function (module) {
var EventEmitter = events.EventEmitter;



var _global = typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof window !== "undefined" ? window : {};
var _WebSocket = _global.WebSocket || require$$1;


// Client instance..
var client = function client(opts) {
	if(this instanceof client === false) { return new client(opts); }

	this.opts = utils.get(opts, {});
	this.opts.channels = this.opts.channels || [];
	this.opts.connection = this.opts.connection || {};
	this.opts.identity = this.opts.identity || {};
	this.opts.options = this.opts.options || {};

	this.clientId = utils.get(this.opts.options.clientId, null);
	this._globalDefaultChannel = utils.channel(utils.get(this.opts.options.globalDefaultChannel, "#tmijs"));

	this.maxReconnectAttempts = utils.get(this.opts.connection.maxReconnectAttempts, Infinity);
	this.maxReconnectInterval = utils.get(this.opts.connection.maxReconnectInterval, 30000);
	this.reconnect = utils.get(this.opts.connection.reconnect, false);
	this.reconnectDecay = utils.get(this.opts.connection.reconnectDecay, 1.5);
	this.reconnectInterval = utils.get(this.opts.connection.reconnectInterval, 1000);

	this.reconnecting = false;
	this.reconnections = 0;
	this.reconnectTimer = this.reconnectInterval;

	this.secure = utils.get(
		this.opts.connection.secure,
		!this.opts.connection.server && !this.opts.connection.port
	);

	// Raw data and object for emote-sets..
	this.emotes = "";
	this.emotesets = {};

	this.channels = [];
	this.currentLatency = 0;
	this.globaluserstate = {};
	this.lastJoined = "";
	this.latency = new Date();
	this.moderators = {};
	this.pingLoop = null;
	this.pingTimeout = null;
	this.reason = "";
	this.username = "";
	this.userstate = {};
	this.wasCloseCalled = false;
	this.ws = null;

	// Create the logger..
	var level = "error";
	if(this.opts.options.debug) { level = "info"; }
	this.log = this.opts.logger || logger;

	try { logger.setLevel(level); } catch(e) {}
	// Format the channel names..
	this.opts.channels.forEach(function(part, index, theArray) {
		theArray[index] = utils.channel(part);
	});

	EventEmitter.call(this);
	this.setMaxListeners(0);
};

utils.inherits(client, EventEmitter);

// Emit multiple events..
client.prototype.emits = function emits(types, values) {
	for (var i = 0; i < types.length; i++) {
		var val = i < values.length ? values[i] : values[values.length - 1];
		this.emit.apply(this, [types[i]].concat(val));
	}
};

client.prototype.off = client.prototype.removeListener;

client.prototype.api = api_1;

// Put all commands in prototype..
for(var methodName in commands) {
	client.prototype[methodName] = commands[methodName];
}

// Handle parsed chat server message..
client.prototype.handleMessage = function handleMessage(message) {
	if(utils.isNull(message)) {
		return;
	}

	if(this.listenerCount("raw_message")) {
		this.emit("raw_message", JSON.parse(JSON.stringify(message)), message);
	}

	var channel = utils.channel(utils.get(message.params[0], null));
	var msg = utils.get(message.params[1], null);
	var msgid = utils.get(message.tags["msg-id"], null);

	// Parse badges, badge-info and emotes..
	var tags = message.tags = parser.badges(parser.badgeInfo(parser.emotes(message.tags)));

	// Transform IRCv3 tags..
	for(var key in tags) {
		if(key === "emote-sets" || key === "ban-duration" || key === "bits") {
			continue;
		}
		var value = tags[key];
		if(utils.isBoolean(value)) { value = null; }
		else if(value === "1") { value = true; }
		else if(value === "0") { value = false; }
		else if(utils.isString(value)) { value = utils.unescapeIRC(value); }
		tags[key] = value;
	}

	// Messages with no prefix..
	if(utils.isNull(message.prefix)) {
		switch(message.command) {
			// Received PING from server..
			case "PING":
				this.emit("ping");
				if(this._isConnected()) {
					this.ws.send("PONG");
				}
				break;

			// Received PONG from server, return current latency..
			case "PONG":
				var currDate = new Date();
				this.currentLatency = (currDate.getTime() - this.latency.getTime()) / 1000;
				this.emits(["pong", "_promisePing"], [[this.currentLatency]]);

				clearTimeout(this.pingTimeout);
				break;

			default:
				this.log.warn(`Could not parse message with no prefix:\n${JSON.stringify(message, null, 4)}`);
				break;
		}
	}

	// Messages with "tmi.twitch.tv" as a prefix..
	else if(message.prefix === "tmi.twitch.tv") {
		switch(message.command) {
			case "002":
			case "003":
			case "004":
			case "372":
			case "375":
			case "CAP":
				break;

			// Retrieve username from server..
			case "001":
				this.username = message.params[0];
				break;

			// Connected to server..
			case "376":
				this.log.info("Connected to server.");
				this.userstate[this._globalDefaultChannel] = {};
				this.emits(["connected", "_promiseConnect"], [[this.server, this.port], [null]]);
				this.reconnections = 0;
				this.reconnectTimer = this.reconnectInterval;

				// Set an internal ping timeout check interval..
				this.pingLoop = setInterval(() => {
					// Make sure the connection is opened before sending the message..
					if(this._isConnected()) {
						this.ws.send("PING");
					}
					this.latency = new Date();
					this.pingTimeout = setTimeout(() => {
						if(!utils.isNull(this.ws)) {
							this.wasCloseCalled = false;
							this.log.error("Ping timeout.");
							this.ws.close();

							clearInterval(this.pingLoop);
							clearTimeout(this.pingTimeout);
						}
					}, utils.get(this.opts.connection.timeout, 9999));
				}, 60000);

				// Join all the channels from the config with an interval..
				var joinInterval = utils.get(this.opts.options.joinInterval, 2000);
				if(joinInterval < 300) joinInterval = 300;
				var joinQueue = new timer.queue(joinInterval);
				var joinChannels = utils.union(this.opts.channels, this.channels);
				this.channels = [];

				for (var i = 0; i < joinChannels.length; i++) {
					let channel = joinChannels[i];
					joinQueue.add(() => {
						if(this._isConnected()) {
							this.join(channel).catch(err => this.log.error(err));
						}
					});
				}

				joinQueue.run();
				break;

			// https://github.com/justintv/Twitch-API/blob/master/chat/capabilities.md#notice
			case "NOTICE":
				var nullArr = [null];
				var noticeArr = [channel, msgid, msg];
				var msgidArr = [msgid];
				var channelTrueArr = [channel, true];
				var channelFalseArr = [channel, false];
				var noticeAndNull = [noticeArr, nullArr];
				var noticeAndMsgid = [noticeArr, msgidArr];
				var basicLog = `[${channel}] ${msg}`;
				switch(msgid) {
					// This room is now in subscribers-only mode.
					case "subs_on":
						this.log.info(`[${channel}] This room is now in subscribers-only mode.`);
						this.emits(["subscriber", "subscribers", "_promiseSubscribers"], [channelTrueArr, channelTrueArr, nullArr]);
						break;

					// This room is no longer in subscribers-only mode.
					case "subs_off":
						this.log.info(`[${channel}] This room is no longer in subscribers-only mode.`);
						this.emits(["subscriber", "subscribers", "_promiseSubscribersoff"], [channelFalseArr, channelFalseArr, nullArr]);
						break;

					// This room is now in emote-only mode.
					case "emote_only_on":
						this.log.info(`[${channel}] This room is now in emote-only mode.`);
						this.emits(["emoteonly", "_promiseEmoteonly"], [channelTrueArr, nullArr]);
						break;

					// This room is no longer in emote-only mode.
					case "emote_only_off":
						this.log.info(`[${channel}] This room is no longer in emote-only mode.`);
						this.emits(["emoteonly", "_promiseEmoteonlyoff"], [channelFalseArr, nullArr]);
						break;

					// Do not handle slow_on/off here, listen to the ROOMSTATE notice instead as it returns the delay.
					case "slow_on":
					case "slow_off":
						break;

					// Do not handle followers_on/off here, listen to the ROOMSTATE notice instead as it returns the delay.
					case "followers_on_zero":
					case "followers_on":
					case "followers_off":
						break;

					// This room is now in r9k mode.
					case "r9k_on":
						this.log.info(`[${channel}] This room is now in r9k mode.`);
						this.emits(["r9kmode", "r9kbeta", "_promiseR9kbeta"], [channelTrueArr, channelTrueArr, nullArr]);
						break;

					// This room is no longer in r9k mode.
					case "r9k_off":
						this.log.info(`[${channel}] This room is no longer in r9k mode.`);
						this.emits(["r9kmode", "r9kbeta", "_promiseR9kbetaoff"], [channelFalseArr, channelFalseArr, nullArr]);
						break;

					// The moderators of this room are: [..., ...]
					case "room_mods":
						var mods = msg.split(": ")[1].toLowerCase()
							.split(", ")
							.filter(n => n);

						this.emits(["_promiseMods", "mods"], [[null, mods], [channel, mods]]);
						break;

					// There are no moderators for this room.
					case "no_mods":
						this.emits(["_promiseMods", "mods"], [[null, []], [channel, []]]);
						break;

					// The VIPs of this channel are: [..., ...]
					case "vips_success":
						if(msg.endsWith(".")) {
							msg = msg.slice(0, -1);
						}
						var vips = msg.split(": ")[1].toLowerCase()
							.split(", ")
							.filter(n => n);

							this.emits(["_promiseVips", "vips"], [[null, vips], [channel, vips]]);
							break;

					// There are no VIPs for this room.
					case "no_vips":
						this.emits(["_promiseVips", "vips"], [[null, []], [channel, []]]);
						break;

					// Ban command failed..
					case "already_banned":
					case "bad_ban_admin":
					case "bad_ban_broadcaster":
					case "bad_ban_global_mod":
					case "bad_ban_self":
					case "bad_ban_staff":
					case "usage_ban":
						this.log.info(basicLog);
						this.emits(["notice", "_promiseBan"], noticeAndMsgid);
						break;

					// Ban command success..
					case "ban_success":
						this.log.info(basicLog);
						this.emits(["notice", "_promiseBan"], noticeAndNull);
						break;

					// Clear command failed..
					case "usage_clear":
						this.log.info(basicLog);
						this.emits(["notice", "_promiseClear"], noticeAndMsgid);
						break;

					// Mods command failed..
					case "usage_mods":
						this.log.info(basicLog);
						this.emits(["notice", "_promiseMods"], [noticeArr, [msgid, []]]);
						break;

					// Mod command success..
					case "mod_success":
						this.log.info(basicLog);
						this.emits(["notice", "_promiseMod"], noticeAndNull);
						break;

					// VIPs command failed..
					case "usage_vips":
						this.log.info(basicLog);
						this.emits(["notice", "_promiseVips"], [noticeArr, [msgid, []]]);
						break;

					// VIP command failed..
					case "usage_vip":
					case "bad_vip_grantee_banned":
					case "bad_vip_grantee_already_vip":
					case "bad_vip_max_vips_reached":
					case "bad_vip_achievement_incomplete":
						this.log.info(basicLog);
						this.emits(["notice", "_promiseVip"], [noticeArr, [msgid, []]]);
						break;

					// VIP command success..
					case "vip_success":
						this.log.info(basicLog);
						this.emits(["notice", "_promiseVip"], noticeAndNull);
						break;

					// Mod command failed..
					case "usage_mod":
					case "bad_mod_banned":
					case "bad_mod_mod":
						this.log.info(basicLog);
						this.emits(["notice", "_promiseMod"], noticeAndMsgid);
						break;

					// Unmod command success..
					case "unmod_success":
						this.log.info(basicLog);
						this.emits(["notice", "_promiseUnmod"], noticeAndNull);
						break;

					// Unvip command success...
					case "unvip_success":
						this.log.info(basicLog);
						this.emits(["notice", "_promiseUnvip"], noticeAndNull);
						break;

					// Unmod command failed..
					case "usage_unmod":
					case "bad_unmod_mod":
						this.log.info(basicLog);
						this.emits(["notice", "_promiseUnmod"], noticeAndMsgid);
						break;

					// Unvip command failed..
					case "usage_unvip":
					case "bad_unvip_grantee_not_vip":
						this.log.info(basicLog);
						this.emits(["notice", "_promiseUnvip"], noticeAndMsgid);
						break;

					// Color command success..
					case "color_changed":
						this.log.info(basicLog);
						this.emits(["notice", "_promiseColor"], noticeAndNull);
						break;

					// Color command failed..
					case "usage_color":
					case "turbo_only_color":
						this.log.info(basicLog);
						this.emits(["notice", "_promiseColor"], noticeAndMsgid);
						break;

					// Commercial command success..
					case "commercial_success":
						this.log.info(basicLog);
						this.emits(["notice", "_promiseCommercial"], noticeAndNull);
						break;

					// Commercial command failed..
					case "usage_commercial":
					case "bad_commercial_error":
						this.log.info(basicLog);
						this.emits(["notice", "_promiseCommercial"], noticeAndMsgid);
						break;

					// Host command success..
					case "hosts_remaining":
						this.log.info(basicLog);
						var remainingHost = (!isNaN(msg[0]) ? parseInt(msg[0]) : 0);
						this.emits(["notice", "_promiseHost"], [noticeArr, [null, ~~remainingHost]]);
						break;

					// Host command failed..
					case "bad_host_hosting":
					case "bad_host_rate_exceeded":
					case "bad_host_error":
					case "usage_host":
						this.log.info(basicLog);
						this.emits(["notice", "_promiseHost"], [noticeArr, [msgid, null]]);
						break;

					// r9kbeta command failed..
					case "already_r9k_on":
					case "usage_r9k_on":
						this.log.info(basicLog);
						this.emits(["notice", "_promiseR9kbeta"], noticeAndMsgid);
						break;

					// r9kbetaoff command failed..
					case "already_r9k_off":
					case "usage_r9k_off":
						this.log.info(basicLog);
						this.emits(["notice", "_promiseR9kbetaoff"], noticeAndMsgid);
						break;

					// Timeout command success..
					case "timeout_success":
						this.log.info(basicLog);
						this.emits(["notice", "_promiseTimeout"], noticeAndNull);
						break;

					case "delete_message_success":
						this.log.info(`[${channel} ${msg}]`);
						this.emits(["notice", "_promiseDeletemessage"], noticeAndNull);

					// Subscribersoff command failed..
					case "already_subs_off":
					case "usage_subs_off":
						this.log.info(basicLog);
						this.emits(["notice", "_promiseSubscribersoff"], noticeAndMsgid);
						break;

					// Subscribers command failed..
					case "already_subs_on":
					case "usage_subs_on":
						this.log.info(basicLog);
						this.emits(["notice", "_promiseSubscribers"], noticeAndMsgid);
						break;

					// Emoteonlyoff command failed..
					case "already_emote_only_off":
					case "usage_emote_only_off":
						this.log.info(basicLog);
						this.emits(["notice", "_promiseEmoteonlyoff"], noticeAndMsgid);
						break;

					// Emoteonly command failed..
					case "already_emote_only_on":
					case "usage_emote_only_on":
						this.log.info(basicLog);
						this.emits(["notice", "_promiseEmoteonly"], noticeAndMsgid);
						break;

					// Slow command failed..
					case "usage_slow_on":
						this.log.info(basicLog);
						this.emits(["notice", "_promiseSlow"], noticeAndMsgid);
						break;

					// Slowoff command failed..
					case "usage_slow_off":
						this.log.info(basicLog);
						this.emits(["notice", "_promiseSlowoff"], noticeAndMsgid);
						break;

					// Timeout command failed..
					case "usage_timeout":
					case "bad_timeout_admin":
					case "bad_timeout_broadcaster":
					case "bad_timeout_duration":
					case "bad_timeout_global_mod":
					case "bad_timeout_self":
					case "bad_timeout_staff":
						this.log.info(basicLog);
						this.emits(["notice", "_promiseTimeout"], noticeAndMsgid);
						break;

					// Unban command success..
					// Unban can also be used to cancel an active timeout.
					case "untimeout_success":
					case "unban_success":
						this.log.info(basicLog);
						this.emits(["notice", "_promiseUnban"], noticeAndNull);
						break;

					// Unban command failed..
					case "usage_unban":
					case "bad_unban_no_ban":
						this.log.info(basicLog);
						this.emits(["notice", "_promiseUnban"], noticeAndMsgid);
						break;

					// Delete command failed..
					case "usage_delete":
					case "bad_delete_message_error":
					case "bad_delete_message_broadcaster":
					case "bad_delete_message_mod":
						this.log.info(basicLog);
						this.emits(["notice", "_promiseDeletemessage"], noticeAndMsgid);
						break;

					// Unhost command failed..
					case "usage_unhost":
					case "not_hosting":
						this.log.info(basicLog);
						this.emits(["notice", "_promiseUnhost"], noticeAndMsgid);
						break;

					// Whisper command failed..
					case "whisper_invalid_login":
					case "whisper_invalid_self":
					case "whisper_limit_per_min":
					case "whisper_limit_per_sec":
					case "whisper_restricted":
					case "whisper_restricted_recipient":
						this.log.info(basicLog);
						this.emits(["notice", "_promiseWhisper"], noticeAndMsgid);
						break;

					// Permission error..
					case "no_permission":
					case "msg_banned":
					case "msg_room_not_found":
					case "msg_channel_suspended":
					case "tos_ban":
					case "invalid_user":
						this.log.info(basicLog);
						this.emits([
							"notice",
							"_promiseBan",
							"_promiseClear",
							"_promiseUnban",
							"_promiseTimeout",
							"_promiseDeletemessage",
							"_promiseMods",
							"_promiseMod",
							"_promiseUnmod",
							"_promiseVips",
							"_promiseVip",
							"_promiseUnvip",
							"_promiseCommercial",
							"_promiseHost",
							"_promiseUnhost",
							"_promiseJoin",
							"_promisePart",
							"_promiseR9kbeta",
							"_promiseR9kbetaoff",
							"_promiseSlow",
							"_promiseSlowoff",
							"_promiseFollowers",
							"_promiseFollowersoff",
							"_promiseSubscribers",
							"_promiseSubscribersoff",
							"_promiseEmoteonly",
							"_promiseEmoteonlyoff",
							"_promiseWhisper"
						], [noticeArr, [msgid, channel]]);
						break;

					// Automod-related..
					case "msg_rejected":
					case "msg_rejected_mandatory":
						this.log.info(basicLog);
						this.emit("automod", channel, msgid, msg);
						break;

					// Unrecognized command..
					case "unrecognized_cmd":
						this.log.info(basicLog);
						this.emit("notice", channel, msgid, msg);
						break;

					// Send the following msg-ids to the notice event listener..
					case "cmds_available":
					case "host_target_went_offline":
					case "msg_censored_broadcaster":
					case "msg_duplicate":
					case "msg_emoteonly":
					case "msg_verified_email":
					case "msg_ratelimit":
					case "msg_subsonly":
					case "msg_timedout":
					case "msg_bad_characters":
					case "msg_channel_blocked":
					case "msg_facebook":
					case "msg_followersonly":
					case "msg_followersonly_followed":
					case "msg_followersonly_zero":
					case "msg_slowmode":
					case "msg_suspended":
					case "no_help":
					case "usage_disconnect":
					case "usage_help":
					case "usage_me":
					case "unavailable_command":
						this.log.info(basicLog);
						this.emit("notice", channel, msgid, msg);
						break;

					// Ignore this because we are already listening to HOSTTARGET..
					case "host_on":
					case "host_off":
						break;

					default:
						if(msg.includes("Login unsuccessful") || msg.includes("Login authentication failed")) {
							this.wasCloseCalled = false;
							this.reconnect = false;
							this.reason = msg;
							this.log.error(this.reason);
							this.ws.close();
						}
						else if(msg.includes("Error logging in") || msg.includes("Improperly formatted auth")) {
							this.wasCloseCalled = false;
							this.reconnect = false;
							this.reason = msg;
							this.log.error(this.reason);
							this.ws.close();
						}
						else if(msg.includes("Invalid NICK")) {
							this.wasCloseCalled = false;
							this.reconnect = false;
							this.reason = "Invalid NICK.";
							this.log.error(this.reason);
							this.ws.close();
						}
						else {
							this.log.warn(`Could not parse NOTICE from tmi.twitch.tv:\n${JSON.stringify(message, null, 4)}`);
							this.emit("notice", channel, msgid, msg);
						}
						break;
				}
				break;

			// Handle subanniversary / resub..
			case "USERNOTICE":
				var username = tags["display-name"] || tags["login"];
				var plan = tags["msg-param-sub-plan"] || "";
				var planName = utils.unescapeIRC(utils.get(tags["msg-param-sub-plan-name"], "")) || null;
				var prime = plan.includes("Prime");
				var methods = { prime, plan, planName };
				var streakMonths = ~~(tags["msg-param-streak-months"] || 0);
				var recipient = tags["msg-param-recipient-display-name"] || tags["msg-param-recipient-user-name"];
				var giftSubCount = ~~tags["msg-param-mass-gift-count"];
				tags["message-type"] = msgid;

				switch(msgid) {
					// Handle resub
					case "resub":
						this.emits(["resub", "subanniversary"], [
							[channel, username, streakMonths, msg, tags, methods]
						]);
						break;

					// Handle sub
					case "sub":
						this.emit("subscription", channel, username, methods, msg, tags);
						break;

					// Handle gift sub
					case "subgift":
						this.emit("subgift", channel, username, streakMonths, recipient, methods, tags);
						break;

					// Handle anonymous gift sub
					// Need proof that this event occur
					case "anonsubgift":
						this.emit("anonsubgift", channel, streakMonths, recipient, methods, tags);
						break;

					// Handle random gift subs
					case "submysterygift":
						this.emit("submysterygift", channel, username, giftSubCount, methods, tags);
						break;

					// Handle anonymous random gift subs
					// Need proof that this event occur
					case "anonsubmysterygift":
						this.emit("anonsubmysterygift", channel, giftSubCount, methods, tags);
						break;

					// Handle user upgrading from Prime to a normal tier sub
					case "primepaidupgrade":
						this.emit("primepaidupgrade", channel, username, methods, tags);
						break;

					// Handle user upgrading from a gifted sub
					case "giftpaidupgrade":
						var sender = tags["msg-param-sender-name"] || tags["msg-param-sender-login"];
						this.emit("giftpaidupgrade", channel, username, sender, tags);
						break;

					// Handle user upgrading from an anonymous gifted sub
					case "anongiftpaidupgrade":
						this.emit("anongiftpaidupgrade", channel, username, tags);
						break;

					// Handle raid
					case "raid":
						var username = tags["msg-param-displayName"] || tags["msg-param-login"];
						var viewers = +tags["msg-param-viewerCount"];
						this.emit("raided", channel, username, viewers, tags);
						break;
					// Handle ritual
					case "ritual":
						var ritualName = tags["msg-param-ritual-name"];
						switch(ritualName) {
							// Handle new chatter ritual
							case "new_chatter":
								this.emit("newchatter", channel, username, tags, msg);
								break;
							// All unknown rituals should be passed through
							default:
								this.emit("ritual", ritualName, channel, username, tags, msg);
								break;
						}
						break;
					// All other msgid events should be emitted under a usernotice event
					// until it comes up and needs to be added..
					default:
						this.emit("usernotice", msgid, channel, tags, msg);
						break;
				}

				break;

			// Channel is now hosting another channel or exited host mode..
			case "HOSTTARGET":
				var msgSplit = msg.split(" ");
				var viewers = ~~msgSplit[1] || 0;
				// Stopped hosting..
				if(msgSplit[0] === "-") {
					this.log.info(`[${channel}] Exited host mode.`);
					this.emits(["unhost", "_promiseUnhost"], [[channel, viewers], [null]]);
				}
				// Now hosting..
				else {
					this.log.info(`[${channel}] Now hosting ${msgSplit[0]} for ${viewers} viewer(s).`);
					this.emit("hosting", channel, msgSplit[0], viewers);
				}
				break;

			// Someone has been timed out or chat has been cleared by a moderator..
			case "CLEARCHAT":
				// User has been banned / timed out by a moderator..
				if(message.params.length > 1) {
					// Duration returns null if it's a ban, otherwise it's a timeout..
					var duration = utils.get(message.tags["ban-duration"], null);

					if(utils.isNull(duration)) {
						this.log.info(`[${channel}] ${msg} has been banned.`);
						this.emit("ban", channel, msg, null, message.tags);
					}
					else {
						this.log.info(`[${channel}] ${msg} has been timed out for ${duration} seconds.`);
						this.emit("timeout", channel, msg, null, ~~duration, message.tags);
					}
				}
				// Chat was cleared by a moderator..
				else {
					this.log.info(`[${channel}] Chat was cleared by a moderator.`);
					this.emits(["clearchat", "_promiseClear"], [[channel], [null]]);
				}
				break;

			// Someone's message has been deleted
			case "CLEARMSG":
				if(message.params.length > 1) {
					var deletedMessage = msg;
					var username = tags["login"];
					tags["message-type"] = "messagedeleted";

					this.log.info(`[${channel}] ${username}'s message has been deleted.`);
					this.emit("messagedeleted", channel, username, deletedMessage, tags);
				}
				break;

			// Received a reconnection request from the server..
			case "RECONNECT":
				this.log.info("Received RECONNECT request from Twitch..");
				this.log.info(`Disconnecting and reconnecting in ${Math.round(this.reconnectTimer / 1000)} seconds..`);
				this.disconnect().catch(err => this.log.error(err));
				setTimeout(() => this.connect().catch(err => this.log.error(err)), this.reconnectTimer);
				break;

			// Received when joining a channel and every time you send a PRIVMSG to a channel.
			case "USERSTATE":
				message.tags.username = this.username;

				// Add the client to the moderators of this room..
				if(message.tags["user-type"] === "mod") {
					if(!this.moderators[channel]) {
						this.moderators[channel] = [];
					}
					if(!this.moderators[channel].includes(this.username)) {
						this.moderators[channel].push(this.username);
					}
				}

				// Logged in and username doesn't start with justinfan..
				if(!utils.isJustinfan(this.getUsername()) && !this.userstate[channel]) {
					this.userstate[channel] = tags;
					this.lastJoined = channel;
					this.channels.push(channel);
					this.log.info(`Joined ${channel}`);
					this.emit("join", channel, utils.username(this.getUsername()), true);
				}

				// Emote-sets has changed, update it..
				if(message.tags["emote-sets"] !== this.emotes) {
					this._updateEmoteset(message.tags["emote-sets"]);
				}

				this.userstate[channel] = tags;
				break;

			// Describe non-channel-specific state informations..
			case "GLOBALUSERSTATE":
				this.globaluserstate = tags;

				// Received emote-sets..
				if(typeof message.tags["emote-sets"] !== "undefined") {
					this._updateEmoteset(message.tags["emote-sets"]);
				}
				break;

			// Received when joining a channel and every time one of the chat room settings, like slow mode, change.
			// The message on join contains all room settings.
			case "ROOMSTATE":
				// We use this notice to know if we successfully joined a channel..
				if(utils.channel(this.lastJoined) === channel) { this.emit("_promiseJoin", null, channel); }

				// Provide the channel name in the tags before emitting it..
				message.tags.channel = channel;
				this.emit("roomstate", channel, message.tags);

				if(!message.tags.hasOwnProperty("subs-only")) {
					// Handle slow mode here instead of the slow_on/off notice..
					// This room is now in slow mode. You may send messages every slow_duration seconds.
					if(message.tags.hasOwnProperty("slow")) {
						if(typeof message.tags.slow === "boolean" && !message.tags.slow) {
							var disabled = [channel, false, 0];
							this.log.info(`[${channel}] This room is no longer in slow mode.`);
							this.emits(["slow", "slowmode", "_promiseSlowoff"], [disabled, disabled, [null]]);
						}
						else {
							var seconds = ~~message.tags.slow;
							var enabled = [channel, true, seconds];
							this.log.info(`[${channel}] This room is now in slow mode.`);
							this.emits(["slow", "slowmode", "_promiseSlow"], [enabled, enabled, [null]]);
						}
					}

					// Handle followers only mode here instead of the followers_on/off notice..
					// This room is now in follower-only mode.
					// This room is now in <duration> followers-only mode.
					// This room is no longer in followers-only mode.
					// duration is in minutes (string)
					// -1 when /followersoff (string)
					// false when /followers with no duration (boolean)
					if(message.tags.hasOwnProperty("followers-only")) {
						if(message.tags["followers-only"] === "-1") {
							var disabled = [channel, false, 0];
							this.log.info(`[${channel}] This room is no longer in followers-only mode.`);
							this.emits(["followersonly", "followersmode", "_promiseFollowersoff"], [disabled, disabled, [null]]);
						}
						else {
							var minutes = ~~message.tags["followers-only"];
							var enabled = [channel, true, minutes];
							this.log.info(`[${channel}] This room is now in follower-only mode.`);
							this.emits(["followersonly", "followersmode", "_promiseFollowers"], [enabled, enabled, [null]]);
						}
					}
				}
				break;

			// Wrong cluster..
			case "SERVERCHANGE":
				break;

			default:
				this.log.warn(`Could not parse message from tmi.twitch.tv:\n${JSON.stringify(message, null, 4)}`);
				break;
		}
	}

	// Messages from jtv..
	else if(message.prefix === "jtv") {
		switch(message.command) {
			case "MODE":
				if(msg === "+o") {
					// Add username to the moderators..
					if(!this.moderators[channel]) {
						this.moderators[channel] = [];
					}
					if(!this.moderators[channel].includes(message.params[2])) {
						this.moderators[channel].push(message.params[2]);
					}

					this.emit("mod", channel, message.params[2]);
				}
				else if(msg === "-o") {
					// Remove username from the moderators..
					if(!this.moderators[channel]) {
						this.moderators[channel] = [];
					}
					this.moderators[channel].filter(value => value != message.params[2]);

					this.emit("unmod", channel, message.params[2]);
				}
				break;

			default:
				this.log.warn(`Could not parse message from jtv:\n${JSON.stringify(message, null, 4)}`);
				break;
		}
	}

	// Anything else..
	else {
		switch(message.command) {
			case "353":
				this.emit("names", message.params[2], message.params[3].split(" "));
				break;

			case "366":
				break;

			// Someone has joined the channel..
			case "JOIN":
				var nick = message.prefix.split("!")[0];
				// Joined a channel as a justinfan (anonymous) user..
				if(utils.isJustinfan(this.getUsername()) && this.username === nick) {
					this.lastJoined = channel;
					this.channels.push(channel);
					this.log.info(`Joined ${channel}`);
					this.emit("join", channel, nick, true);
				}

				// Someone else joined the channel, just emit the join event..
				if(this.username !== nick) {
					this.emit("join", channel, nick, false);
				}
				break;

			// Someone has left the channel..
			case "PART":
				var isSelf = false;
				var nick = message.prefix.split("!")[0];
				// Client left a channel..
				if(this.username === nick) {
					isSelf = true;
					if(this.userstate[channel]) { delete this.userstate[channel]; }

					var index = this.channels.indexOf(channel);
					if(index !== -1) { this.channels.splice(index, 1); }

					var index = this.opts.channels.indexOf(channel);
					if(index !== -1) { this.opts.channels.splice(index, 1); }

					this.log.info(`Left ${channel}`);
					this.emit("_promisePart", null);
				}

				// Client or someone else left the channel, emit the part event..
				this.emit("part", channel, nick, isSelf);
				break;

			// Received a whisper..
			case "WHISPER":
				var nick = message.prefix.split("!")[0];
				this.log.info(`[WHISPER] <${nick}>: ${msg}`);

				// Update the tags to provide the username..
				if(!message.tags.hasOwnProperty("username")) {
					message.tags.username = nick;
				}
				message.tags["message-type"] = "whisper";

				var from = utils.channel(message.tags.username);
				// Emit for both, whisper and message..
				this.emits(["whisper", "message"], [
					[from, message.tags, msg, false]
				]);
				break;

			case "PRIVMSG":
				// Add username (lowercase) to the tags..
				message.tags.username = message.prefix.split("!")[0];

				// Message from JTV..
				if(message.tags.username === "jtv") {
					var name = utils.username(msg.split(" ")[0]);
					var autohost = msg.includes("auto");
					// Someone is hosting the channel and the message contains how many viewers..
					if(msg.includes("hosting you for")) {
						var count = utils.extractNumber(msg);

						this.emit("hosted", channel, name, count, autohost);
					}

					// Some is hosting the channel, but no viewer(s) count provided in the message..
					else if(msg.includes("hosting you")) {
						this.emit("hosted", channel, name, 0, autohost);
					}
				}

				else {
					var messagesLogLevel = utils.get(this.opts.options.messagesLogLevel, "info");

					// Message is an action (/me <message>)..
					var actionMessage = utils.actionMessage(msg);
					message.tags["message-type"] = actionMessage ? "action" : "chat";
					msg = actionMessage ? actionMessage[1] : msg;
					// Check for Bits prior to actions message
					if (message.tags.hasOwnProperty("bits")) {
						this.emit("cheer", channel, message.tags, msg);
					}
					else {
						//Handle Channel Point Redemptions (Require's Text Input)
						if (message.tags.hasOwnProperty("msg-id")) {
							if (message.tags["msg-id"] === "highlighted-message") {
								var rewardtype = message.tags["msg-id"];
								this.emit("redeem", channel, message.tags.username, rewardtype, message.tags, msg);
							}
							else if (message.tags["msg-id"] === "skip-subs-mode-message") {
								var rewardtype = message.tags["msg-id"];
								this.emit("redeem", channel, message.tags.username, rewardtype, message.tags, msg);
							}
						}
						else if (message.tags.hasOwnProperty("custom-reward-id")) {
							var rewardtype = message.tags["custom-reward-id"];
							this.emit("redeem", channel, message.tags.username, rewardtype, message.tags, msg);
						}
						if(actionMessage) {
							this.log[messagesLogLevel](`[${channel}] *<${message.tags.username}>: ${msg}`);
							this.emits(["action", "message"], [
								[channel, message.tags, msg, false]
							]);
						}
						// Message is a regular chat message..
						else {
							this.log[messagesLogLevel](`[${channel}] <${message.tags.username}>: ${msg}`);
							this.emits(["chat", "message"], [
								[channel, message.tags, msg, false]
							]);
						}
					}
				}
				break;

			default:
				this.log.warn(`Could not parse message:\n${JSON.stringify(message, null, 4)}`);
				break;
		}
	}
};

// Connect to server..
client.prototype.connect = function connect() {
	return new Promise((resolve, reject) => {
		this.server = utils.get(this.opts.connection.server, "irc-ws.chat.twitch.tv");
		this.port = utils.get(this.opts.connection.port, 80);

		// Override port if using a secure connection..
		if(this.secure) { this.port = 443; }
		if(this.port === 443) { this.secure = true; }

		this.reconnectTimer = this.reconnectTimer * this.reconnectDecay;
		if(this.reconnectTimer >= this.maxReconnectInterval) {
			this.reconnectTimer = this.maxReconnectInterval;
		}

		// Connect to server from configuration..
		this._openConnection();
		this.once("_promiseConnect", err => {
			if(!err) { resolve([this.server, ~~this.port]); }
			else { reject(err); }
		});
	});
};

// Open a connection..
client.prototype._openConnection = function _openConnection() {
	this.ws = new _WebSocket(`${this.secure ? "wss" : "ws"}://${this.server}:${this.port}/`, "irc");

	this.ws.onmessage = this._onMessage.bind(this);
	this.ws.onerror = this._onError.bind(this);
	this.ws.onclose = this._onClose.bind(this);
	this.ws.onopen = this._onOpen.bind(this);
};

// Called when the WebSocket connection's readyState changes to OPEN.
// Indicates that the connection is ready to send and receive data..
client.prototype._onOpen = function _onOpen() {
	if(utils.isNull(this.ws) || this.ws.readyState !== 1) {
		return;
	}

	// Emitting "connecting" event..
	this.log.info(`Connecting to ${this.server} on port ${this.port}..`);
	this.emit("connecting", this.server, ~~this.port);

	this.username = utils.get(this.opts.identity.username, utils.justinfan());
	this._getToken()
		.then(token => {
			const password = utils.password(token);

			// Emitting "logon" event..
			this.log.info("Sending authentication to server..");
			this.emit("logon");

			// Authentication..
			this.ws.send("CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership");
			if(password) {
				this.ws.send(`PASS ${password}`);
			}
			else if(utils.isJustinfan(this.username)) {
				this.ws.send("PASS SCHMOOPIIE");
			}
			this.ws.send(`NICK ${this.username}`);
		})
		.catch(err => {
			this.emits(["_promiseConnect", "disconnected"], [[err], ["Could not get a token."]]);
		});
};

// Fetches a token from the option.
client.prototype._getToken = function _getPassword() {
	let passwordOption = this.opts.identity.password;
	let password;
	if(typeof passwordOption === "function") {
		password = passwordOption();
		if(password instanceof Promise) {
			return password;
		}
		return Promise.resolve(password);
	}
	return Promise.resolve(passwordOption);
};

// Called when a message is received from the server..
client.prototype._onMessage = function _onMessage(event) {
	var parts = event.data.split("\r\n");

	parts.forEach(str => {
		if(!utils.isNull(str)) { this.handleMessage(parser.msg(str)); }
	});
};

// Called when an error occurs..
client.prototype._onError = function _onError() {
	this.moderators = {};
	this.userstate = {};
	this.globaluserstate = {};

	// Stop the internal ping timeout check interval..
	clearInterval(this.pingLoop);
	clearTimeout(this.pingTimeout);

	this.reason = !utils.isNull(this.ws) ? "Unable to connect." : "Connection closed.";

	this.emits(["_promiseConnect", "disconnected"], [[this.reason]]);

	// Reconnect to server..
	if(this.reconnect && this.reconnections === this.maxReconnectAttempts) {
		this.emit("maxreconnect");
		this.log.error("Maximum reconnection attempts reached.");
	}
	if(this.reconnect && !this.reconnecting && this.reconnections <= this.maxReconnectAttempts-1) {
		this.reconnecting = true;
		this.reconnections = this.reconnections+1;
		this.log.error(`Reconnecting in ${Math.round(this.reconnectTimer / 1000)} seconds..`);
		this.emit("reconnect");
		setTimeout(() => {
			this.reconnecting = false;
			this.connect().catch(err => this.log.error(err));
		}, this.reconnectTimer);
	}

	this.ws = null;
};

// Called when the WebSocket connection's readyState changes to CLOSED..
client.prototype._onClose = function _onClose() {
	this.moderators = {};
	this.userstate = {};
	this.globaluserstate = {};

	// Stop the internal ping timeout check interval..
	clearInterval(this.pingLoop);
	clearTimeout(this.pingTimeout);

	// User called .disconnect(), don't try to reconnect.
	if(this.wasCloseCalled) {
		this.wasCloseCalled = false;
		this.reason = "Connection closed.";
		this.log.info(this.reason);
		this.emits(["_promiseConnect", "_promiseDisconnect", "disconnected"], [[this.reason], [null], [this.reason]]);
	}
	// Got disconnected from server..
	else {
		this.emits(["_promiseConnect", "disconnected"], [[this.reason]]);

		// Reconnect to server..
		if(this.reconnect && this.reconnections === this.maxReconnectAttempts) {
			this.emit("maxreconnect");
			this.log.error("Maximum reconnection attempts reached.");
		}
		if(this.reconnect && !this.reconnecting && this.reconnections <= this.maxReconnectAttempts-1) {
			this.reconnecting = true;
			this.reconnections = this.reconnections+1;
			this.log.error(`Could not connect to server. Reconnecting in ${Math.round(this.reconnectTimer / 1000)} seconds..`);
			this.emit("reconnect");
			setTimeout(() => {
				this.reconnecting = false;
				this.connect().catch(err => this.log.error(err));
			}, this.reconnectTimer);
		}
	}

	this.ws = null;
};

// Minimum of 600ms for command promises, if current latency exceeds, add 100ms to it to make sure it doesn't get timed out..
client.prototype._getPromiseDelay = function _getPromiseDelay() {
	if(this.currentLatency <= 600) { return 600; }
	else { return this.currentLatency + 100; }
};

// Send command to server or channel..
client.prototype._sendCommand = function _sendCommand(delay, channel, command, fn) {
	// Race promise against delay..
	return new Promise((resolve, reject) => {
		// Make sure the socket is opened..
		if(utils.isNull(this.ws) || this.ws.readyState !== 1) {
			// Disconnected from server..
			return reject("Not connected to server.");
		}
		else if(typeof delay === "number") {
			utils.promiseDelay(delay).then(() => reject("No response from Twitch."));
		}

		// Executing a command on a channel..
		if(!utils.isNull(channel)) {
			var chan = utils.channel(channel);
			this.log.info(`[${chan}] Executing command: ${command}`);
			this.ws.send(`PRIVMSG ${chan} :${command}`);
		}

		// Executing a raw command..
		else {
			this.log.info(`Executing command: ${command}`);
			this.ws.send(command);
		}
		if(typeof fn === 'function') {
			fn(resolve, reject);
		}
		else {
			resolve();
		}
	});
};

// Send a message to channel..
client.prototype._sendMessage = function _sendMessage(delay, channel, message, fn) {
	// Promise a result..
	return new Promise((resolve, reject) => {
		// Make sure the socket is opened and not logged in as a justinfan user..
		if(utils.isNull(this.ws) || this.ws.readyState !== 1) {
			return reject("Not connected to server.");
		}
		else if(utils.isJustinfan(this.getUsername())) {
			return reject("Cannot send anonymous messages.");
		}
		var chan = utils.channel(channel);
		if(!this.userstate[chan]) { this.userstate[chan] = {}; }

		// Split long lines otherwise they will be eaten by the server..
		if(message.length >= 500) {
			var msg = utils.splitLine(message, 500);
			message = msg[0];

			setTimeout(() => {
				this._sendMessage(delay, channel, msg[1], () => {});
			}, 350);
		}

		this.ws.send(`PRIVMSG ${chan} :${message}`);

		var emotes = {};

		// Parse regex and string emotes..
		Object.keys(this.emotesets).forEach(id =>
			this.emotesets[id].forEach(emote => {
				var emoteFunc = utils.isRegex(emote.code) ? parser.emoteRegex : parser.emoteString;
				return emoteFunc(message, emote.code, emote.id, emotes)
			})
		);

		// Merge userstate with parsed emotes..
		var userstate = utils.merge(
			this.userstate[chan],
			parser.emotes({ emotes: parser.transformEmotes(emotes) || null })
		);

		var messagesLogLevel = utils.get(this.opts.options.messagesLogLevel, "info");

		// Message is an action (/me <message>)..
		var actionMessage = utils.actionMessage(message);
		if(actionMessage) {
			userstate["message-type"] = "action";
			this.log[messagesLogLevel](`[${chan}] *<${this.getUsername()}>: ${actionMessage[1]}`);
			this.emits(["action", "message"], [
				[chan, userstate, actionMessage[1], true]
			]);
		}

		// Message is a regular chat message..
		else {
			userstate["message-type"] = "chat";
			this.log[messagesLogLevel](`[${chan}] <${this.getUsername()}>: ${message}`);
			this.emits(["chat", "message"], [
				[chan, userstate, message, true]
			]);
		}
		if(typeof fn === 'function') {
			fn(resolve, reject);
		}
		else {
			resolve();
		}
	});
};

// Grab the emote-sets object from the API..
client.prototype._updateEmoteset = function _updateEmoteset(sets) {
	this.emotes = sets;

	this._getToken()
	.then(token =>
		this.api({
			url: `/chat/emoticon_images?emotesets=${sets}`,
			headers: {
				"Accept": "application/vnd.twitchtv.v5+json",
				"Authorization": `OAuth ${utils.token(token)}`,
				"Client-ID": this.clientId
			}
		}, (err, res, body) => {
			if(!err) {
				this.emotesets = body["emoticon_sets"] || {};
				return this.emit("emotesets", sets, this.emotesets);
			}
			setTimeout(() => this._updateEmoteset(sets), 60000);
		})
	)
	.catch(() => setTimeout(() => this._updateEmoteset(sets), 60000));
};

// Get current username..
client.prototype.getUsername = function getUsername() {
	return this.username;
};

// Get current options..
client.prototype.getOptions = function getOptions() {
	return this.opts;
};

// Get current channels..
client.prototype.getChannels = function getChannels() {
	return this.channels;
};

// Check if username is a moderator on a channel..
client.prototype.isMod = function isMod(channel, username) {
	var chan = utils.channel(channel);
	if(!this.moderators[chan]) { this.moderators[chan] = []; }
	return this.moderators[chan].includes(utils.username(username));
};

// Get readyState..
client.prototype.readyState = function readyState() {
	if(utils.isNull(this.ws)) { return "CLOSED"; }
	return ["CONNECTING", "OPEN", "CLOSING", "CLOSED"][this.ws.readyState];
};

// Determine if the client has a WebSocket and it's open..
client.prototype._isConnected = function _isConnected() {
	
	return this.ws !== null && this.ws.readyState === 1;
};

// Disconnect from server..
client.prototype.disconnect = function disconnect() {
	return new Promise((resolve, reject) => {
		if(!utils.isNull(this.ws) && this.ws.readyState !== 3) {
			this.wasCloseCalled = true;
			this.log.info("Disconnecting from server..");
			this.ws.close();
			this.once("_promiseDisconnect", () => resolve([this.server, ~~this.port]));
		}
		else {
			this.log.error("Cannot disconnect from server. Socket is not opened or connection is already closing.");
			reject("Cannot disconnect from server. Socket is not opened or connection is already closing.");
		}
	});
};

// Expose everything, for browser and Node..
if(module.exports) {
	module.exports = client;
}
if(typeof window !== "undefined") {
	window.tmi = {};
	window.tmi.client = client;
	window.tmi.Client = client;
}
});

var tmi_js = {
	client: client_1,
	Client: client_1
};

var Client = tmi_js.Client;
var client = tmi_js.client;
export default tmi_js;
export { Client, tmi_js as __moduleExports, client };
