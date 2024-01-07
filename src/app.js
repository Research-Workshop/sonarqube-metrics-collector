import path from "path";
import {api as sonarqubeApi} from "./sonarqube/sonarqube.api"
import {api as gitApi} from "./scm/scm.api"
import {closeDb, initializeDb} from "./mongodb/mongo.database"
import {services as scmServices} from "./scm/scm.service"

const project = "microsoft-vscode";
const projectBaseDir = "/home/noman637/Projects/Research/software-metrics-systematic-study/case-studies/vscode";
const src = path.join(projectBaseDir, "code");
const scripts = path.join(projectBaseDir, "scripts");
const branch = "main";

await initializeDb()

// step 1: create commits
await scmServices.createCommits({project, src, branch})
// step 2: update commit messages
await scmServices.updateCommitMessages({project, src, branch})
// step 3: run sonarqube analysis
// sonarqubeApi.runAnalysis({
//     project,
//     src,
//     tag: "1.30.1",
//     ext: path.join(scripts, "bpt-ext-sonarqube_analysis.sh")
// })

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
