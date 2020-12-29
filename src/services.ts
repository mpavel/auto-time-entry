import type { TimeEntry } from "./types";

const LUNCH_BREAK_DURATION_IN_MS = 0.5 * 60 * 60 * 1000; // 0,5h
const TARGET_WORKING_HOURS_WITH_BREAK = 7.7;
const TARGET_WORKING_HOURS_WITHOUT_BREAK = 7.2;

export const extractRelevantColumns = (csvRows: any[]): TimeEntry[] =>
    csvRows.map((row: any) => {
        // todo: perform type transformations
        return {
            date: row['Date'],
            project: row['Project'],
            hours: Number(row['Hours'].replace(',', '.')),
            start: row['Started At'],
            end: row['Ended At'],
        }
    });

export const hasTimeEntry = (timeEntry: TimeEntry, entries: TimeEntry[]): boolean => {
    return !!entries.find((entry: TimeEntry) => entry.date === timeEntry.date)
};

export const updateTimeEntries = (newEntry: TimeEntry, entries: TimeEntry[]): TimeEntry[] =>
    entries.map((existingEntry) => {
        if (existingEntry.date === newEntry.date) {
            return {
                ...existingEntry,
                hours: Number((existingEntry.hours + newEntry.hours).toFixed(2)),
                end: newEntry.end,
            }
        }

        return existingEntry;
    });

export const groupRowsByDay = (timeEntries: TimeEntry[]): TimeEntry[] => {
    let groupedTimeEntries: TimeEntry[] = [];

    for (const entry of timeEntries) {
        if (hasTimeEntry(entry, groupedTimeEntries)) {
            groupedTimeEntries = updateTimeEntries(entry, groupedTimeEntries);
        } else {
            groupedTimeEntries.push(entry);
        }
    }

    return groupedTimeEntries;
}

export const convertHourStringToMs = (hour: string): number => {
    const [hourValue, minuteValue] = hour.split(':');

    return (Number(hourValue) * 60 * 60 * 1000) +
        (Number(minuteValue) * 60 * 1000);
}

export const getBreakDurationInMs = (timeEntry: TimeEntry) => {
    const startInMs = convertHourStringToMs(timeEntry.start);
    const endInMs = convertHourStringToMs(timeEntry.end);
    const startEndIntervalInMs = endInMs - startInMs;

    return startEndIntervalInMs - (timeEntry.hours * 60 * 60 * 1000);
}

export const newEndHourBasedOnBreakDuration = (timeEntry: TimeEntry, standardLunchBreakInMs: number) => {
    const breakDurationInMs = getBreakDurationInMs(timeEntry);

    if (standardLunchBreakInMs >= breakDurationInMs) {
        return timeEntry.end;
    }

    const endTimeInMs = convertHourStringToMs(timeEntry.end);

    // deduct the total break duration, but account for the allowed standard lunch break
    const newEndTimeInMs = endTimeInMs - breakDurationInMs + standardLunchBreakInMs;

    const newEndDate = new Date(0);
    newEndDate.setUTCMilliseconds(newEndTimeInMs);

    const utcHours = newEndDate.getUTCHours();
    const formattedHours = utcHours < 10 ? `0${utcHours}` : utcHours;

    const utcMinutes = newEndDate.getUTCMinutes();
    const formattedMinutes = utcMinutes < 10 ? `0${utcMinutes}` : utcMinutes;
    
    return `${formattedHours}:${formattedMinutes}`;
}

export const removeLunchBreakDuration = (timeEntries: TimeEntry[]): TimeEntry[] =>
    timeEntries.map(timeEntry => {
        const newEndHour = newEndHourBasedOnBreakDuration(timeEntry, LUNCH_BREAK_DURATION_IN_MS);

        return {
            ...timeEntry,
            end: newEndHour,
        };
    });