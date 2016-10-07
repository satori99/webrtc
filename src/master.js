/**
 * master.js - node.js cluster master process
 */

'use strict'

function initMaster ( options ) {

	options = options || {}

	const NUM_WORKERS = options.workers || 2

	const WORKER_ENV = {
		NODE_IP: options.hostname || process.env.NODE_IP || '0.0.0.0',
		NODE_PORT: options.port || process.env.NODE_PORT || 8080,
		NODE_ENV: options.env || process.env.NODE_ENV || '',
	}

	const cluster = require( 'cluster' )

	const net = require( 'net' )

	const repl = require( 'repl' )

	const forkWorker = () => {

		const worker = cluster.fork( WORKER_ENV ).once( 'error', err => {

			console.log( `0:${process.pid} - worker [${worker.id}:${worker.process.pid}] error:`, err )

		} )

		return worker

	}

	let isListening = false

	let isShuttingDown = false

	cluster.setupMaster( { exec: './src/worker.js', silent: true } )

	cluster.on( 'message', msg => {

		switch ( msg.type ) {

			default:

				console.log( `0:${process.pid} - received unknown msg type from worker:`, msg )

				break

		}

	} )

	cluster.on( 'listening', ( worker, addr ) => {

		console.log( `0:${process.pid} - worker [${worker.id}:${worker.process.pid}] is listening @ ${addr.address}:${addr.port}` )

	} )

	cluster.on( 'exit', ( worker, code, signal ) => {

		console.log( `0:${process.pid} - worker [${worker.id}:${worker.process.pid}] has exited with code ${code} (suicide=${worker.suicide})` )

		if ( ! isShuttingDown ) forkWorker()

	} )

	process.once( 'SIGINT', () => {

		console.log( `0:${process.pid} - Got SIGINT ...` )

		cluster.removeAllListeners()

		cluster.disconnect( () => {

			const code = 1

			console.log( `0:${process.pid} - all workers stopped, exiting with code ${code}` )

			process.exit( code )

		} )

	} )

	process.on( 'SIGUSR2', () => {

		console.log( `0:${process.pid} - Got SIGUSR2 ...` )

		delete require.cache[ require.resolve( './app' ) ]



	} )

	for ( let i = 0; i < NUM_WORKERS; i ++ ) forkWorker()

	// A remote node repl that you can telnet to!
	// net.createServer( function ( socket ) {

	// 	const remote = repl.start( 'node::remote> ', socket )

	// 	//Adding "mood" and "bonus" to the remote REPL's context.
	// 	//remote.context.mood = mood;
	// 	//remote.context.bonus = "UNLOCKED";

	// 	remote.context.help = () => 'Help!!!'

	// } ).listen( 5001 )

}

if ( ! module.parent ) {

	initMaster()

} else {

	module.exports = initMaster

}
