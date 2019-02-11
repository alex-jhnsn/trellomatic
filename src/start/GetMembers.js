var axios = require("axios");

const trello_api_url = "https://api.trello.com/1";

/**
 * @async
 * @returns {[string]} A list of all members ids for the organisation provided
 * @param {string} org The shortname for organisation you want to find members in, you need access to the organisation for this to work
 * @param {string} apiKey Your Trello api key
 * @param {string} apiToken Your Trello api token
 */
exports.getAllMemberIds = async (org, apiKey, apiToken) => {
    let getMembersResponse = await axios.get(trello_api_url + "/organizations/" + org + "/members/all", {
        params: {
            key: apiKey,
            token: apiToken
        }
    });
    
    let members = getMembersResponse.data;
    return members.map(member => {
        return member.id;
    });
}

/**
 * @async
 * @returns {[string]} A list of the admin members ids for the organisation provided
 * @param {string} org The shortname for organisation you want to find members in, you need access to the organisation for this to work
 * @param {string} apiKey Your Trello api key
 * @param {string} apiToken Your Trello api token
 */
exports.getNormalMemberIds = async (org, apiKey, apiToken) => {
    let getMembersResponse = await axios.get(trello_api_url + "/organizations/" + org + "/members/normal", {
        params: {
            key: apiKey,
            token: apiToken
        }
    });
    
    let members = getMembersResponse.data;
    return members.map(member => {
        return member.id;
    });
}

/**
 * @async
 * @returns {[string]} A list of the normal team member ids for the organisation provided
 * @param {string} org The shortname for organisation you want to find members in, you need access to the organisation for this to work
 * @param {string} apiKey Your Trello api key
 * @param {string} apiToken Your Trello api token
 */
exports.getAdminMemberIds = async (org, apiKey, apiToken) => {
    let getMembersResponse = await axios.get(trello_api_url + "/organizations/" + org + "/members/admins", {
        params: {
            key: apiKey,
            token: apiToken
        }
    });
    
    let members = getMembersResponse.data;
    return members.map(member => {
        return member.id;
    });
}