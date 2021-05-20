import { IApi } from "./IApi";
import { Api } from "./Api";
import { IAdminApi } from "./IAdminApi";
import { AdminApi } from "./AdminApi";

export function getApi() : IApi {
    return new Api();
}

export function getAdminApi(): IAdminApi {
    return new AdminApi();
}