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

    if (Object.keys(body).length != 7) {
        var missingValues = "Missing values: ";
        
        if (!body.hasOwnProperty("board_id")) {
            missingValues = missingValues + "board_id ";
        }

        if (!body.hasOwnProperty("api_key")) {
            missingValues = missingValues + "api_key ";
        }

        if (!body.hasOwnProperty("api_token")) {
            missingValues = missingValues + "api_token ";
        }

        if (!body.hasOwnProperty("recipients")) {
            missingValues = missingValues + "recipients ";
        }

        if (!body.hasOwnProperty("tidy")) {
            missingValues = missingValues + "tidy ";
        }

        if (!body.hasOwnProperty("delete_board_age_threshold")) {
            missingValues = missingValues + "delete_board_age_threshold ";
        }

        if (!body.hasOwnProperty("org_name")) {
            missingValues = missingValues + "org_name ";
        }

        console.log(missingValues);
        callback(null, {statusCode: 400, body: missingValues});
    }

    var boardId = body.board_id;
    var trello_api_key = body.api_key;
    var trello_api_token = body.api_token;
    var recipients = body.recipients;
    var tidy = body.tidy;
    var threshold = body.delete_board_age_threshold;
    var orgName = body.org_name;

    foo = func(boardId, trello_api_key, trello_api_token, recipients, tidy, threshold, orgName);
    foo.then(res => {
        callback(null, res);
    });
}