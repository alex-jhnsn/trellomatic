require('dotenv').config();
var BoardReader = require("./BoardReader");
var Email = require("./Email");
var HtmlFormatter = require("./PrettyPrinter");

function func (boardId, trello_api_key, trello_api_token, recipients) {
    return new Promise((resolve, reject) => {
        const auth = "key=" + trello_api_key + "&token=" + trello_api_token;

        var boardName = BoardReader.GetBoardTitle(boardId, auth);
        var boardJson = BoardReader.ReadBoard(boardId, auth);
        var boardInfo = Promise.all([boardName, boardJson]);

        boardInfo.then(value => {
            var messageBody = HtmlFormatter.FormatHTML(value[1]);
            recipients = recipients.join();
            Email.Send(recipients, value[0], messageBody);
        }).then(() => {
            resolve ({
                statusCode: 200,
                body: "Email sent successfully"
            });
        });
    });
}

exports.EndRetro = (event, context, callback) => {
    var body = JSON.parse(event.body); 

    if (Object.keys(body).length != 4) {
        var missingValues = "Missing values:"
        
        if (!body.hasOwnProperty("board_id")) {
            missingValues = missingValues + "board_id "
        }

        if (!body.hasOwnProperty("api_key")) {
            missingValues = missingValues + "api_key "
        }

        if (!body.hasOwnProperty("api_token")) {
            missingValues = missingValues + "api_token "
        }

        if (!body.hasOwnProperty("recipients")) {
            missingValues = missingValues + "recipients "
        }

        console.log(missingValues);
        callback(null, {statusCode: 400, body: missingValues})
    }

    var boardId = body.board_id;
    var trello_api_key = body.api_key;
    var trello_api_token = body.api_token;
    var recipients = body.recipients;

    foo = func(boardId, trello_api_key, trello_api_token, recipients);
    foo.then(res => {
        callback(null, res);
    });
}

// exports.EndRetro = async (event) => {
//     var body = JSON.parse(event.body);
//     var boardId = body.board_id;
//     var trello_api_key = body.api_key;
//     var trello_api_token = body.api_token;
//     var recipients = body.recipients;

//     return await func(boardId, trello_api_key, trello_api_token, recipients);
// }