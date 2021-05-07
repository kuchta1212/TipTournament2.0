
export const requestInitDefaults = {
    credentials: 'same-origin'
} as RequestInit;

export function getPostRequestInitRequired() {
    return {
        method: 'POST',
        headers: getHeaders()
    } as RequestInit;
}

export function getGetRequestInitRequired() {
    return {
        method: 'GET',
        headers: getHeaders()
    } as RequestInit;
}

export function getPostRequestJsonInitRequired() {
    var headers = getHeaders();
    headers.delete('Content-Type');
    headers.append('Content-Type', 'application/json');
    return {
        method: 'POST',
        headers: headers
    } as RequestInit;
}

export function get(
    url: string,
    options?: RequestInit
): Promise<Response> {
    return fetch(url, {
        ...requestInitDefaults,
        ...options,
        ...getGetRequestInitRequired()
    });
}

export function post(
    url: string,
    body?: object,
    options?: RequestInit
): Promise<Response> {
    return fetch(url, {
        ...requestInitDefaults,
        ...options,
        ...getPostRequestInitRequired(),
        body: JSON.stringify(body)
    });
}

export function postJson(
    url: string,
    body?: object,
    options?: RequestInit
): Promise<Response> {
    return fetch(url, {
        ...requestInitDefaults,
        ...options,
        ...getPostRequestJsonInitRequired(),
        body: JSON.stringify(body)
    });
    }

function getHeaders() {
    const headers = new Headers();
    //headers.append('Authorization', `Bearer ${getAdalToken()}`);
    return headers;
}