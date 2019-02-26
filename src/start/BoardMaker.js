var axios = require('axios');
var createActionables = require('./CreateActionables');
var getMembers = require('./GetMembers');

const trello_api_url = 'https://api.trello.com/1';

/**
 * @param {string} boardName 
 * @param {string} backgroundId
 * @param {[string]} listNames
 * @param {bool} actionables
 * @param {string} org
 * @param {string} apiKey
 * @param {string} apiToken
 */
exports.handle = async (boardName, backgroundId, listNames, actionables, org, apiKey, apiToken) => {

    let newBoardId = await this.createBoard(boardName, backgroundId, org, apiKey, apiToken);

    if (newBoardId === null) {
        return new Error('Failed to create new board');
    }

    let listsResult = await this.createLists(listNames, newBoardId, apiKey, apiToken);

    if (!listsResult) {
        return new Error('Failed to create one or more lists');
    }

    if (actionables) {
        let createActionablesResult = await createActionables.createActionables(newBoardId, org, apiKey, apiToken);

        if (!createActionablesResult) {
            return new Error('Failed to create actionables');
        }
    }

    let adminIds = await getMembers.getAdminMemberIds(org, apiKey, apiToken);
    let memberIds = await getMembers.getNormalMemberIds(org, apiKey, apiToken);

    await Promise.all(adminIds, memberIds);

    let addAdminsResult = await this.addMembers(adminIds, newBoardId, 'admin', apiKey, apiToken);
    if (!addAdminsResult) {
        return new Error('Failed to add admin members');
    }

    let addMembersResult = await this.addMembers(memberIds, newBoardId, 'admin', apiKey, apiToken);
    if (!addMembersResult) {
        return new Error('Failed to add normal members');
    }

    return newBoardId;
};

/**
 * @param {string} boardName 
 * @param {string} backgroundId
 * @param {string} org
 * @param {string} apiKey
 * @param {string} apiToken
 */
exports.createBoard = async (boardName, backgroundId, org, apiKey, apiToken) => {
    try { 
        let createBoardResponse = await axios.post(trello_api_url + 
            '/boards?name=' + boardName + '&defaultLabels=false&defaultLists=false&idOrganization=' + org +
            '&prefs_permissionLevel=org&powerUps=voting&prefs_voting=members&prefs_background=' + backgroundId +
            '&key=' + apiKey + '&token=' + apiToken );

        return createBoardResponse.data.id;

    } catch (error) {
        console.error(error);
        return null;
    }
};

/**
 * @returns {boolean} true if all lists are added successfully and false if any fail
 * @param {[string]} listNames
 * @param {string} boardId
 * @param {string} apiKey
 * @param {string} apiToken
 */
exports.createLists = async (listNames, boardId, apiKey, apiToken) => {
    let listsResult = await Promise.all(listNames.map(async (listName, index) => {
        try {
            console.log(index);

            await axios.post(trello_api_url +
                '/boards/' + boardId +'/lists?name=' + listName +'&pos=' + index + 
                '&key=' + apiKey + '&token=' + apiToken);

            return true;
        } catch (error) {
            return false;   
        }    
    }));

    if (listsResult.filter(v => v).length === listNames.length)
        return true;
    
    return false;
};

/**
 * @returns {boolean} true if all members are added successfully and false if any fail
 * @param {[string]} memberIds
 * @param {string} boardId
 * @param {string} membershipType Either `normal` or `admin`
 * @param {string} apiKey
 * @param {string} apiToken
 */
exports.addMembers = async (memberIds, boardId, membershipType, apiKey, apiToken) => {
    let result = await Promise.all(memberIds.map(async id => {
        try {
            await axios.put(trello_api_url 
                + '/boards/' + boardId + '/members/' + id + '?type=' + membershipType +
                '&key=' + apiKey + '&token=' + apiToken);

            return true;
        } catch (error) {
            return false;
        }
    }));

    if (result.filter(v => v).length === memberIds.length)
        return true;

    return false;
};