interface LogLevel {
    level: number;
    console: keyof Console;
}

export const LogLevel: { [key: string]: LogLevel } = {
    TRACE: { level: 0, console: 'trace' },
    DEBUG: { level: 1, console: 'debug' },
    INFO: { level: 2, console: 'info' },
    WARN: { level: 3, console: 'warn' },
    ERROR: { level: 4, console: 'error' },
};

class Logging {
    level: LogLevel = LogLevel.INFO;
    trace(message?: any, ...optionalParams: any[]) {
        this.log(LogLevel.TRACE, message, ...optionalParams);
    }
    debug(message?: any, ...optionalParams: any[]) {
        this.log(LogLevel.DEBUG, message, ...optionalParams);
    }
    info(message?: any, ...optionalParams: any[]) {
        this.log(LogLevel.INFO, message, ...optionalParams);
    }
    warn(message?: any, ...optionalParams: any[]) {
        this.log(LogLevel.WARN, message, ...optionalParams);
    }
    error(message?: any, ...optionalParams: any[]) {
        this.log(LogLevel.ERROR, message, ...optionalParams);
    }

    private log(method: LogLevel, message?: any, ...optionalParams: any[]): void {
        if (method.level >= this.level.level) {
            console[method.console](message, ...optionalParams);
        }
    }
}

export default new Logging()