import axios from "axios";
import {GLOBALS} from "../globals";
import {constants} from "./constants"

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
    getQualityGateStatus,
    getMeasures,
    getIssues,
    getSecurityHotspots
}