import path from "path";
import {closeDb, initializeDb} from "./mongodb/mongo.database"

import {api as scmApi} from "./scm/scm.api"
import {services as scmServices} from "./scm/scm.service"
import {api as sonarqubeApi} from "./sonarqube/sonarqube.api"
import {services as sonarqubeServices} from "./sonarqube/sonarqube.service"
import {aggregations as issuesAggregation} from "./aggregation/issues";
import {aggregations as metricsAggregation} from "./aggregation/issue-tags";

const project = "axios";
const projectBaseDir = "/home/noman637/Projects/Research/software-metrics-systematic-study/case-studies/axios";
const src = path.join(projectBaseDir, "code");
const scripts = path.join(projectBaseDir, "scripts");
const branch = "v1.x";

await initializeDb()

// step 1: create commits
// try {
//     await scmServices.createCommits({project, src, branch})
// } catch (err) {
//     console.error(err)
//     await closeDb(false)
//     process.exit(1)
// }
//
// // step 2: update commit messages
// try {
//     await scmServices.updateCommitMessages({project, src, branch})
// } catch (err) {
//     console.error(err)
//     await closeDb(false)
//     process.exit(1)
// }

// step 3: collect sonarqube analysis metrics
const tagsStr = "v0.1.0 v0.2.0 v0.2.1 v0.2.2 v0.3.0 v0.3.1 v0.4.0 v0.4.1 v0.4.2 v0.5.0 v0.5.1 v0.5.2 v0.5.3 v0.5.4 v0.6.0 v0.7.0 v0.8.0 v0.8.1 v0.9.0 v0.9.1 v0.10.0 v0.11.0 v0.11.1 v0.12.0 v0.13.0 v0.13.1 v0.14.0 v0.15.0 v0.15.1 v0.15.2 v0.15.3 v0.16.0 v0.16.1 v0.16.2 v0.17.0 v0.17.1 v0.18.0 v0.18.1 v0.19.0 v0.19.1 v0.19.2 v0.20.0 v0.21.0 v0.21.1 v0.21.2 v0.21.4 v0.22.0 v0.23.0 v0.24.0 v0.25.0 v0.26.0 v0.26.1 v0.27.0 v0.27.1 v0.27.2 v1.0.0 v1.1.0 v1.1.1 v1.1.2 v1.1.3 v1.2.0 v1.2.1 v1.2.2 v1.2.3 v1.2.4 v1.2.5 v1.2.6 v1.3.0 v1.3.1 v1.3.2 v1.3.3 v1.3.4 v1.3.5 v1.3.6 v1.4.0 v1.5.0 v1.5.1 v1.6.0 v1.6.1 v1.6.2 v1.6.3 v1.6.4 v1.6.5"
const tags = tagsStr.split(" ")
for(const tag of tags) {
    console.log(`Processing tag: ${tag}`)
    const version = scmApi.getCommitIdOfTag({src, tag})
//     // const projectKey = `${project}---${version}`
    console.log(`Version: ${version}`)
//
// const tasks = [
//     // step 3a: create sonarqube project
//     () => sonarqubeApi.createProject({projectKey}),
//     // step 3b: run analysis
//     () => sonarqubeApi.runAnalysis({
//         projectKey,
//         src,
//         version,
//         ext: path.join(scripts, "sonarqube_analysis.sh")
//     }),
//     // step 3c: store all analysis metrics
//     () => sonarqubeServices.createMeasures({project, projectKey, version}),
//     () => sonarqubeServices.createFacets({project, projectKey, version}),
//     () => sonarqubeServices.createIssues({project, projectKey, version}),
//     () => sonarqubeServices.createSecurityHotspots({project, projectKey, version}),
//     // step 4: delete sonarqube project
//     () => sonarqubeApi.deleteProject({projectKey})
// ];
//
//     for (const task of tasks) {
//         try {
//             await task()
//         } catch (err) {
//             console.error(err)
//             console.log(`Error while processing tag: ${tag}`)
//             await closeDb(false)
//             process.exit(1)
//         }
//     }
}

// step 4: Analyze metrics by commit
// aggregations.newIssues({oldVersion, newVersion})
// loop through the tags and compare immediately previous tag
for (let i = 1; i < tags.length; i++) {
    const oldTag = tags[i - 1]
    const newTag = tags[i]
    const oldVersion = scmApi.getCommitIdOfTag({src, tag: oldTag})
    const newVersion = scmApi.getCommitIdOfTag({src, tag: newTag})
    console.log(`Comparing ${oldTag} with ${newTag}`)
    await issuesAggregation.newIssues({oldVersion, newVersion})
    await issuesAggregation.resolvedIssues({oldVersion, newVersion})
}

// step 5: get the metrics
// await metricsAggregation.newIssuesByTagCount()
// await metricsAggregation.resolvedIssuesByTagCount()

await closeDb(false)
