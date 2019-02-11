var axios = require('axios');

const trello_api_url = "https://api.trello.com/1";

exports.Mark = async (boardId, boardName, apiKey, apiToken) => {
    let newBoardName = boardName + " [PREVIOUS_RETRO]";
    console.log("New board name = " + newBoardName);

    let response = await axios.put(
        trello_api_url + "/boards/" + boardId + 
        "?name=" + newBoardName + 
        "&key=" + apiKey + "&token=" + apiToken);

    return true;
}  