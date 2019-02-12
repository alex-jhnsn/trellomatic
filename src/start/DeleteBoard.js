var axios = require("axios");
var getBoard = require("./GetPreviousBoards")

const trello_api_url = "https://api.trello.com/1";

/**
 * @async
 * @returns {object} The boolean value true or a response message indicating what went wrong
 * @param {string} org The shortname for organisation you want to find boards in, you need access to the organisation for this to work
 * @param {string} apiKey Your Trello api key
 * @param {string} apiToken Your Trello api token
 */
exports.delete = async (org, apiKey, apiToken) => {

    let toDelete = await getBoard.getPreviousBoards(org, apiKey, apiToken);

    if (toDelete.length === 0) {
        return ({statusCode: 404, body: "No boards marked as previous board found, see documentation for more info"});
    } 
    
    if (toDelete.length > 1) {
        return ({statusCode: 200, body: "Multiple boards marked as [PREVIOUS_RETRO] found, have a look at your trello account"});
    }

    let toDeleteId = toDelete[0].id;

    let deleteBoardsResponse = await axios.delete(trello_api_url + "/boards/" + toDeleteId, {
        params: {
            key: apiKey,
            token: apiToken
        }
    });

    return true;
}
