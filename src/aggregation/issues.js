import {GLOBALS} from "../globals";

const unresolvedIssues = ({oldVersion, newVersion}) => {
    const db = GLOBALS.DB_CLIENT.db("metrics");
    return db.collection("issues").aggregate([
            {$match: {version: {$in: [oldVersion, newVersion]}}},
            {$group: {_id: '$hash', issues: {$addToSet: '$$ROOT'}}},
            {$match: {issues: {$size: 2}}},
            {$unwind: '$issues'},
            {$replaceRoot: {newRoot: '$issues'}},
            {$match: {version: newVersion}}
        ],
    );
}

const resolvedIssues = async ({oldVersion, newVersion}) => {
    const db = GLOBALS.DB_CLIENT.db("metrics");
    await db.collection("issues").aggregate([
            {$match: {version: {$in: [oldVersion, newVersion]}}},
            {$group: {_id: '$hash', issues: {$addToSet: '$$ROOT'}}},
            {$match: {issues: {$size: 1}}},
            {$unwind: '$issues'},
            {$replaceRoot: {newRoot: '$issues'}},
            {$match: {version: oldVersion}},
            {$set: {version: newVersion}},
            {$merge: "resolved_issues"}
        ],
    ).toArray()
}

const newIssues = async ({oldVersion, newVersion}) => {
    const db = GLOBALS.DB_CLIENT.db("metrics");
    await db.collection("issues").aggregate([
            {$match: {version: {$in: [oldVersion, newVersion]}}},
            {$group: {_id: '$hash', issues: {$addToSet: '$$ROOT'}}},
            {$match: {issues: {$size: 1}}},
            {$unwind: '$issues'},
            {$replaceRoot: {newRoot: '$issues'}},
            {$match: {version: newVersion}},
            {$merge: "new_issues"}
        ],
    ).toArray()
}

export const aggregations = {
    unresolvedIssues,
    resolvedIssues,
    newIssues
}