var fetch = require("node-fetch");

const trello_api_url = "https://api.trello.com/1";

module.exports = {  
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
            var json = JSON.stringify(listsObject);
            return json;
        });
    }
}
