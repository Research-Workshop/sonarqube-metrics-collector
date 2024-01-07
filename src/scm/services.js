import {api as mongoApi} from "../mongodb/api";
import {api} from "./api";

const createCommits = async ({project, src, branch = "main"}) => {

    const commitStream = await api.getCommits({src, branch})
    let order = 0;
    await processStreamInBatch({
        stream: commitStream,
        transformItem: ([hash, author, time, parentHashes]) => ({
            _id: hash,
            project,
            branch,
            author,
            time,
            parent: parentHashes.trim() === "" ? [] : parentHashes.trim().split(" "),
            order: order++,
        }),
        processBatch: async (batch) => {
            await mongoApi.createCommits({commits: batch})
        }
    })
}

const updateCommitMessages = async ({projectKey, src, branch = "main"}) => {

    const commitMessageStream = await api.getCommitMessages({src, branch})

    // send commits in batches
    const issueRegex = /#(\d+)/g
    await processStreamInBatch({
        stream: commitMessageStream,
        transformItem: ([hash, subject, body]) => ({
            _id: hash.trim(),
            message: {
                subject: subject.trim(),
                body: body.trim()
            },
            tagged_issues: `${subject} ${body}`.match(issueRegex)?.map(issue => Number(issue.replace("#", ""))) ?? []
        }),
        processBatch: async (batch) => {
            await mongoApi.updateCommitMessagesWithIssueTags(batch)
        }
    })
}

const processStreamInBatch = async ({stream, batchSize = 500, transformItem, processBatch}) => {
    let batch = [];
    let i = 0;
    for await (const data of stream) {
        batch.push(await transformItem(data))

        if (batch.length !== batchSize) {
            continue;
        }

        try {
            await processBatch(batch);
            i += batchSize;
        } catch (err) {
            console.error(err)
        }

        console.log(`finished processing ${i} items`)
        batch = []
    }

    if (batch.length === 0) {
        return
    }

    try {
        await processBatch(batch);
        i += batch.length;
        console.log(`finished processing ${i} items`)
    } catch (err) {
        console.error(err)
    }
}

export const services = {
    createCommits,
    updateCommitMessages
}