export interface TimeEntry {
    date: string,
    project: string,
    hours: number,
    start: string,
    end: string,
}

export interface Command {
    Command: string;
    Target: string;
    Value: string;
}

export interface Macro {
    Name: string,
    CreationDate: string,
    Commands: Command[],
}