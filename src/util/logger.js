import {format, createLogger, transports} from "winston";
import "winston-daily-rotate-file";

const {combine, timestamp, colorize, metadata} = format;

const logFormat = format.printf(({meta, message}) => {
    return `${meta.timestamp} - ${meta.traceId}: ${message}`;
});

const logger = createLogger({
    level: "debug",
    format: combine(
        colorize(),
        timestamp(),
        metadata({
            key: "meta"
        }),
        logFormat,
    ),
    transports: [
        new transports.Console(),
        new transports.DailyRotateFile({
            filename: "traces-%DATE%.log",
            datePattern: "YYYY-MM-DD-HH",
            zippedArchive: true,
            dirname: "traces",
            maxSize: "20m",
            maxFiles: "7d",
            frequency: "1h"
        })
    ],
});

export const log = (traceId, message) => logger.debug(message, {traceId});