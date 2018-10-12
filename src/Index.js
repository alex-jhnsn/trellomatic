require('dotenv').config();
var BoardReader = require("./BoardReader");
var Email = require("./Email");
var HtmlFormatter = require("./PrettyPrinter");

function foo (boardId, trello_api_key, trello_api_token, recipients) {
    return new Promise((resolve, reject) => {
        const auth = "key=" + trello_api_key + "&token=" + trello_api_token;

        var boardName = BoardReader.GetBoardTitle(boardId, auth);
        var boardJson = BoardReader.ReadBoard(boardId, auth);
        var boardInfo = Promise.all([boardName, boardJson]);

        boardInfo.then(value => {
            var messageBody = HtmlFormatter.FormatHTML(value[1]);
            Email.Send(recipients, value[0], messageBody);
        }).then(() => {
            const response = {
                statusCode: 200,
                body: "Run"
            };
            resolve ({
                statusCode: 200,
                body: "test"
            });
        });
    });
}

exports.EndRetro = (event, context, callback) => {
    var body = JSON.parse(event.body);
    var boardId = body.board_id;
    var trello_api_key = body.api_key;
    var trello_api_token = body.api_token;
    var recipients = body.recipients;

    foo = foo(boardId, trello_api_key, trello_api_token, recipients);
    foo.then(res => {
        callback(null, res);
    });
}