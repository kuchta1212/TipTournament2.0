﻿import { HttpStatusCode } from '../../typings';

const getRequestError = (response: Response, body: string) => `[Response error]:\nstatus: ${response.status} \nurl: ${response.url} \nbody: ${body}`;


export async function convert<T>(responsePromise: Promise<Response>): Promise<T> {
    let response: Response;
    try {
        response = await responsePromise;
    } catch (e) {
        console.log(e);
        throw e;
    }

    //if (!response.ok) {
    //    console.log("Http call failed")
    //    console.log(response);
    //    return {} as T;
    //}

    if (response.status === HttpStatusCode.NoContent) { return {} as T; }

    let result: string = '';
    try {
        result = await response.text();
        return JSON.parse(result);
    } catch (e) {
        console.log(`${await getRequestError(response, result)}\n failed when parsing output: ${e}`)
        throw e;
    }
}