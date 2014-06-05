'use strict'

var Promise = require('es6-promise').Promise

var createHmac = require('crypto').createHmac

function ChatAuth(appId, appSecret) {
	return function (self, peers) {
		var hmac = createHmac('sha1', appSecret)
		var ts = new Date() / 1000 | 0,
			nonce = Math.random().toString(36).slice(2, 8),
			peers = peers.concat().sort()
		var data = [].concat(appId, self, peers, ts, nonce)
		hmac.update(data.join(':'))
		var mac = hmac.digest('hex')
		return Promise.resolve({
			peers: peers,
			ts: ts,
			nonce: nonce,
			mac: mac,
		})
	}
}

module.exports = ChatAuth