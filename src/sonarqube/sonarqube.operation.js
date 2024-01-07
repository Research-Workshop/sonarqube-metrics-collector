import {GLOBALS} from "../globals";

async function createMeasures({project, version, measures}) {
    const db = GLOBALS.DB_CLIENT.db("metrics");
    const commitsCollection = db.collection("measures");
    await commitsCollection.insertOne({
        _id: version,
        project,
        measures
    });
}

export const operations = {
    createMeasures
}