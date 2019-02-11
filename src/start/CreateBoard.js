//Add voting power up to the board
//https://api.trello.com/1/boards/id/powerUps?value=voting

var axios = require("axios");
var createActionables = require("./CreateActionables");
var getMembers = require("./GetMembers");

const trello_api_url = "https://api.trello.com/1";

/**
 * @param {string} boardName 
 * @param {string} backgroundId
 * @param {[string]} listNames
 * @param {bool} actionables
 * @param {string} org
 * @param {string} apiKey
 * @param {string} apiToken
 */
exports.createBoard = async (boardName, backgroundId, listNames, actionables, org, apiKey, apiToken) => {

    
    let createBoardResponse = await axios.post(trello_api_url + 
        "/boards?name=" + boardName + "&defaultLabels=false&defaultLists=false&idOrganization=" + org +
        "&prefs_permissionLevel=org&powerUps=voting&prefs_voting=members&prefs_background=" + backgroundId +
        "&key=" + apiKey + "&token=" + apiToken );
        
    let newBoardId = createBoardResponse.data.id;
        
    let listsResult = await Promise.all(listNames.map(async listName => {
        let createListResponse = await axios.post(trello_api_url +
            "/boards/" + newBoardId +"/lists?name=" + listName +"&pos=bottom" + 
            "&key=" + apiKey + "&token=" + apiToken);
            
            if (createListResponse.status === 200)
            return true;
            return false;    
        }));

    if (listsResult.filter(v => v).length !== listNames.length)
        return {statusCode: 500, body: "Error creating one or more lists"};
    
    if (actionables) {
        let createActionablesResult = await createActionables.createActionables(newBoardId, org, apiKey, apiToken);
    }

    let adminIds = await getMembers.getAdminMemberIds(org, apiKey, apiToken);
    let memberIds = await getMembers.getNormalMemberIds(org, apiKey, apiToken);

    let addAdminsResult = await Promise.all(adminIds.map(async id => {
        let addAdminsResponse = await axios.put(trello_api_url 
            + "/boards/" + newBoardId + "/members/" + id + "?type=admin" +
            "&key=" + apiKey + "&token=" + apiToken);

        if (addAdminsResponse.status === 200)
            return true;
        return false; 
    }));

    let addMembersResult = await Promise.all(memberIds.map(async id => {
        let addMembersResponse = await axios.put(trello_api_url 
            + "/boards/" + newBoardId + "/members/" + id + "?type=normal" +
            "&key=" + apiKey + "&token=" + apiToken);

        if (addMembersResponse.status === 200)
            return true;
        return false; 
    }));

    return newBoardId;
}