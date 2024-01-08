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

async function createFacetProperties({facetProperties}) {
    const db = GLOBALS.DB_CLIENT.db("metrics");
    const commitsCollection = db.collection("facets");
    await commitsCollection.insertMany(facetProperties);
}

async function createIssues({issues}) {
    const db = GLOBALS.DB_CLIENT.db("metrics");
    const commitsCollection = db.collection("issues");
    await commitsCollection.insertMany(issues);
}

async function createSecurityHotspots({hotspots}) {
    const db = GLOBALS.DB_CLIENT.db("metrics");
    const commitsCollection = db.collection("hotspots");
    await commitsCollection.insertMany(hotspots);
}

export const operations = {
    createMeasures,
    createFacetProperties,
    createIssues,
    createSecurityHotspots
}