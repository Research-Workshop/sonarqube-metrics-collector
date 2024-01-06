import {MongoClient} from "mongodb";
import {GLOBALS} from "../globals";

const url = GLOBALS.MONGO_URL;
export const dbClient = new MongoClient(url);

export const getDb = async () => {
    await dbClient.connect();
    return dbClient.db("metrics");
}