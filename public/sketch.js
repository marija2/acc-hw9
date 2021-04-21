var chatInput;
var chatBtn;
// all messages
var chatMsgs = [];

// possible responses
var musicArr = [ "ugh music", "music yay", "i can play music for u", "i like listening to music", "music is great", 
];
var sportArr = [ "sports yay", "sports are fun", "i cant play sports", "i like talking about sports", 
"sports are always on my mind", "im bad at sports" ];
var fashionArr = [ "i don't know much about fashion", "fashion is fun", "we are talking about fashion, right?",
 "i sure hope you are talking about fashion" ];
var moviesArr = [ "i have seen many movies", "movies are fun", "movies!", "i like watching movies",
 "i can give you movie recommendations" ];
var foodArr = [ "food is great", "i cant eat food", "food is delicious", "i wish i could eat food", 
"pizza is my favorite food" ];

function setup() {

  createCanvas( 400, 500 );
  background ( '#202020' );

  chatInput = createInput( '' );
  chatInput.style( 'margin-left', '90px' );
  chatInput.size ( 200 );

  chatBtn = createButton( "Send" );
  chatBtn.style( 'margin-left', '90px' );
  chatBtn.mousePressed( sendChat );
  chatBtn.addClass ( 'btn' );

  socket = io.connect( 'http://localhost:3000' );
  socket.on( 'guess', getGuess );
}

function sendChat() {
  if ( chatInput.value() == "" ) return;
  socket.emit( 'guess', chatInput.value() ); 
  chatMsgs.push( chatInput.value() );
  chatInput.value ( '' );
}

function getGuess ( data ) {
  // get a response
  if ( data == 'music' ) chatMsgs.push ( musicArr [ Math.floor( Math.random() * musicArr.length ) ] );
  else if ( data == 'sports' ) chatMsgs.push ( sportArr [ Math.floor( Math.random() * musicArr.length ) ] );
  else if ( data == 'food' ) chatMsgs.push ( foodArr [ Math.floor( Math.random() * foodArr.length ) ] );
  else if ( data == 'movies' ) chatMsgs.push ( moviesArr [ Math.floor( Math.random() * moviesArr.length ) ] );
  else if ( data == 'fashion' ) chatMsgs.push ( fashionArr [ Math.floor( Math.random() * fashionArr.length ) ] );
  // redraw the messages adding new ones
  drawMsgs();
}

function drawMsgs() {

  background ( '#202020' );
  textSize ( 15 );
  // display the latest 22 messages
  var startIndex = 0;
  if ( chatMsgs.length > 22 ) { startIndex = chatMsgs.length - 22; }

  for ( var i = 0; startIndex < chatMsgs.length; ++startIndex, ++i ) {
    if ( i % 2 == 0 ) fill ( '#ffffff' );
    else fill ( '#4586ff' );
    text( chatMsgs[ startIndex ], 20, 40 + 20 * i );
  }
}
