const Index = require("../Index");
var aws = require("aws-sdk-mock");

describe("When the index EndRetro function is called", () => {
    
    let context = {};

    let body = {  
        "body":{  
           "api_key":"d8d3e6dbe741faa62ea3de160206b656",
           "api_token":"d994013bafa238a6307163da8647966926dc0accc0a8c27031a2a382c0d4cd8e",
           "board_id":"5bb4da67d4706a3a8cca7b9d",
           "recipients":[  
              "alextheviking@hotmail.co.uk"
           ]
        }
     };

     let event = body;

     event = JSON.stringify(body);

    callback = function (val) {
        return val;
    }

    test("With a missing api_key, a 400 response with a message saying missing api_key", () => {
        var result = Index.EndRetro(event, context, callback)
        expect(result).toBe({stausCode: 400, body: "Missing values: api_key"})
    });
});
