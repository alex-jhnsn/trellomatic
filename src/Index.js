require('dotenv').config();
var BoardReader = require("./BoardReader");
var Email = require("./Email");
var HtmlFormatter = require("./PrettyPrinter");

//To Be Imported From Siri Shortcut
const boardId = process.env.TRELLO_BOARD_ID;
const trello_api_key = process.env.TRELLO_API_KEY;
const trello_api_token = process.env.TRELLO_API_TOKEN;

const auth = "key=" + trello_api_key + "&token=" + trello_api_token;

//POST emails from SIRI shortcut?

var recipients = process.env.RECIPIENTS;

// var res = curl lambda url
// var url = new URL(res.url)
// var boardId = url.searchParams.get("boardId");

var boardName = BoardReader.GetBoardTitle(boardId, auth);
var boardJson = BoardReader.ReadBoard(boardId, auth);

var test = Promise.all([boardName, boardJson]);

test.then(value => {
    var messageBody = HtmlFormatter.FormatHTML(value[1]);
    Email.Send(value[0], messageBody);
})
