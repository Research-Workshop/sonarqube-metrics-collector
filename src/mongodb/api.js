import {GLOBALS} from "../globals";

async function createCommits({commits}) {
    try {
        const db = GLOBALS.DB_CLIENT.db("metrics");
        const commitsCollection = db.collection('commits');
        await commitsCollection.insertMany(commits);
    } finally {
    }
}

async function updateCommitMessagesWithIssueTags(batch) {
    try {
        const db = GLOBALS.DB_CLIENT.db("metrics");
        const commitsCollection = db.collection('commits');
        const bulk = batch.map(({_id, message, tagged_issues}) => ({
            updateOne: {
                filter: {_id},
                update: {
                    $set: {
                        message,
                        tagged_issues
                    }
                }
            }
        }))
        await commitsCollection.bulkWrite(bulk, {ordered: false})
    } finally {
    }
}

export const api = {
    createCommits,
    updateCommitMessagesWithIssueTags
}