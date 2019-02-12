let testAxios = require('axios');
let getPreviousBoards = require('../start/GetPreviousBoards');

test('When a previous retro board is found should return a list with the board id and name', async () => {
    let expected = [
        {
            name: 'Board [PREVIOUS_RETRO]', 
            id: '5bd9b632bf5efc0aea281c91'
        }
    ];

    testAxios.get.mockImplementationOnce(() => Promise.resolve({
        data: [
            {
                'name': 'Board [PREVIOUS_RETRO]',
                'id': '5bd9b632bf5efc0aea281c91'
            },
            {
                'name': 'Bored Board',
                'id': '5beaef4198a8e052e867627a'
            },
            {
                'name': 'Card Board',
                'id': '5c0f7f054256cd3d1cd0cc4c'
            }
        ]
    }));

    let result = await getPreviousBoards.getPreviousBoards('org', 'key', 'token');

    expect(result).toEqual(expected);
});

test('When multiple previous retro boards are found should return a list with multiple board ids and names', async () => {
    let expected = [
        {
            name: 'Board [PREVIOUS_RETRO]', 
            id: '5bd9b632bf5efc0aea281c91'
        },
        {
            name: 'Board2 Electric Boogaloo [PREVIOUS_RETRO]',
            id: '5fhepif2bf5efc0afihf1c91'
        }
    ];

    testAxios.get.mockImplementationOnce(() => Promise.resolve({
        data: [
            {
                'name': 'Board [PREVIOUS_RETRO]',
                'id': '5bd9b632bf5efc0aea281c91'
            },
            {
                'name': 'Board2 Electric Boogaloo [PREVIOUS_RETRO]',
                'id': '5fhepif2bf5efc0afihf1c91'
            },
            {
                'name': 'Card Board',
                'id': '5c0f7f054256cd3d1cd0cc4c'
            }
        ]
    }));

    let result = await getPreviousBoards.getPreviousBoards('org', 'key', 'token');

    expect(result).toEqual(expected);
});

test('When no previous boards are found should return an empty list', async () => {
    testAxios.get.mockImplementationOnce(() => Promise.resolve({
        data: [
            {
                'name': 'Board',
                'id': '5bd9b632bf5efc0aea281c91'
            },
            {
                'name': 'Card Board',
                'id': '5fhepif2bf5efc0afihf1c91'
            },
            {
                'name': 'Bored Board',
                'id': '5c0f7f054256cd3d1cd0cc4c'
            }
        ]
    }));

    let result = await getPreviousBoards.getPreviousBoards('org', 'key', 'token');
    expect(result).toEqual([]);
});

test('When the request returns an error should return null', async () => {
    testAxios.get.mockImplementationOnce(() => Promise.reject({
        status: 401,
        data: 'unauthorized organization.'
    }));

    let result = await getPreviousBoards.getPreviousBoards('org', 'key', 'token');
    expect(result).toEqual(null);
});