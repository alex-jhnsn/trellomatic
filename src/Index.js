require('dotenv').config();
var BoardReader = require("./BoardReader");
var Email = require("./Email");
var HtmlFormatter = require("./PrettyPrinter");
var TidyBoards = require("./TidyBoards");

/**
 * 
 * @param {string} boardId The id of the board you want to send in the email
 * @param {string} trello_api_key Your Trello API key
 * @param {string} trello_api_token Your Trello API token
 * @param {[string]} recipients A list of all the people you want the email to be sent to
 */
function func (boardId, trello_api_key, trello_api_token, recipients, tidy, threshold, orgName) {
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
        }).then(() => {
            if (tidy == true) {
                TidyBoards.deleteBoards(threshold, auth, orgName)
            }
        })
    });
}

exports.EndRetro = (event, context, callback) => {
    var body = JSON.parse(event.body); 

    if (Object.keys(body).length != 4) {
        let errMsg = "Error bad request: ";
        let missingValues = [];
        
        if (!body.hasOwnProperty("board_id")) {
            missingValues.push("board_id");
        }

        if (!body.hasOwnProperty("api_key")) {
            missingValues.push("api_key");
        }

        if (!body.hasOwnProperty("api_token")) {
            missingValues.push("api_key");
        }

        if (!body.hasOwnProperty("recipients")) {
            missingValues.push("recipients");
        }

        if (missingValues.length) {
            errMsg += "Missing required value(s): ";
            missingValues.forEach(value => {
                errMsg += value + ", ";
            });
            errMsg.slice(0, -2);
            errMsg += "\n";
        }

        if (body.hasOwnProperty("delete_old_boards")) {
            let deleteOldBoards = body.delete_old_boards;

            if (!(deleteOldBoards.hasOwnProperty("delete_before_date") ||
            deleteOldBoards.hasOwnProperty("organisation_short_name"))) {
                errMsg += "Optional argument 'delete_old_boards' requires: delete_before_date and organisation_short_name";
            }
        }

        console.log(errMsg);
        callback(null, {statusCode: 400, body: missingValues});
    }

    var boardId = body.board_id;
    var trello_api_key = body.api_key;
    var trello_api_token = body.api_token;
    var recipients = body.recipients;
    var deleteBoards = body.tidy? body.tidy : null;

    foo = func(boardId, trello_api_key, trello_api_token, recipients, deleteBoards);
    foo.then(res => {
        callback(null, res);
    });
}