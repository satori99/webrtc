/**
 * app.js - express router
 */

'use strict'

const express = require( 'express' )

const router = express.Router()

// home route

router.get( '/', ( req, res ) => {

	res.render( 'home', {

		page_title: 'Home'

	} )

} )

router.get( '/send', ( req, res ) => {

	if ( req.accepts( [ 'html', 'json' ] ) === 'json' ) {

		res.json( {

			'test': 'test'

		} )

	} else {

		res.render( 'send', {

			page_title: 'Send File'

		} )

	}

} )

//

module.exports = router
