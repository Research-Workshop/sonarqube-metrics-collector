import {api as sonarqubeApi} from "./sonarqube/api"
import {api as gitApi} from "./scm/api"

const projectKey = "vscode";
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