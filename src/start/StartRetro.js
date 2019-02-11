var createBoard = require('./CreateBoard');
var deleteBoard = require('./DeleteBoard');

function validateInput (body) {
    if (Object.keys(body).length !== 7) {
        let errMsg = "Error bad request: ";
        let missingValues = [];

        if (!body.hasOwnProperty("board_name")) {
            missingValues.push("board_name");
        }

        if (!body.hasOwnProperty("background_id")) {
            missingValues.push("background_id");
        }

        if (!body.hasOwnProperty("list_names")) {
            missingValues.push("list_names");
        }

        if (!body.hasOwnProperty("actionables")) {
            missingValues.push("actionables");
        }

        if (!body.hasOwnProperty("org")) {
            missingValues.push("org");
        }

        if (!body.hasOwnProperty("api_key")) {
            missingValues.push("api_key");
        }

        if (!body.hasOwnProperty("api_token")) {
            missingValues.push("api_token");
        }

        if (missingValues.length) {
            errMsg += "Missing required value(s): ";
            missingValues.forEach(value => {
                errMsg += value + ", ";
            });
            let trimmed = errMSg = errMsg.slice(0, -2);
            console.log(errMsg);
            return ({valid: false, message: trimmed});
        }
    }
    return ({valid: true, message: ""});
}

exports.Main = async (event, context) => {
    let body = JSON.parse(event.body); 

    if (body === null)
        return (null, {statusCode: 400, body: "Missing request body"});

    let report = validateInput(body);

    if (report.valid === false)
        return (null, {statusCode: 400, body: report.message});

    let result = await createBoard.createBoard(
        body.board_name, body.background_id, body.list_names, 
        body.actionables, body.org, body.api_key, body.api_token
    );

    //only delete if rest of board process worked
    await deleteBoard.delete(body.org, body.api_key, body.api_token);

    let message = "Successfully created board with id: " + result; 

    return (null, {statusCode: 200, body: message});
}