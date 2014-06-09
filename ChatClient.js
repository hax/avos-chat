'use strict'

var Promise = require('es6-promise').Promise
var WebSocket = require('ws')

var EventEmitter = require('events').EventEmitter

var Class = require('mmclass').Class

var protocol = require('debug')('ChatClient:protocol')
var network = require('debug')('ChatClient:network')


module.exports = Class.extend(EventEmitter)({
	constructor: function ChatClient(settings) {
		if (!settings) throw new Error('settings')
		if (!settings.appId) throw new Error('settings.appId')
		if (!settings.auth) throw new Error('settings.auth')
		this._settings = settings //todo: clone
		this._in = new EventEmitter()
		this._self = null
		this._peers = Object.create(null)
		this._in.on('presence', function (res) {
			res.sessionPeerIds.forEach(function (id) {
				this._peers[id].presence = res.status === 'on'
			}, this)
			this.emit('presence', res)
		}.bind(this))

		this._in.on('direct', function (res) {
			this._incCount()
			var msg
			try {
				msg = JSON.parse(res.msg)
			} catch (e) {
				this.emit('error', 'Message format error' + ' -- ' + res.msg)
			}
			msg.fromPeerId = res.fromPeerId
			protocol(msg.type, msg)
			this.emit(msg.type, msg)
		}.bind(this))
		this._in.on('ackreq', function (res) {
			this._confirmCount = res.c
		}.bind(this))

		this._count = 0
	},
	_incCount: function () {
		this._count++
		if (this._count >= this._confirmCount) return ack()
	},
	ack: function () {
		protocol('ack')
		clearTimeout(this._ackTask)
		this._ackTask = setTimeout(this.ack.bind(this), 120000)
		return this.doCommand('ack').then(function (res) {
			this._count = 0
			this._confirmCount = res.c
		}.bind(this))
	},
	serverURL: function () {
		var server = this._settings.server
		if (server && new Date() < server.expires) return server.url
		else return null
	},
	connect: function (autoReconnect) {
		var url = this.serverURL()
		if (!url) {
			return lookupServer(this._settings).
				then(function (server) {
					this._settings.server = server
					return this.connect(autoReconnect)
				}.bind(this)).
				catch(function () {
					throw new Error('No server available')
				})
		} else {
			return new Promise(function (resolve, reject) {
				network('connect ' + url)
				var ws = new WebSocket(url)
				ws.onopen = function () {
					network('connected')
					resolve(this)
				}
				ws.onclose = function (evt) {
					network('closed', evt)
				}
				if (autoReconnect) ws.onerror = reconnect.bind(this)
				ws.onmessage = processMessage.bind(this)
				this._ws = ws
			}.bind(this))
		}
	},
	openSession: function (self, peers) {
		return this._settings.auth(self, peers).
			then(function (data) {
				protocol('auth', data)
				this._self = self
				data.sessionPeerIds.forEach(function (id) {
					this._peers[id] = { presence: null }
				}, this)
				return this.doCommand('session.open', {
					sessionPeerIds: data.sessionPeerIds,
					t: data.t,
					n: data.n,
					s: data.s,
				})
			}.bind(this)).
			then(function (opened) {
				protocol('session opened', opened)
				return {
					onlinePeers: opened.onlineSessionPeerIds
				}
			}).
			then(function (data) {
				protocol('presence status', data)
				data.onlinePeers.forEach(function (id) {
					this._peers[id].presence = true
				}, this)
				return data
			}.bind(this))
	},
	closeSession: function () {
		return this.doCommand('session.close')
	},
	say: function (to, text) {
		return this.doCommand('direct', {
			msg: JSON.stringify({
				type: 'text',
				content: {text: text},
				guid: Math.random().toString('36').slice(2),
				fromId: this._self,
				toId: to,
				timestamp: Date.now() / 1000 | 0,
			}),
			toPeerIds: [].concat(to),
			transient: false,
		})
	},
	watch: function (peers) {
		return this._settings.auth(this._self, peers).
			then(function (data) {
				protocol('auth', data)
				data.sessionPeerIds.forEach(function (id) {
					if (!this._peers[id]) this._peers[id] = { presence: null }
					else this._peers[id].presence = null
				}, this)
				return this.doCommand('session.add', {
					sessionPeerIds: data.sessionPeerIds,
					t: data.t,
					n: data.n,
					s: data.s,
				})
			}.bind(this))
			.then(function (watched) {
				protocol('watched', watched)
				return {
					onlinePeers: watched.onlineSessionPeerIds
				}
			}).then(function (data) {
				protocol('presence status', data)
				data.onlinePeers.forEach(function (id) {
					if (!this._peers[id]) this._peers[id] = { presence: true }
					else this._peers[id].presence = true
				}, this)
				return data
			}.bind(this))
	},
	unwatch: function (peers) {
		return this.doCommand('session.remove', {
			sessionPeerIds: [].concat(peers)
		}).then(function (unwatched) {
			return {
				//todo
			}
		})
	},
	getStatus: function (peers) {
		return this.doCommand('session.query', {
			sessionPeerIds: [].concat(peers)
		})
	},
	doCommand: function (name, parameters) {
		var msg = parameters ? parameters/*todo: clone*/ : {}
		protocol('do ' + name, parameters)
		if (!msg.appId) msg.appId = this._settings.appId
		if (!msg.peerId) msg.peerId = this._self
		var cmd = Command(name)
		msg.cmd = cmd.cmd
		msg.op = cmd.op
		protocol('send', msg)
		this._ws.send(JSON.stringify(msg))
		return new Promise(function (resolve, reject) {
				protocol('wait ' + cmd.response)
				this._in.once(cmd.response, resolve)
			}.bind(this))
	}
})

function Command(name) {
	var i = name.indexOf('.')
	if (i === -1) {
		return { cmd: name, response: name === 'ack' ? 'ackreq' : 'ack' }
	}
	var cmd = name.slice(0, i), op0 = name.slice(i + 1), op1
	if (op0 === 'query') op1 = 'query-result'
	else if (op0.slice(-1) === 'e') op1 = op0 + 'd'
	else op1 = op0 + 'ed'
	var response = cmd + '.' + op1
	return { cmd: cmd, op: op0, response: response }
}

function reconnect(evt) {
	network('error', evt)
	//todo: reconnect
}

function processMessage(evt) {
	network(evt.type, evt.data)
	var data
	try {
		data = JSON.parse(evt.data)
	} catch(e) {
		this._in.emit('error', evt.data)
		protocol('error', evt.data)
		return
	}
	var type = data.cmd
	if (data.op) type += '.' + data.op
	this._in.emit(type, data)
	protocol('got ' + type, data)
}


var getJSON = require('./util/getJSON')

function lookupServer(settings) {
	network('lookup server', settings)
	return getJSON('http://router.g0.push.avoscloud.com/v1/route?cb=?', {
		appId: settings.appId,
		secure: settings.secure,
	}).then(function (config) {
		return {
			url: config.server,
			expires: Date.now() + config.ttl * 1000,
		}
	})
}
