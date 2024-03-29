import fs from "fs";
import {parse} from 'csv-parse';

import {GLOBALS} from "../globals";
import {generateTraceId} from "../util/tracer";
import {runCommand} from "../util/command";

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
            delimiter: "***===***",
            record_delimiter: ":::===:::",
            quote: false
        }
    })
}

const getCommitIdOfTag = ({src, tag}) => {
    const cmd = `git -C ${src} rev-list -n 1 ${tag}`
    // return runCommand({cmd}).toString().trim()
    const output = runCommand({
        cmd,
        options: {
            stdio: "pipe"
        }
    })
    return output.toString().trim()
}

const createCSVFileStream = ({cmd, output, parseOptions = {}}) => {
    runCommand({cmd})
    return fs.createReadStream(output)
        .pipe(parse(parseOptions))
}

export const api = {
    getCommits,
    getCommitMessages,
    getCommitIdOfTag
}