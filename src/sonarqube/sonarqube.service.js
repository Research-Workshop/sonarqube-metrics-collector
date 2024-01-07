import {api} from "./sonarqube.api"
import {operations} from "./sonarqube.operation";

const createMeasures = async ({project, projectKey, version}) => {
    const measuresArr = await api.getMeasures({projectKey})
    // convert array to object
    const measures = measuresArr.reduce((acc, cur) => {
        const {metric, ...value} = cur
        acc[metric] = value
        return acc
    }, {})
    await operations.createMeasures({project, version, measures})
}

export const services = {
    createMeasures
}