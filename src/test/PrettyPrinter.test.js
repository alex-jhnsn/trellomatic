const PrettyPrinter = require("../PrettyPrinter");

describe("When FormatHTML is called", () => {
    test("And given a valid JSON object and the object is correctly formatted, the function should return a string containin the board in HTML format", () => {
        var testBoard = JSON.parse('{[{"ListName":"Test List","Positon":65535,"Cards":[{"Name":"Test Card","Actions":["Test Comment"]},{"Name":"Test Card 2","Actions":[]}]},{"ListName":"Test List 2","Positon":131071,"Cards":[]}]}')
        console.error(testBoard);
        var expected = "<html><body><h1>Start</h1><h1>Stop</h1></body></html>";

        var result = PrettyPrinter.FormatHTML(testBoard);
        expect(result).toEqual(expected);
    });

    test("And given a valid JSON object and the object is incorrectly formatted, the function should return an error", () => {
        var testBoard = "";
        var result = PrettyPrinter.FormatHTML(testBoard);
        expect(result).toEqual("<html><hr><p style=${footerTextStyle}>TRELLOMATIC<br><3</p></body></html>");
    });

    test("And given an invalid JSON object the function should return an invalid JSON error", () => {
        var result = PrettyPrinter.FormatHTML("foo");
        expect(result).toContain("Error:");
    });
});