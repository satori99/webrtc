'use strict'

const elLog = document.querySelector( '#log' )

const elSendFile = document.querySelector( '.send-file' )

const elSelectFile = document.createElement( 'input' )
elSelectFile.type = 'file'
elSelectFile.style = 'display:none;'
elSelectFile.onchange = e => {
	const file = e.target.files.length !== 0 ? e.target.files[ 0 ] : null
	if ( file !== null ) {
		log( `Selected New File: ${file.name}` )
		elSendFile.disabled = true
		sendFile( file )
	}
}

elSendFile.onclick = e => elSelectFile.click()

elSendFile.parentNode.insertBefore( elSelectFile, elSendFile.nextSibling )

elSendFile.disabled = false

const socket = new WebSocket( 'ws://localhost:8080' )

socket.onopen = e => {

	log( 'socket: onopen' )

	socket.send( 'Ping' ) // Send the message 'Ping' to the server

}

socket.onclose = e => {

	log( 'socket: onclose' )

}

socket.onerror = err => {

	console.log( 'socket: onerror - ' + error )

}

socket.onmessage = e => {

	log( 'socket: onmessage - ' + e.data )

}



//

function sendFile ( file ) {

	const name = file.name

	const headers = new Headers()

	headers.append( 'accept', 'application/json' )

	const request = new Request( '', {
		method: 'GET',
		headers: headers,
		mode: 'cors',
		cache: 'default'
	} )

	fetch( request )
		.then( res => {
			if ( res.ok ) return res.json()
			throw new Error( 'Failed to initiaize file send operation' )
		} )
		.then( json => {
			console.log( 'json', json )
			log( 'got json response from /send' )
		} )
		.catch( err => console.warn( err ) )

}

function log ( text ) {
	const elLine = document.createElement( 'div' )
	elLine.innerHTML = text
	elLog.appendChild( elLine )
}