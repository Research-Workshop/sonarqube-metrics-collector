import {api as sonarqubeApi} from "./sonarqube/api"
import {api as gitApi} from "./scm/api"
import {closeDb, initializeDb} from "./mongodb/database"
import {services as scmServices} from "./scm/services"

const project = "microsoft/vscode";
const src = "/home/noman637/Projects/Research/software-metrics-systematic-study/case-studies/vscode/code";
const branch = "main";

await initializeDb()

// step 1: create commits
// await scmServices.createCommits({project, src, branch})
// step 2: update commit messages
await scmServices.updateCommitMessages({project, src, branch})

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
console.log("done")
// sleep for 5 seconds
// await new Promise(resolve => setTimeout(resolve, 5000))
await closeDb(false)
console.log("closed db")
