var axios = require('axios');
var getBoard = require('./GetPreviousBoards')

const trello_api_url = "https://api.trello.com/1";

/**
 * @returns {void}
 * @param {string} org The shortname for organisation you want to find boards in, you need access to the organisation for this to work
 * @param {string} apiKey Your Trello api key
 * @param {string} apiToken Your Trello api token
 */
exports.readActionables = async (org, apiKey, apiToken) => {

    let previousBoards = await getBoard.getPreviousBoards(org, apiKey, apiToken);

    if (previousBoards.length === 0) {
        return ({statusCode: 404, body: "No boards marked as [PREVIOUS_RETRO] found, see documentation for more info"});
    }

    if (previousBoards.length > 1) {
        return ({statusCode: 200, body: "Multiple boards marked as [PREVIOUS_RETRO] found, have a look at your trello account"});
    }

    let previousBoardId = previousBoards[0].id;
    let response = await axios.get(trello_api_url + '/boards/' + previousBoardId + "/cards", {
        params: {
            filter:"open",
            fields:"name",
            actions:"commentCard",
            key: apiKey,
            token: apiToken
        }
    });

    let cards = response.data;

    return cards.filter(card => {
        if (card.actions.length === 0) {
            return false;
        }
        return true;
    }).map(card => {
        let actions = card.actions.map(action => {
            return action.data.text;
        });
        return {name: card.name, actions: actions};
    });
}