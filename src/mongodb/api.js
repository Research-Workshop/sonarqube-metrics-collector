import {getDb} from "./database";

async function storeCommits({commits}) {
    try {
        const db = await getDb();
        const commitsCollection = db.collection('commits');
        await commitsCollection.insertMany(commits);
    } finally {
    }
}

export const api = {
    storeCommits
}