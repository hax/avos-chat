'use strict'

var Promise = require('es6-promise').Promise
var qs = require('querystring')
var rest = require('./rest')

module.exports = function getJSON(url, parameters) {
	if (typeof jQuery !== 'undefined' || typeof Zepto !== 'undefined') {
		var $ = jQuery || Zepto
		return Promise.resolve($.getJSON.apply($, arguments))
	} else {
		var i = url.indexOf('?')
		if (i === -1) url += '?' + qs.stringify(parameters)
		else url = url.slice(0, i + 1) +  qs.stringify(parameters)
		return rest('GET', url)
	}
}

