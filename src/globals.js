export const GLOBALS = {
    SONARQUBE_URL: process.env.SONARQUBE_URL || "http://localhost:9000",
    SONARQUBE_TOKEN: process.env.SONARQUBE_TOKEN,
    BPT_PATH: process.env.BPT_PATH,
    MONGO_URL: process.env.MONGO_URL,
    EXEC_PATH: `${process.env.PATH}:${process.env.PATH_EXTENSION}`,
    DB_CLIENT: null,
}
