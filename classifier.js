const Twit = require( 'twit' );
const request = require ( 'request' );
const config = require( './config.js' );
var t = new Twit( config );

var sw = require( 'stopword' );
var fs = require( 'fs' );

var bayes = require( 'bayes' );
var classifier = bayes();

const an = /^[0-9a-zA-Z]+$/;

var topics = {
    "billboard music awards": "music",
    "MTV video music awards": "music",
    "iHeartRadio music awards": "music",
    "grammy awards": "music",
    "america music awards": "music",
    "taylor swift": "music",
    "billie eilish": "music",
    "beyonce": "music",
    "ariana grande": "music",
    "met gala": "fashion",
    "new york fashion week": "fashion",
    "london fashion week": "fashion",
    "milan fashion week": "fashion",
    "paris fashion week": "fashion",
    "gucci": "fashion",
    "tom ford": "fashion",
    "ralph lauren": "fashion",
    "academy awards": "movies",
    "the oscars": "movies",
    "oscar nominations": "movies",
    "best-picture": "movies",
    "golden globe awards": "movies",
    "britsh academy film awards": "movies",
    "MTV movie and TV awards": "movies",
    "emmy awards": "movies",
    "golden globes": "movies",
    "N.F.L.": "sports",
    "N.B.A.": "sports",
    "W.N.B.A.": "sports",
    "N.H.L.": "sports",
    "Super League": "sports",
    "Yankees": "sports",
    "M.L.B": "sports",
    "N.C.A.A": "sports",
    "golf": "sports",
    "tenis": "sports",
    "restaurant": "food",
    "chef": "food",
    "pizza": "food",
    "cheese": "food",
    "recipe": "food",
    "vegan": "food",
    "wine": "food",
    "cocktail": "food",
    "cook": "food",
    "bakery": "food"
};

var nytRequest = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=";
var nytKey = '&api-key=QzKFWAujGBho5J5YVIIeYE4sDk1VFgIU';

var index = 0;

for ( let [ key, value ] of Object.entries( topics ) ) {

    // code for getting data from nyt which is preferable, but exceeds the limit so twitter data will be used
    /*request ( nytRequest + "{" + key + "}" + nytKey, async function ( error, respose, body ) {
        var data = JSON.parse ( body );
        if ( data.status == "OK" ) {
            for ( var i = 0; i < data.response.docs.length; ++i ) {
                await classifier.learn( cleanup( data.response.docs[i].snippet ), value );
                await classifier.learn( cleanup( data.response.docs[i].lead_paragraph ), value );
            }
            index++;
            if ( index == 46 ) {
                fs.writeFile( "./classifier2.json", classifier.toJson(), function( err, data ) {
                    if( err ) { console.log( err ); } else { console.log( "saved" ); }
                });
            }
        } else console.log ( "didn't work" );
    });*/
    t.get ( 'search/tweets', { q: key, count: 100 }, async function ( err, data, response ) {
        try {
            for ( var i = 0; i < data.statuses.length; i++ ){
                await classifier.learn( cleanup( data.statuses[i].text ), value );
            }
            index++;
            if ( index == 46 ) {
                fs.writeFile( "./classifier.json", classifier.toJson(), function( err, data ) {
                    if( err ) console.log( err );
                    else console.log( "saved" );
                });
            }
        } 
        catch ( ex ) { console.log( ex ); }
    });
}

function cleanup( tweet ) {
    var clean = [];
    var split = sw.removeStopwords( tweet.split(" ") );
    
    for ( var i = 0; i < split.length; i++ ) {
        if ( an.test ( split[i] ) && split[i].length > 2 )clean.push( split[i].toLowerCase() );
    }
    return [...new Set( clean )].join(", ");
}