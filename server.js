const bayes = require( 'bayes' );
const sw = require( 'stopword' );
const fs = require( 'fs' );

const express = require( 'express' );
var app = express();
var server = app.listen( 3000 );
app.use( express.static( 'public' ) );

var socket = require( 'socket.io' );
var io = socket( server );

var classifier;
fs.readFile( './classifier.json', downloadedFile );

const an = /^[0-9a-zA-Z]+$/;

function downloadedFile( error, data ) {

    if( error ) console.log( error );
    else {
        classifier = bayes.fromJson( data );
        io.sockets.on( 'connection', newConnection );
    }
}

function newConnection( socket ) {
    socket.on( 'guess', async function ( data ) {
        var guess = await classifier.categorize( cleanup( data ) );
        socket.emit( 'guess', guess );
    });
}

function cleanup( msg ) {
    var clean = [];
    var split = sw.removeStopwords( msg.split(" ") );
    
    for ( var i = 0; i < split.length; i++ ) {
        if ( an.test( split[i] ) && split[i].length > 2 ) clean.push( split[i].toLowerCase() );
    }
    return [...new Set( clean )].join(", ");
}