var fetch = require("node-fetch");

const trello_api_url = "https://api.trello.com/1";

module.exports = { 
    deleteBoards: function(threshold, auth, orgName) {
        return fetch(trello_api_url + 
            "/organizations/" + orgName + "/boards?filter=open&fields=id%2Cname&" + 
            auth)
        .then(response => {
            return response.json();
        })
        .then(boards => {
            console.log("hi");
            let toDelete = this.getEligableBoards(boards, threshold);
            console.log("Boards to delete " + toDelete);
            toDelete.forEach(board => {
                return fetch(trello_api_url + /boards/ + board + "?" + auth, {
                    method: "DELETE"
                }).then(response => {
                    return response.json();
                }).then(data => {
                    console.log(data);
                });
            });
        });
    },
    getEligableBoards: function(boards, threshold) {
        let toDelete = [];
        boards.forEach(board => {
            //put error handling around threshold not being in right format?
            var boardDate = Date.parse(board.name.slice(-10));
            console.log(threshold)
            var thresholdDate = Date.parse(threshold);

            console.log("boardDate = " + boardDate + " thresholdDate = " + thresholdDate);
            if (boardDate < thresholdDate) {
                console.log("board name = " + board.name)
                toDelete.push(board.id);
            }
        });
        return toDelete;
    }
}
