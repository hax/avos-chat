'use strict'

var rest = require('../util/rest')

module.exports = function ChatAuth(remoteURL) {
	return function (selfId, peerIds) {
		return rest('POST', remoteURL, {
			payload: { selfId: selfId, peerIds: peerIds },
			payloadFormat: 'json',
			responseType: 'json',
		})
	}
}