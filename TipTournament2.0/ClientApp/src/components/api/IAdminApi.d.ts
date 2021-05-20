import { User } from "../../typings";

export interface IAdminApi {
    checkForUpdates(): Promise<number>;

    loadMatches(): Promise<number>;

    payed(userId: string, payed: boolean): Promise<void>;
}