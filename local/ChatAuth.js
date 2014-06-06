'use strict'

var Promise = require('es6-promise').Promise

var createHmac = require('crypto').createHmac

function ChatAuth(appId, appSecret) {
	return function (selfId, peerIds) {
		var hmac = createHmac('sha1', appSecret)
		var ts = new Date() / 1000 | 0,
			nonce = Math.random().toString(36).slice(2, 8),
			sortedPeerIds = peerIds.concat().sort()
		var data = [].concat(appId, selfId, sortedPeerIds, ts, nonce)
		hmac.update(data.join(':'))
		var mac = hmac.digest('hex')
		return Promise.resolve({
			sessionPeerIds: sortedPeerIds,
			t: ts,
			n: nonce,
			s: mac,
		})
	}
}

module.exports = ChatAuth