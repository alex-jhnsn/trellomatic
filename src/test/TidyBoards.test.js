const TidyBoards = require('../TidyBoards');

describe("When given a threshold in a valid datetime format", () => {
    test("a list of board ids to be deleted should be returned", () => {
        let testBoards = [
            {
                "name": "Test Board 2018-10-03",
                "id": "should_be_deleted"
            },
            {
                "name": "Test Board 2018-10-16",
                "id": "shouldn't_be_in_list"
            },
            {
                "name": "Test Board 2018-10-31",
                "id": "shouldn't_be_in_list"
            }
        ];
        let testThreshold = "2018-10-10";

        result = TidyBoards.getEligableBoards(testBoards, testThreshold); 

        expect(result).toEqual(["should_be_deleted"]);
    });
});