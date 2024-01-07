import {execSync} from "child_process";
import {GLOBALS} from "../globals";

export const runCommand = ({cmd, options = {},}) => {
    return execSync(cmd, {
        stdio: "inherit",
        env: {
            PATH: GLOBALS.EXEC_PATH,
            LANG: "C.UTF-8",
            LC_ALL: "C.UTF-8",
            ...options.env
        },
        ...options,
    })
}