var h1Style = "\"color: #111; font-family: sans-serif; font-size: 20px; font-weight: bold; letter-spacing: -1px; line-height: 1; text-align: left;\"";
var h2Style = "\"color: #111; font-family: sans-serif; font-size: 16px; font-weight: 300; text-align: left;\"";
var h3Style = "\"color: #111; font-family: sans-serif; font-size: 16px; font-weight: 300; text-align: left;\"";
var footerTextStyle = "\"color: #111; font-family: sans-serif; font-weight: 300; text-align: center\""
var pStyle = "\"color: #111; font-family: sans-serif; font-size: 14px; font-weight: 300; text-align: left; padding-bottom: 30px\"";
var bodyStyle = "\"background-color: #FFF\"";
var divStyle = "\"background-colour: #F6BD60\"; padding: 100px";
var hrStyle = "\"border-top: 1px solid #111; width: 60%; margin: 40px auto \""

module.exports = {
    FormatHTML: function (board) {
        var body = `<html><body style=${bodyStyle}><p style=${pStyle}>Here are the actions from todays retro:</p>`;
        board = JSON.parse(board);
        board.forEach(list => {
            body = body + `<div style=${divStyle}><h1 style=${h1Style}>` + list.ListName + "</h1>" + "<ul>";

            if (!list.Cards.length)
                body = body + `There were no cards in ${list.ListName}`;

            list.Cards.forEach(card => {
                body = body + `<li><h2 style=${h2Style}>` + card.Name + "</h2></li>";
                if (card.Actions.length) {
                    body = body + "<h3>Actions:</h3> <ul>";

                    card.Actions.forEach(action => {
                        body = body + `<li style=${pStyle}>` + action + "</li>";
                    });
                    body = body + "</ul>";
                }
            });

            body = body + `</ul></div><hr style=${hrStyle}>`;
        });
        body = body + `<p style=${footerTextStyle}>TRELLOMATIC<br><3</p></body></html>`;
        return body;
    },
    FormatPlainText: function (board) {
        var text = "";
        board = JSON.parse(board);
        board.forEach(list => {
            text = text + list.ListName + "\r\n";
            
            list.Cards.forEach(card => {
                text = text + " -" + card.Name + "\r\n";
                if (card.Actions.length) {
                    text = text + "  Actions:\r\n";

                    card.Actions.forEach(action => {
                        text = text + "   -" + action + "\r\n";
                    });
                }
            });
        });
        return text;
    }
}