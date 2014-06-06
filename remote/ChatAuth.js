'use strict'

var Promise = require('es6-promise').Promise
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
var rest = require('../util/rest')

module.exports = function ChatAuth(remoteURL) {
	return function (selfId, peerIds) {
		return rest('POST', remoteURL, {
			payload: { selfId: selfId, peerIds: peerIds },
			format: 'json',
		}, { type: 'json' })
		return new Promise(function (resolve, reject) {
			var xhr = new XMLHttpRequest()
			xhr.open('POST', remoteURL)
			xhr.onload = function () {
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
			xhr.setRequestHeader('Accept', 'application/json')
			xhr.setRequestHeader('Content-Type', 'application/json')
			xhr.send(JSON.stringify({ selfId: selfId, peerIds: peerIds }))
		})
	}
}