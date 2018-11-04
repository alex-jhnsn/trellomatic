var fetch = require("node-fetch");

const trello_api_url = "https://api.trello.com/1";

module.exports = { 
    /**
     * Converts the contents of the board into a specifically formatted JSON object.
     * @returns {string}
     * @param {string} boardId The id of the board you want to send in the email.
     * @param {string} auth A string in the format: key="YOUR_KEY_HERE"&token="YOUR_TOKEN_HERE".
     */ 
    ReadBoard: function (boardId, auth) {
        return fetch(trello_api_url + "/boards/" + boardId + "/lists?fields=id,name,pos&" + auth)
        .then(response => {
            return response.json();
        })
        .then(lists => {
            var foo =
                lists.map(list => {
                    var position = list.pos
                    return fetch(trello_api_url + "/lists/" + list.id + "/cards?fields=name&actions=commentCard&" + auth)  
                    .then(response => {
                        return response.json();
                    })
                    .then(data => {
                        var cards = [];
                        data.forEach(item => {
                            card = {Name: item.name, Actions: []};
                            if (item.actions) {
                                item.actions.forEach(action => {
                                    card.Actions.push(action.data.text);
                                }); 
                            } 
                            cards.push(card);  
                        })
                        return  {ListName: list.name, Positon: position, Cards: cards};                         
                    })
                });
            return Promise.all(foo);     
        })
        .then(listsObject => {
            listsObject.sort((a, b) => {
                a.Positon - b.Positon
            });
            //console.log(listsObject);
            var json = JSON.stringify(listsObject);
            console.log(json);
            return json;
        })
        .catch(err => {
            console.log("Error: " + err);
        });
    },
    /**
     * Gets the title of the trello board from the id provided
     * @returns {string}
     * @param {string} boardId The id of the board you want to send in the email.
     * @param {string} auth A string in the format: key="YOUR_KEY_HERE"&token="YOUR_TOKEN_HERE".
     */
    GetBoardTitle: function(boardId, auth) {
        return fetch(trello_api_url + "/boards/" + boardId + "?fields=id,name&" + auth)
        .then(response => {
            return response.json();
        })
        .then(data => {
            return data.name;
        })
        .catch(err => {
            console.log("Error: " + err);
        });
    }
}
