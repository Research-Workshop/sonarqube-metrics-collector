import {api} from "./sonarqube.api"
import {operations} from "./sonarqube.operation";

const createMeasures = async ({project, projectKey, version}) => {
    const measures = await api.getMeasures({projectKey})
    await operations.createMeasures({project, version, measures})
}

const createFacets = async ({project, projectKey, version}) => {
    const facets = await api.getFacets({projectKey})
    const facetProperties = facets.map(({property, values}) => ({
        project,
        version,
        property,
        values
    }))
    await operations.createFacetProperties({facetProperties})
}

const createIssues = async ({project, projectKey, version}) => {
    const issuesStream = await api.getIssues({projectKey})
    for await (const data of issuesStream) {
        const {issues: issuesArr} = data
        const issues = issuesArr.map(({
                                          author,
                                          component,
                                          creationDate,
                                          debt,
                                          flows,
                                          hash,
                                          key,
                                          line,
                                          rule,
                                          scope,
                                          severity,
                                          status,
                                          tags,
                                          textRange,
                                          type
                                      }) => ({
            _id: key,
            project,
            version,
            author,
            component,
            creationDate,
            debt,
            flows,
            hash,
            line,
            rule,
            scope,
            severity,
            status,
            tags,
            textRange,
            type
        }))
        await operations.createIssues({issues})
    }
}

const createSecurityHotspots = async ({project, projectKey, version}) => {
    const hotspotsStream = await api.getSecurityHotspots({projectKey})
    for await (const data of hotspotsStream) {
        const {hotspots: hotspotsArr} = data
        const hotspots = hotspotsArr.map(({
                                              author,
                                              component,
                                              creationDate,
                                              flows,
                                              key,
                                              line,
                                              ruleKey: rule,
                                              securityCategory,
                                              status,
                                              textRange,
                                              vulnerabilityProbability,
                                          }) => ({
            _id: key,
            project,
            version,
            author,
            component,
            creationDate,
            flows,
            line,
            rule,
            securityCategory,
            status,
            textRange,
            vulnerabilityProbability,
        }))
        await operations.createSecurityHotspots({hotspots})
    }
}

export const services = {
    createMeasures,
    createFacets,
    createIssues,
    createSecurityHotspots
}