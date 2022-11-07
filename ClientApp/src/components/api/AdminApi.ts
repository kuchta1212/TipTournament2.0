import { User } from "../../typings";
import { IAdminApi } from "./IAdminApi";
import { get, post } from "./HttpClient";
import { convert } from "./ResponseConvertor"

const API_URL = '/api/admin';

export class AdminApi implements IAdminApi {

    checkForUpdates(): Promise<number> {
        return convert<number>(get(`${API_URL}/matches/check/`));
    }

    loadMatches(): Promise<number> {
        return convert<number>(get(`${API_URL}/matches/load/`));
    }

    payed(userId: string, payed: boolean): Promise<void> {
        return convert<void>(post(`${API_URL}/${userId}/payed?payed=${payed}`));
    }
}