var axios = require('axios');
var boardMaker = require('../start/BoardMaker');

// afterEach(() => {
//     axios.reset();
// });

describe('When calling createBoard', async () => {
    test('and the create board request is successful, the id of the board should be returned', async () => {
        axios.post.mockImplementationOnce(() => Promise.resolve({
            'data': {
                'id':'5c63d5ce4c1c165ca2205225',
                'name':'Test',
                'desc':'',
                'descData':null,
                'closed':false,
                'idOrganization':null
            }
        }));

        let result = await boardMaker.createBoard('name', 'background', 'org', 'key', 'token');

        expect(result).toEqual('5c63d5ce4c1c165ca2205225');
    });

    test('and the create board request fails, then null should be returned', async () => {
        axios.post.mockImplementationOnce(() => Promise.reject({
            'statusCode': 401,
            'data': 'unauthorized organization.'
        }));

        let result = await boardMaker.createBoard('name', 'background', 'org', 'key', 'token');
        expect(result).toEqual(null);
    });
});

describe('When calling create lists', async () => {
    
    // test('then the create list requests should be made in the correct order', async () => {
        
    //     let lists = ['One', 'Two', 'Three'];

    //     let mockPost = axios.post.mockImplementationOnce(() => Promise.resolve({
    //         data: { }
    //     }));
        
    //     await boardMaker.createLists(lists, 'id', 'key', 'token');

    //     expect(mockPost.mock.calls.length).toBe(3);
    //     expect(mockPost.mock.calls[0][0]).toContain(lists[0]);
    //     expect(mockPost.mock.calls[1][0]).toContain(lists[1]);
    //     expect(mockPost.mock.calls[2][0]).toContain(lists[2]);
        
    // });

    test('then when the lists are created successfully, then the function should return true', async () => {
        
        axios.post.mockImplementationOnce(() =>  Promise.resolve({
            status: 200,
            data: {
                'id': '5c6a67f4ed0b99222f5c3117',
                'name': 'One',
                'closed': false,
                'idBoard': '5c630bde147a38862234c90e',
                'pos': 98304,
                'limits': {}
            }
        }));

        let result = await boardMaker.createLists(['One'], 'id', 'key', 'token');

        expect(result).toEqual(true);

    });

    test('then when a list fails to be created, then the function should return false', async () => {

        axios.post.mockImplementationOnce(() => Promise.resolve({
            status: 200,
            data: {  }
        }));
    
        axios.post.mockImplementationOnce(() => Promise.reject({
            status: 401
        }));
    
        let result = await boardMaker.createLists(['One', 'Two'], 'id', 'key', 'token');
        expect(result).toEqual(false);
    });
});

describe('When calling addMembers with two members', async () => {

    let memberIds = ['foo', 'bar'];

    test('and members are added successfully then the function should return true', async () => {

        console.log('start');

        let mockPut = axios.put.mockImplementationOnce(() => Promise.resolve({
            status: 200
        }));

        let result = await boardMaker.addMembers(memberIds, 'id', 'admin', 'key', 'token');

        expect(mockPut.mock.calls.length).toBe(2);
        expect(result).toBe(true);
    });

    // test('and members are not added successfully then the function should return false', async () => {

    //     let mockPut = axios.put.mockImplementationOnce(() => Promise.reject({
    //         status: 401
    //     }));

    //     let result = await boardMaker.addMembers(memberIds, 'id', 'admin', 'key', 'token');

    //     expect(mockPut.mock.calls.length).toBe(2);
    //     expect(result).toBe(false);
    // });
});


