'use strict'

var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
var Promise = require('es6-promise').Promise
var querystring = require('querystring')
var debug = require('debug')('getJSON')

module.exports = function getJSON(url, parameters) {
	if (typeof jQuery !== 'undefined') {
		return Promise.resolve(jQuery.getJSON.apply(jQuery, arguments))
	} else {
		return new Promise(function (resolve, reject) {
			var xhr = new XMLHttpRequest()
			url = url + '?' + querystring.stringify(parameters)
			xhr.open('GET', url)
			debug('GET ' + url)
			xhr.onload = function () {
				debug(this.status + this.statusText, this.responseText)
				var res
				try {
					res = JSON.parse(this.responseText)
				} catch (e) {
					reject(this.responseText)
					return
				}
				if (this.status >= 200 && this.status < 300) resolve(res)
				else reject(res)
			}
			xhr.onerror = reject
			xhr.send()
		})
	}
}

