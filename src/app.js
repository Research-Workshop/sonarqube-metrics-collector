import path from "path";
import {closeDb, initializeDb} from "./mongodb/mongo.database"

import {api as scmApi} from "./scm/scm.api"
import {services as scmServices} from "./scm/scm.service"
import {api as sonarqubeApi} from "./sonarqube/sonarqube.api"
import {services as sonarqubeServices} from "./sonarqube/sonarqube.service"

const project = "microsoft-vscode";
const tag = "1.30.1"
const projectBaseDir = "/home/noman637/Projects/Research/software-metrics-systematic-study/case-studies/vscode";
const src = path.join(projectBaseDir, "code", "src");
const scripts = path.join(projectBaseDir, "scripts");
const branch = "main";
const version = scmApi.getCommitIdOfTag({src, tag})
const projectKey = `${project}---${version}`

await initializeDb()

// step 1: create commits
// try {
//     await scmServices.createCommits({project, src, branch})
// } catch (err) {
//     console.error(err)
// } finally {
//     await closeDb(false)
// }

// step 2: update commit messages
// try {
//     await scmServices.updateCommitMessages({project, src, branch})
// } catch (err) {
//     console.error(err)
// } finally {
//     await closeDb(false)
// }

// step 3: collect sonarqube analysis metrics
const tasks = [
    // step 3a: create sonarqube project
    // () => sonarqubeApi.createProject({projectKey}),
    // step 3b: run analysis
    // () => sonarqubeApi.runAnalysis({
    //     projectKey,
    //     src,
    //     version,
    //     ext: path.join(scripts, "bpt-ext-sonarqube_analysis.sh")
    // }),
    // step 3c: store all analysis metrics
    // () => sonarqubeServices.createMeasures({project, projectKey, version}),
];

for (const task of tasks) {
    try {
        await task()
    } catch (err) {
        console.error(err)
    } finally {
        await closeDb(false)
    }
}
// sonarqubeApi.runAnalysis({
//     project,
//     src,
//     tag: "1.30.1",
//     ext: path.join(scripts, "bpt-ext-sonarqube_analysis.sh")
// })
// step 3b: store all analysis metrics
// const metrics = await sonarqubeApi.getMeasures({projectKey: project})
// step 3c: delete sonarqube project
// await sonarqubeApi.deleteProject({project})

// const test = await sonarqubeApi.getMeasures({projectKey})
// const test = await sonarqubeApi.getIssues({projectKey, newCode: false})
// console.log(test.issues[50])
// console.log(test.paging)
// console.log(test.issues.length)
// console.log(JSON.stringify(test.facets, null, 2))
// const test = await sonarqubeApi.getSecurityHotspots({projectKey, newCode: false})
// console.log(test.hotspots.length)
// console.log(test.paging)
// console.log(test.hotspots[0])

// const getResult = await gitApi.getLogs({
//     src: "/home/noman637/Projects/Research/software-metrics-systematic-study/case-studies/vscode/code",
//     branch: "main"
// })
//
// getResult({
//     data: (data) => {
//         console.log(data)
//     },
//     end: () => {
//         console.log("end")
//     }
// })
await closeDb(false)
