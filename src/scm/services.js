import {api as mongoApi} from "../mongodb/api";
import {api} from "./api";

const saveCommits = async ({projectKey, src, branch = "main"}) => {

    const commitStream = await api.getCommits({src, branch})

    // send commits in batches
    const commitBatchLimit = 500
    let commitBatch = [];
    let order = 0;
    await new Promise((resolve, reject) => commitStream({
        data: (data) => {
            const [hash, author, time, parentHashes] = data;
            commitBatch.push({
                _id: hash,
                projectKey,
                branch,
                author,
                time,
                parent: parentHashes.trim() === "" ? [] : parentHashes.trim().split(" "),
                order: order++,
            })
            if (commitBatch.length === commitBatchLimit) {
                mongoApi.storeCommits({commits: commitBatch})
                commitBatch = []
                console.log(`finished ${order} commits`)
            }
        },
        end: () => {
            if (commitBatch.length > 0) {
                mongoApi.storeCommits({commits: commitBatch})
            }
            console.log("processing done")
        },
        error: (err) => {
            console.error(err)
            reject(err)
        },
        close: () => {
            console.log("stream closed")
            resolve()
        }
    }))
    console.log("func done")
}

export const services = {
    saveCommits
}