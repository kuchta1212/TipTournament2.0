﻿import authService from './../api-authorization/AuthorizeService'

const requestInitDefaults = {
    credentials: 'same-origin'
} as RequestInit;

async function getGetRequestInitRequired() {
    return {
        method: 'GET',
        headers: await getHeaders()
    } as RequestInit;
}

async function getPostRequestInitRequired() {
    let headers = await getHeaders();
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

export async function post(
    url: string,
    body?: object,
): Promise<Response> {
    const getPostRequestInit = await getPostRequestInitRequired()
    return fetch(url, {
        ...requestInitDefaults,
        ...getPostRequestInit,
        body: JSON.stringify(body)
    });
}

async function getHeaders() {
    const headers = new Headers();
    const token = await authService.getAccessToken();
    headers.append('Authorization', `Bearer ${token}`);
    return headers;
}