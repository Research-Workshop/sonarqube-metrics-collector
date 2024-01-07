import {MongoClient} from "mongodb";
import {GLOBALS} from "../globals";

export const initializeDb = async () => {
    const url = GLOBALS.MONGO_URL;
    GLOBALS.DB_CLIENT = await MongoClient.connect(url);
}

export const closeDb = async () => {
    await GLOBALS.DB_CLIENT.close();
}