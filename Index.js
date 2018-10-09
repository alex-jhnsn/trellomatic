require('dotenv').config();
var BoardReader = require("./BoardReader");

//To Be Imported From Siri Shortcut
const boardId = process.env.TRELLO_BOARD_ID;
const trello_api_key = process.env.TRELLO_API_KEY;
const trello_api_token = process.env.TRELLO_API_TOKEN;

const auth = "key=" + trello_api_key + "&token=" + trello_api_token;

//POST emails from SIRI shortcut?
var emails = ["alextheviking@hotmail.co.uk"];

// var res = curl lambda url
// var url = new URL(res.url)
// var boardId = url.searchParams.get("boardId");

var boardJson = BoardReader.ReadBoard(boardId, auth);

boardJson.then(value => {
    console.log(value);
})
