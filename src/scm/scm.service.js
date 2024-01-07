import {operations} from "./scm.operation";
import {api} from "./scm.api";
import {processStreamInBatch} from "../util/stream";

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
            await operations.createCommits({commits: batch})
        }
    })
}

const updateCommitMessages = async ({src, branch = "main"}) => {

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
            await operations.updateCommitMessagesWithIssueTags(batch)
        }
    })
}

export const services = {
    createCommits,
    updateCommitMessages
}