var axios = require("axios");

const trello_api_url = "https://api.trello.com/1";

/**
 * @async
 * @returns {string} Id of the board marked with \[PREVIOUS_RETRO]
 * @param {string} org The shortname for organisation you want to find boards in, you need access to the organisation for this to work
 * @param {string} apiKey Your Trello api key
 * @param {string} apiToken Your Trello api token
 */
exports.getPreviousBoards = async (org, apiKey, apiToken) => {
    let response = await axios.get(trello_api_url + '/organizations/' + org + '/boards', {
        params: {
            filter:"open",
            fields:"id,name",
            key: apiKey,
            token: apiToken
        }
    });

    let openBoards = response.data;

    let previousBoards = openBoards.filter(board => board.name.includes("[PREVIOUS_RETRO]"));

    console.log(previousBoards);

    return previousBoards;
}