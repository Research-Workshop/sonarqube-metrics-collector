import {execSync} from "child_process";
import fs from "fs";
import {parse} from 'csv-parse';

import {GLOBALS} from "../globals";
import {generateTraceId} from "../util/tracer";

const getCommits = async ({src, branch}) => {
    const bpt = GLOBALS.BPT_PATH
    // bpt commits -src=$PROJECT_ROOT/case-studies/vscode/code -branch=main -output=/tmp/data.csv
    const output = `/tmp/data-${generateTraceId()}.csv`
    const cmd = `${bpt} commits -src=${src} -branch=${branch} -output=${output}`
    // run the command with proper error handling
    return createCSVFileStream({cmd, output})
}

const getCommitMessages = async ({src, branch}) => {
    const bpt = GLOBALS.BPT_PATH
    // bpt commits -src=$PROJECT_ROOT/case-studies/vscode/code -branch=main -output=/tmp/data.csv
    const output = `/tmp/data-${generateTraceId()}.csv`
    const cmd = `${bpt} commit_messages -src=${src} -branch=${branch} -output=${output}`
    // run the command with proper error handling
    return createCSVFileStream({
        cmd, output, parseOptions: {
            delimiter: "-=-=-=",
            record_delimiter: "--=--=--=",
        }
    })
}

const createCSVFileStream = ({cmd, output, parseOptions = {}}) => {
    // run the command with proper error handling
    try {
        execSync(cmd, {stdio: "inherit"})
        return (onEvents) => {
            const pipeline = fs.createReadStream(output)
                .pipe(parse(parseOptions))
            Object.entries(onEvents).forEach(([event, handler]) => {
                pipeline.on(event, handler)
            })
            return pipeline
        }
    } catch (err) {
        console.error(err)
    }
}

export const api = {
    getCommits,
    getCommitMessages
}