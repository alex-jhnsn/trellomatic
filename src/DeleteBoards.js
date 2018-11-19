var fetch = require("node-fetch");

const trello_api_url = "https://api.trello.com/1";

module.exports = { 
    deleteBoardsByDate: async function(threshold, orgName, auth) {
        let boards = await fetch(
                trello_api_url + "/organizations/" + orgName + 
                "/boards?filter=open&fields=id&" + 
                auth).then(response => { return response.json(); });

        let boardDatePromises = boards.map(board => {
            return fetch(trello_api_url + "/boards/" + board.id + "/actions?fields=date&" + auth)
                .then(response => response.json())
                .then(json => { return json[0].date })
                .then(date => {
                    return {
                        id: board.id,
                        date
                    }
                });
        });

        let boardDates = await Promise.all(boardDatePromises);
        let toDelete = this.getEligableBoardsByDate(boardDates, threshold);

        if (toDelete.length == 0)
            return ({delete: false, error: false, deletedBoards: 0});

        toDelete.forEach(async (board) => {
            let deleteResponse = await fetch(trello_api_url + "/boards/" + board + "?" + auth, {
                method: "DELETE"
            });
            let response = deleteResponse.json();
            if (response == "error")
                console.log("should be some form of an error here")
        });

        return ({delete: true, error: false, deletedBoards: 1})
    },  
    getEligableBoardsByDate: function(boards, threshold) {
        let toDelete = [];
        boards.forEach(board => {
            var boardDate = Date.parse(board.date);
            var thresholdDate = Date.parse(threshold);

            if (boardDate < thresholdDate) {
                toDelete.push(board.id);
            }
        });
        return toDelete;
    }
}
