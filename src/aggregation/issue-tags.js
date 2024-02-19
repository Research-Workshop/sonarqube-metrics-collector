import {GLOBALS} from "../globals";

const newIssuesByTagCount = async () => {
    const db = GLOBALS.DB_CLIENT.db("metrics");
    await db.collection("new_issues").aggregate([
            {$unwind: '$tags'},
            {
                $group: {
                    _id: '$tags',
                    project: {$first: '$project'},
                    count: {$sum: 1},
                },
            },
            {$merge: "new_issues_by_tag_count"}
        ],
    ).toArray()
}

const resolvedIssuesByTagCount = async () => {
    const db = GLOBALS.DB_CLIENT.db("metrics");
    await db.collection("resolved_issues").aggregate([
            {$unwind: '$tags'},
            {
                $group: {
                    _id: '$tags',
                    project: {$first: '$project'},
                    count: {$sum: 1},
                },
            },
            {$merge: "resolved_issues_by_tag_count"}
        ],
    ).toArray()
}

export const aggregations = {
    newIssuesByTagCount,
    resolvedIssuesByTagCount
}