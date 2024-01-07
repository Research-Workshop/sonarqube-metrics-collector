import axios from "axios";
import {GLOBALS} from "../globals";
import {constants} from "./sonarqube.constants"
import {runCommand} from "../util/command";

const runAnalysis = ({project, src, tag, ext}) => {
    // bpt sonarqube_analysis -src= -tag=1.33.0 -key=vscode -url=http://localhost:9000 -token=squ_b30f63460de86ab5cbe68cd3ef25898c4c7c416b -ext=/extensions/sonarqube_analysis-generic.sh
    const cmd = `bpt sonarqube_analysis -src=${src} -tag=${tag} -key=${project} -url=${GLOBALS.SONARQUBE_URL} -token=${GLOBALS.SONARQUBE_TOKEN} -ext=${ext}`
    runCommand({cmd, exitOnError: true})
}

/* ======================== WEB APIs ======================== */
const client = axios.create({
    baseURL: `${GLOBALS.SONARQUBE_URL}/api`,
    auth: {
        username: GLOBALS.SONARQUBE_TOKEN,
    },
    maxBodyLength: Infinity
});

const getQualityGateStatus = async ({projectKey}) => {
    const res = await client.get(`/qualitygates/project_status?projectKey=${projectKey}`)
    return res.data.projectStatus
}

const getMeasures = async ({projectKey}) => {
    const res = await client.get(`/measures/component`, {
        params: {
            component: projectKey,
            metricKeys: constants.ALL_METRIC_KEYS
        }
    })
    return res.data.component.measures
}

const getIssues = async ({projectKey, newCode = true, page = 1, pageSize = 500}) => {
    const params = {
        componentKeys: projectKey,
        p: page,
        ps: pageSize,
        facets: constants.ALL_ISSUE_FACETS,
    }
    if (newCode) {
        params.inNewCodePeriod = true
    }
    const res = await client.get("/issues/search", {params})
    const {facets, paging, issues} = res.data
    return {facets, paging, issues}
}

const getSecurityHotspots = async ({projectKey, newCode = true, page = 1, pageSize = 500}) => {
    const params = {
        projectKey,
        p: page,
        ps: pageSize,
    }
    if (newCode) {
        params.inNewCodePeriod = true
    }
    const res = await client.get("/hotspots/search", {params})
    const {paging, hotspots} = res.data
    return {paging, hotspots}
}

export const api = {
    runAnalysis,
    getQualityGateStatus,
    getMeasures,
    getIssues,
    getSecurityHotspots
}