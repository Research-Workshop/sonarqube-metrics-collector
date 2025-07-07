import path from "path";
import {closeDb, initializeDb} from "./mongodb/mongo.database"

import {api as scmApi} from "./scm/scm.api"
import {services as scmServices} from "./scm/scm.service"
import {api as sonarqubeApi} from "./sonarqube/sonarqube.api"
import {services as sonarqubeServices} from "./sonarqube/sonarqube.service"
import {aggregations as issuesAggregation} from "./aggregation/issues";
import {aggregations as metricsAggregation} from "./aggregation/issue-tags";

const project = "jquery";
const projectBaseDir = "/home/noman637/Projects/Research/software-metrics-systematic-study/case-studies/jquery";
const src = path.join(projectBaseDir, "code");
const scripts = path.join(projectBaseDir, "scripts");
const branch = "3.7.1";

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
const tagsStr = "1.0.1 1.0.2 1.0.3 1.0.4 1.1.1 1.1.2 1.1.3 1.1.4 1.2.1 1.2.2 1.2.3 1.2.4 1.2.5 1.2.6 1.3.0 1.3.1 1.3.2 1.4.0 1.4.1 1.4.2 1.4.3 1.4.4 1.5.0 1.5.1 1.5.2 1.6.0 1.6.1 1.6.2 1.6.3 1.6.4 1.7.0 1.7.1 1.7.2 1.8.0 1.8.1 1.8.2 1.8.3 1.9.0 1.9.1 1.10.0 1.10.1 1.10.2 1.11.0 1.11.1 1.11.2 1.11.3 1.12.0 1.12.1 1.12.2 1.12.3 1.12.4 2.0.0 2.0.1 2.0.2 2.0.3 2.1.0 2.1.1 2.1.2 2.1.3 2.1.4 2.2.0 2.2.1 2.2.2 2.2.3 2.2.4 3.0.0 3.1.0 3.1.1 3.2.0 3.2.1 3.3.0 3.3.1 3.4.0 3.4.1 3.5.0 3.5.1 3.6.0 3.6.1 3.6.2 3.6.3 3.6.4 3.7.0 3.7.1"
// const tagsStr = "3.7.1"
const tags = tagsStr.split(" ")
for (const tag of tags) {
  console.log(`Processing tag: ${tag}`)
  const version = scmApi.getCommitIdOfTag({src, tag})
  const projectKey = `${project}---${version}`
  console.log(`Version: ${version}`)

  const tasks = [
    // step 3a: create sonarqube project
    () => sonarqubeApi.createProject({projectKey}),
    // step 3b: run analysis
    () => sonarqubeApi.runAnalysis({
      projectKey,
      src,
      version,
      ext: path.join(scripts, "sonarqube_analysis.sh")
    }),
    // sleep for 2 seconds
    () => new Promise(resolve => setTimeout(resolve, 5000)),
    // step 3c: store all analysis metrics
    () => sonarqubeServices.createMeasures({project, projectKey, version}),
    () => sonarqubeServices.createFacets({project, projectKey, version}),
    () => sonarqubeServices.createIssues({project, projectKey, version}),
    () => sonarqubeServices.createSecurityHotspots({project, projectKey, version}),
    // step 4: delete sonarqube project
    () => sonarqubeApi.deleteProject({projectKey})
  ];

  for (const task of tasks) {
    try {
      await task()
    } catch (err) {
      console.error(err)
      console.log(`Error while processing tag: ${tag} ${task}`)
      await closeDb(false)
      process.exit(1)
    }
  }
}

// step 4: Analyze metrics by commit
// aggregations.newIssues({oldVersion, newVersion})
// loop through the tags and compare immediately previous tag
// for (let i = 1; i < tags.length; i++) {
//     const oldTag = tags[i - 1]
//     const newTag = tags[i]
//     const oldVersion = scmApi.getCommitIdOfTag({src, tag: oldTag})
//     const newVersion = scmApi.getCommitIdOfTag({src, tag: newTag})
//     console.log(`Comparing ${oldTag} with ${newTag}`)
//     await issuesAggregation.newIssues({oldVersion, newVersion})
//     await issuesAggregation.resolvedIssues({oldVersion, newVersion})
// }

// step 5: get the metrics
// await metricsAggregation.newIssuesByTagCount()
// await metricsAggregation.resolvedIssuesByTagCount()

await closeDb(false)
