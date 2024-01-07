import {execSync} from "child_process";
import {GLOBALS} from "../globals";

export const runCommand = ({cmd, options = {}, exitOnError = false}) => {
    try {
        execSync(cmd, {
            stdio: "inherit",
            env: {
                PATH: GLOBALS.EXEC_PATH,
                LANG: "C.UTF-8",
                LC_ALL: "C.UTF-8",
                ...options.env
            },
            ...options,
        })
    } catch (err) {
        if (exitOnError) {
            console.log(err)
            process.exit(1)
        } else {
            throw err
        }
    }
}