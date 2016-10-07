/**
 * worker.js - node.js cluster worker process
 */

'use strict'

const http = require( 'http' )

const ws = require( 'uws' )

const app = require( './app' )

const httpServer = http.createServer()

const wsServer = new ws.Server( { server: httpServer } )

httpServer.once( 'error', err => {

	console.log( `${process.id}:${process.pid} - error:`, err )

	process.send( { type: 'error', error: err } )

	// process.exit( 0 )

} )

httpServer.on( 'request', app )

httpServer.listen( process.env.NODE_PORT, process.env.NODE_IP )
