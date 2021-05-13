import authService from './../api-authorization/AuthorizeService'

export const requestInitDefaults = {
    credentials: 'same-origin'
} as RequestInit;

export async function getPostRequestInitRequired() {
    return {
        method: 'POST',
        headers: await getHeaders()
    } as RequestInit;
}

export async function getGetRequestInitRequired() {
    return {
        method: 'GET',
        headers: await getHeaders()
    } as RequestInit;
}

export async function getPostRequestJsonInitRequired() {
    var headers = await getHeaders();
    headers.delete('Content-Type');
    headers.append('Content-Type', 'application/json');
    return {
        method: 'POST',
        headers: headers
    } as RequestInit;
}

export async function get(
    url: string,
): Promise<Response> {
    const getGetRequestInit = await getGetRequestInitRequired()
    return fetch(url, {
        ...requestInitDefaults,
        ...getGetRequestInit
    });
}

export function post(
    url: string,
    body?: object,
): Promise<Response> {
    return fetch(url, {
        ...requestInitDefaults,
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

async function getHeaders() {
    const headers = new Headers();
    const token = await authService.getAccessToken();
    headers.append('Authorization', `Bearer ${token}`);
    return headers;
}