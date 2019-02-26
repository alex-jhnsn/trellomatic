var axios = require('axios');

const trello_api_url = 'https://api.trello.com/1';

/**
 * Converts the contents of the board into a specifically formatted JSON object.
 * @returns {string}
 * @param {string} boardId The id of the board you want to send in the email.
 * @param {string} auth A string in the format: key="YOUR_KEY_HERE"&token="YOUR_TOKEN_HERE".
 */ 
exports.ReadBoard = async function (boardId, apiKey, apiToken) {
    let getListsResponse = await axios.get(trello_api_url + '/boards/' + boardId + '/lists',
        {
            params: {
                fields:'id,name,pos',
                key: apiKey,
                token: apiToken
            }
        });

    let lists = getListsResponse.data.filter(
        list => {
            if (list.name == 'Previous Actions')
                return false;
            return true;
        });

    let listsObject = await Promise.all(lists.map(async list => {
        let position = list.pos;
        var cards = [];

        let getCardsResponse = await axios.get(trello_api_url + '/lists/' + list.id + '/cards', 
        {
            params: {
                fields: 'name',
                actions: 'commentCard&',
                key: apiKey,
                token: apiToken
            }
        });

        let cardsDto = getCardsResponse.data;

        cardsDto.forEach(item => {
            let card = {Name: item.name, Actions: []};
            if (item.actions) {
                item.actions.forEach(action => {
                    card.Actions.push(action.data.text);
                }); 
            } 
            cards.push(card);  
        });

        return  {ListName: list.name, Positon: position, Cards: cards};      
    }));

    listsObject.sort((a, b) => {
        a.Positon - b.Positon;
    });

    var json = JSON.stringify(listsObject);
    console.log(json);
    return json;
}

/**
 * Gets the title of the trello board from the id provided
 * @returns {string}
 * @param {string} boardId The id of the board you want to send in the email.
 * @param {string} auth A string in the format: key="YOUR_KEY_HERE"&token="YOUR_TOKEN_HERE".
 */
exports.GetBoardTitle = async function(boardId, apiKey, apiToken) {
    let response = await axios.get(trello_api_url + '/boards/' + boardId, {
        params: {
            fields:'id,name',
            key: apiKey,
            token: apiToken
        }
    });

    let boardData = response.data;
    return boardData.name;
}
