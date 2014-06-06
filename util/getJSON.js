'use strict'

var Promise = require('es6-promise').Promise
var qs = require('querystring')
var rest = require('./rest')

module.exports = function getJSON(url, parameters) {
	if (typeof jQuery !== 'undefined') {
		return Promise.resolve(jQuery.getJSON.apply(jQuery, arguments))
	} else {
		return rest('GET', url + '?' + qs.stringify(parameters))
	}
}

