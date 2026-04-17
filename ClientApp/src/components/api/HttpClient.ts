const requestInitDefaults = {
    credentials: 'same-origin'
} as RequestInit;

function getGetRequestInit(): RequestInit {
    return {
        method: 'GET'
    };
}

function getPostRequestInit(): RequestInit {
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
}

export async function get(
    url: string,
): Promise<Response> {
    return fetch(url, {
        ...requestInitDefaults,
        ...getGetRequestInit()
    });
}

export async function post(
    url: string,
    body?: object,
): Promise<Response> {
    return fetch(url, {
        ...requestInitDefaults,
        ...getPostRequestInit(),
        body: JSON.stringify(body)
    });
}
