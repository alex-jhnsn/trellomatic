var axios = require('axios');
var readActionables = require('./ReadActionables')

const trello_api_url = "https://api.trello.com/1";

/**
 * @async
 * @returns {string} the boolean value true or an error response message if there was an error
 * @param {string} boardId The id for the new retro board
 * @param {string} org The shortname for organisation you want to find the previous retro board in, you need access to the organisation for this to work
 * @param {string} apiKey Your Trello api key
 * @param {string} apiToken Your Trello api token
 */
exports.createActionables = async (boardId, org, apiKey, apiToken) => {
    let actionables = await readActionables.readActionables(org, apiKey, apiToken);

    if (actionables.hasOwnProperty("statusCode"))
        return actionables;

    let createListResponse = await axios.post(trello_api_url + 
        "/lists?name=Previous Actions&idBoard=" + boardId + 
        "&pos=top&key=" + apiKey + "&token=" + apiToken );

    if (createListResponse.status !== 200) {
        return {statusCode: 500, body: "Error creating Actionables list, delete your new board and try again."};
    }

    let listId = createListResponse.data.id;

    let createdActionables = await Promise.all(actionables.map(async actionable => {
        let actionText = actionable.name + " - " + actionable.actions;

        let createCardResponse = await axios.post(trello_api_url 
            + "/cards?name=" + actionText 
            + "&idList=" + listId 
            + "&key=" + apiKey + "&token=" + apiToken);

        if (createCardResponse.status === 200)
            return true;
        return false;
        
    }));

    if (createdActionables.filter(v => v).length !== actionables.length) {
        return {statusCode: 500, body: "Error creating one or more of the actionables, delete your new board and try again."}
    }

    return true;

}