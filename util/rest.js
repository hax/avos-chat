'use strict'

var Promise = require('es6-promise').Promise
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
var debug = require('debug')('rest')

function rest(method, url, options) {
	if (!options) options = {}
	return new Promise(function (resolve, reject) {
		var xhr = new XMLHttpRequest()
		xhr.open(method, url)
		xhr.onload = function () {
			var type = this.getResponseHeader('Content-Type')
			debug(this.status + this.statusText, type + ': ' + this.responseText)
			var res
			if (/^application\/(.+\+)?json$/i.test(type) || options.responseType === 'json') {
				try {
					res = JSON.parse(this.responseText)
				} catch (e) {
					reject(e + ' -- ' + this.responseText)
					return
				}
			} else if (/^application\/(.+\+)?xml$/i.test(type) || options.responseType === 'xml') {
				if (this.responseXML) {
					res = this.responseXML
				} else {
					reject('Invalid XML -- ' + this.responseText)
					return
				}
			} else if (/^text\//i.test(type)) {
				res = this.responseText
			} else {
				reject('Unsupported type: ' + type + ' -- ' + this.responseText)
				return
			}
			if (this.status >= 200 && this.status < 300) resolve(res)
			else reject(res)
		}
		xhr.onerror = reject
		var body
		switch (options.payloadFormat) {
			case 'json':
				xhr.setRequestHeader('Content-Type', 'application/json')
				body = JSON.stringify(options.payload)
			default:
				body = options.payload
		}
		xhr.send(body)
		debug(method + ' ' + url, body)
	})
}

module.exports = rest