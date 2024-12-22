enum LogLevel {
	Debug = "DEBUG",
	Info = "INFO",
	Warn = "WARN",
	Error = "ERROR",
}

class Logger {
	private name?: string;
	private logLevel: LogLevel;

	constructor(name?: string, logLevel: LogLevel = LogLevel.Info) {
		this.name = name;
		this.logLevel = logLevel;
	}

	private formatMessage(level: LogLevel, message: string, name: string | undefined): string {
		return `[${level}] ${name ? `[${name}]` : ""} ${message}`;
	}

	public debug(...messages: unknown[]): void {
		if (this.logLevel === LogLevel.Debug) {
			print(`[DEBUG]`, `${this.name ? `[${this.name}]` : ""}`, ...messages);
		}
	}

	public info(message: string): void {
		if (this.logLevel === LogLevel.Info || this.logLevel === LogLevel.Debug) {
			print(this.formatMessage(LogLevel.Info, message, this.name));
		}
	}

	public warn(message: string): void {
		if (this.logLevel === LogLevel.Warn || this.logLevel === LogLevel.Info || this.logLevel === LogLevel.Debug) {
			warn(this.formatMessage(LogLevel.Warn, message, this.name));
		}
	}

	public error(message: string): void {
		error(this.formatMessage(LogLevel.Error, message, this.name));
	}
}

export { Logger, LogLevel };
