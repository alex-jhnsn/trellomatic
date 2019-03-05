require('dotenv').config();
var BoardReader = require('./BoardReader');
var Email = require('./Email');
var BoardFormatter = require('./PrettyPrinter');
var BoardMarker = require('./BoardMarker');

/**
 * 
 * @param {string} boardId The id of the board you want to send in the email
 * @param {string} apiKey Your Trello API key
 * @param {string} apiToken Your Trello API token
 * @param {[string]} recipients A list of all the people you want the email to be sent to
 */
async function endRetroFunctionHandler (boardId, apiKey, apiToken, recipients) {
    var boardName = await BoardReader.GetBoardTitle(boardId, apiKey, apiToken);
    var boardJson = await BoardReader.ReadBoard(boardId, apiKey, apiToken);

    var messageBody = BoardFormatter.FormatHTML(boardJson);

    recipients = recipients.join();
    try {
        await Email.Send(recipients, boardName, messageBody);
    } catch (error) {
        console.log('foo');
        return ({statusCode: 500, body: error});
    }
        
    let response = await BoardMarker.Mark(boardId, boardName, apiKey, apiToken);

    response = 'Email sent of board: ' + boardName;

    return ({statusCode: 200, body: response});
}

exports.Main = async (event, context) => {
    var body = JSON.parse(event.body); 

    //Remove this and check if list is null
    if (Object.keys(body).length != 4) {
        let errMsg = 'Error bad request: ';
        let missingValues = [];
        
        if (!body.hasOwnProperty('board_id')) {
            missingValues.push('board_id');
        }

        if (!body.hasOwnProperty('api_key')) {
            missingValues.push('api_key');
        }

        if (!body.hasOwnProperty('api_token')) {
            missingValues.push('api_key');
        }

        if (!body.hasOwnProperty('recipients')) {
            missingValues.push('recipients');
        }

        if (missingValues.length) {
            errMsg += 'Missing required value(s): ';
            missingValues.forEach(value => {
                errMsg += value + ', ';
            });
            errMsg.slice(0, -2);
            errMsg += '\n';
        }

        console.log(errMsg);
        return(null, {statusCode: 400, body: errMsg});
    }

    var boardId = body.board_id;
    var trello_api_key = body.api_key;
    var trello_api_token = body.api_token;
    var recipients = body.recipients;

    var response = await endRetroFunctionHandler(boardId, trello_api_key, trello_api_token, recipients);
    return (null, response);
};