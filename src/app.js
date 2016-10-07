/**
 * app.js - express application
 */

'use strict'

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

const pkg = require( '../package.json' )

const path = require( 'path' )

const express = require( 'express' )

const favicon = require( 'serve-favicon' )

const FileStreamRotator = require( 'file-stream-rotator' )

const morgan = require( 'morgan' )

const cookieParser = require( 'cookie-parser' )

const router = require( './router' )

const app = express()

app.locals.app_title = pkg.title || pkg.name

app.locals.app_description = pkg.description || ''

app.set( 'x-powered-by', false )

app.set( 'view engine', 'pug' )

if ( IS_PRODUCTION ) {

	app.set( 'trust proxy', true )

	app.set( 'view cache', true )

	app.head( '/health', ( req, res, next ) => res.writeHead( 200, { 'Connection': 'Close' } ).end() )

	app.use( function ( req, res, next ) {

		if ( req.protocol !== 'https' ) {

			res.redirect( `https://${req.headers.host}${req.url}` )

		} else {

			next()

		}

	} )

} else {

	app.locals.pretty = true

}

app.use( favicon( 'pub/favicon.ico' ) )

app.use( cookieParser() )

// logging

const logDirectory = path.join( __dirname, '../logs' )

const accessLogStream = FileStreamRotator.getStream( {
  date_format: 'YYYYMMDD',
  filename: path.join( logDirectory, 'access-%DATE%.log'),
  frequency: 'daily',
  verbose: false
} )

app.use( morgan( 'combined', { stream: accessLogStream } ) )

// application routes

app.use( '/', router )

// static files

app.use( '/', express.static( 'pub', {

	dotfiles: 'ignore', // ignore|allow|deny

	etag: true, // enable or disable weak etag generation

	extensions: false, // sets file extension fallbacks

	fallthrough: true, // let client errors fall-through as unhandled requests, otherwise forward a client error.

	index: 'index.html', // sends the specified directory index file or set to false to disable directory indexing.

	lastModified: true, // set the Last-Modified header to the last modified date of the file on the OS.

	maxAge: 0, // Set the max-age property of the Cache-Control header in milliseconds.

	redirect: true, // Redirect to trailing '/' when the pathname is a directory.

} ) )

// Handle errors

app.use( ( req, res, next ) => {

	const err = new Error( '404 Not Found' )

	err.status = 404

	next( err )

} )

app.use( ( err, req, res, next ) => {

	res.status( err.status || 500 ).end( err.toString() )

} )

//

module.exports = app
