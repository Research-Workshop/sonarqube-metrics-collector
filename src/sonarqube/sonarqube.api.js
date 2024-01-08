import axios from "axios";
import qs from "qs";
import {Readable} from "stream";

import {GLOBALS} from "../globals";
import {runCommand} from "../util/command";

import {constants} from "./sonarqube.constants"

const runAnalysis = ({projectKey, src, version, ext}) => {
    // bpt sonarqube_analysis -src= -tag=1.33.0 -key=vscode -url=http://localhost:9000 -token=squ_b30f63460de86ab5cbe68cd3ef25898c4c7c416b -ext=/extensions/sonarqube_analysis-generic.sh
    const cmd = `bpt sonarqube_analysis -src=${src} -version=${version} -key=${projectKey} -url=${GLOBALS.SONARQUBE_URL} -token=${GLOBALS.SONARQUBE_TOKEN} -ext=${ext}`
    runCommand({cmd})
}

/* ======================== WEB APIs ======================== */
const client = axios.create({
    baseURL: `${GLOBALS.SONARQUBE_URL}/api`,
    auth: {
        username: GLOBALS.SONARQUBE_TOKEN,
    },
    maxBodyLength: Infinity
});

const createProject = async ({projectKey, branch}) => {
    let data = qs.stringify({
        project: projectKey,
        name: projectKey,
        branch
    });

    await client.post('/projects/create', data, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
}

const deleteProject = async ({projectKey}) => {
    await client.post(`/projects/delete?project=${projectKey}`);
}

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
const getFacets = async ({projectKey, newCode = false}) => {
    const params = {
        componentKeys: projectKey,
        facets: constants.ALL_ISSUE_FACETS,
        ps: 1
    }
    if (newCode) {
        params.inNewCodePeriod = true
    }
    const res = await client.get("/issues/search", {params})
    const {facets} = res.data
    return facets
}

const getIssues = async ({projectKey, newCode = false, page = 1, pageSize = 500}) => {
    const params = {
        componentKeys: projectKey,
        p: page,
        ps: pageSize,
    }
    if (newCode) {
        params.inNewCodePeriod = true
    }
    return await createPaginatedStream({
        url: "/issues/search",
        method: "get",
        params,
    })
}

const getSecurityHotspots = async ({projectKey, newCode = false, page = 1, pageSize = 500}) => {
    const params = {
        projectKey,
        p: page,
        ps: pageSize,
    }
    if (newCode) {
        params.inNewCodePeriod = true
    }
    return await createPaginatedStream({
        url: "/hotspots/search",
        method: "get",
        params
    })
}

const createPaginatedStream = async ({url, method, data, params}) => {
    async function* fetchData() {
        const response = await client.request({
            url,
            method,
            data,
            params,
        })
        const {paging, ...rest} = response.data
        yield rest

        const currentPage = paging.pageIndex
        const totalPages = Math.ceil(paging.total / paging.pageSize)
        for (let i = currentPage + 1; i <= totalPages; i++) {
            const response = await client.request({
                url,
                method,
                data,
                params: {
                    ...params,
                    p: i
                }
            })
            const {paging, ...rest} = response.data
            yield rest
        }
    }

    return new Readable.from(fetchData())
}

export const api = {
    runAnalysis,
    createProject,
    deleteProject,
    getQualityGateStatus,
    getMeasures,
    getFacets,
    getIssues,
    getSecurityHotspots
}