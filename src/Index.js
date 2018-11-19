require('dotenv').config();
var BoardReader = require("./BoardReader");
var Email = require("./Email");
var BoardFormatter = require("./PrettyPrinter");
var DeleteBoards = require("./DeleteBoards");

/**
 * 
 * @param {string} boardId The id of the board you want to send in the email
 * @param {string} trello_api_key Your Trello API key
 * @param {string} trello_api_token Your Trello API token
 * @param {[string]} recipients A list of all the people you want the email to be sent to
 */
async function endRetroFunctionHandler (boardId, trello_api_key, trello_api_token, recipients, deleteBoards) {
    const auth = "key=" + trello_api_key + "&token=" + trello_api_token;

    var boardName = await BoardReader.GetBoardTitle(boardId, auth);
    var boardJson = await BoardReader.ReadBoard(boardId, auth);

    var messageBody = BoardFormatter.FormatHTML(boardJson);

    recipients = recipients.join();
    try {
        var emailResponse = await Email.Send(recipients, boardName, messageBody);
    } catch (error) {
        console.log("foo");
        return ({statusCode: 500, body: error});
    }
        
    var deleted = "deleteBoards argument not provided.";
    if (deleteBoards != null) {
        let deleteAge = deleteBoards.delete_before_date;
        let orgName = deleteBoards.organisation_short_name;
        let deleteResponse = await DeleteBoards.deleteBoardsByDate(deleteAge, orgName, auth);
        if (deleteResponse.error == false) {
             deleted = deleteResponse.delete ? "Successfully deleted " + deleteResponse.deletedBoards //Or "Successfully deleted 3 board(s)"
                                             : "There were no boards that haven't been modified since " + deleteAge + " so none were deleted";
        }
    }

    console.log(deleted)
    response = "Email sent of board: " + boardName + "\n" + deleted; 

    return ({statusCode: 200, body: response});
}

exports.EndRetro = async (event, context) => {
    var body = JSON.parse(event.body); 

    if (Object.keys(body).length != 5) {
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
        return(null, {statusCode: 400, body: errMsg});
    }

    var boardId = body.board_id;
    var trello_api_key = body.api_key;
    var trello_api_token = body.api_token;
    var recipients = body.recipients;
    var deleteBoards = body.delete_old_boards? body.delete_old_boards : null;

    var response = await endRetroFunctionHandler(boardId, trello_api_key, trello_api_token, recipients, deleteBoards);
    return (null, response);
}