'use strict'

var Promise = require('es6-promise').Promise
var qs = require('querystring')
var rest = require('./rest')

module.exports = function getJSON(url, parameters) {
	var $ =
		typeof Zepto !== 'undefined' ? Zepto :
		typeof jQuery !== 'undefined' ? jQuery :
		null
	if ($) {
		return Promise.resolve($.getJSON.apply($, arguments))
	} else {
		var i = url.indexOf('?')
		if (i === -1) url += '?' + qs.stringify(parameters)
		else url = url.slice(0, i + 1) +  qs.stringify(parameters)
		return rest('GET', url)
	}
}

