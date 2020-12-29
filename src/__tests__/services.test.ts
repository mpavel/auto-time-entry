import { extractRelevantColumns, getBreakDurationInMs, groupRowsByDay, convertHourStringToMs, newEndHourBasedOnBreakDuration, removeLunchBreakDuration, hasTimeEntry, updateTimeEntries, convertDecimalTimeToHourString } from "../services";
import { TimeEntry } from "../types";

const CSV_ROW = {
    Date: '2020-12-03',
    Client: 'Me',
    Project: 'Work',
    'Project Code': '',
    Task: 'Others',
    Notes: 'Pflegeurlaub',
    Hours: '7,5',
    'Started At': '9:30',
    'Ended At': '17:00',
    'Billable?': 'No',
    'Invoiced?': 'No',
    'First Name': 'Pavel',
    'Last Name': 'Mocan',
    Roles: '',
    'Employee?': 'Yes',
    'Billable Rate': '0,0',
    'Billable Amount': '0,0',
    'Cost Rate': '0,0',
    'Cost Amount': '0,0',
    Currency: 'Euro - EUR',
    'External Reference URL': ''
};

describe('auto-time-entry', () => {
    describe('#extractRelevantColumns()', () => {
        it('extracts only the relevant columns', () => {
            expect(extractRelevantColumns([CSV_ROW])).toEqual([{
                "date": "2020-12-03",
                "end": "17:00",
                "hours": 7.5,
                "project": "Work",
                "start": "9:30",
            }]);
        });
    });

    describe('#groupRowsByDay()', () => {
        it('groups multiple days into one entry', () => {
            const rows: TimeEntry[] = [
                {
                    date: '2020-12-03',
                    project: 'Work',
                    hours: 7.5,
                    start: '9:30',
                    end: '17:00'
                },
                {
                    date: '2020-12-09',
                    project: 'Work',
                    hours: 0.48,
                    start: '9:00',
                    end: '9:29'
                },
                {
                    date: '2020-12-09',
                    project: 'Work',
                    hours: 1.53,
                    start: '9:29',
                    end: '11:01'
                },
                {
                    date: '2020-12-09',
                    project: 'Work',
                    hours: 1.9,
                    start: '11:01',
                    end: '12:55'
                },
                {
                    date: '2020-12-09',
                    project: 'Work',
                    hours: 1.08,
                    start: '13:55',
                    end: '15:00'
                },
                {
                    date: '2020-12-09',
                    project: 'Work',
                    hours: 2.83,
                    start: '15:00',
                    end: '17:50'
                },
                {
                    date: '2020-12-10',
                    project: 'Work',
                    hours: 0.33,
                    start: '9:00',
                    end: '9:20'
                }];

            expect(groupRowsByDay(rows)).toEqual([
                {
                    date: '2020-12-03',
                    project: 'Work',
                    hours: 7.5,
                    start: '9:30',
                    end: '17:00'
                },
                {
                    date: '2020-12-09',
                    project: 'Work',
                    hours: 7.82,
                    start: '9:00',
                    end: '17:50'
                },
                {
                    date: '2020-12-10',
                    project: 'Work',
                    hours: 0.33,
                    start: '9:00',
                    end: '9:20'
                },
            ]);
        });
    });

    describe('#hasTimeEntry()', () => {
        it('returns true if the time entry exists', () => {
            expect(hasTimeEntry({ date: '2020-12-12' } as TimeEntry, [{ date: '2020-12-12' } as TimeEntry])).toBe(true);
        });
        it('returns false when the time entry does not exist', () => {
            expect(hasTimeEntry({ date: '2020-12-12' } as TimeEntry, [])).toBe(false);
        });
    });

    describe('#updateTimeEntry()', () => {
        it('updates the existing time entry with values from the newly found time entry', () => {
            const existingTimeEntries: TimeEntry[] = [{
                date: '2020-12-12',
                project: 'PROJECT',
                hours: 2,
                start: '10:00',
                end: '12:00',
            }];
            const newTimeEntry: TimeEntry = {
                date: '2020-12-12',
                project: 'ANY',
                hours: 4,
                start: '13:00',
                end: '17:00',
            };

            expect(updateTimeEntries(newTimeEntry, existingTimeEntries)).toEqual([{
                date: '2020-12-12',
                project: 'PROJECT',
                hours: 6,
                start: '10:00',
                end: '17:00',
            }]);
        });

        it.skip('keeps the latest end time when updating a time entry', () => {
            // assuming time entries are set in the CSV file in chronological order
        });

        it.skip('keeps the earliest start time when updating a time entry', () => {
            // assuming time entries are set in the CSV file in chronological order
        });
    });

    describe('#removeLunchBreakDuration()', () => {
        it('removes the lunch break duration when lunch break is exactly 0,5 hours', () => {
            expect(removeLunchBreakDuration([{
                date: '2020-12-12',
                project: 'PROJECT',
                hours: 7.92,
                start: '09:00',
                end: '17:25',
            }])).toEqual([{
                date: '2020-12-12',
                project: 'PROJECT',
                hours: 7.92,
                start: '09:00',
                end: '17:25',
            }]);
        });

        it('removes the lunch break duration when lunch break longer than 0,5', () => {
            expect(removeLunchBreakDuration([{
                date: '2020-12-12',
                project: 'PROJECT',
                hours: 8,
                start: '09:00',
                end: '18:00',
            }])).toEqual([{
                date: '2020-12-12',
                project: 'PROJECT',
                hours: 8,
                start: '09:00',
                end: '17:30',
            }]);
        });
    });

    describe('#getBreakDurationInMs()', () => {
        it('finds out the break duration based on worked hours, start and end hours', () => {
            const timeEntry: TimeEntry = {
                hours: 7.7,
                start: '09:00',
                end: '17:42',
            } as TimeEntry;

            expect(getBreakDurationInMs(timeEntry)).toBe(1 * 60 * 60 * 1000); // 1 hour
        });
    });

    describe('#newEndHourBasedOnBreakDuration()', () => {
        it('keeps the same end time if break duration is within allowed time', () => {
            const timeEntry: TimeEntry = {
                hours: 7.7,
                start: '09:00',
                end: '17:12',
            } as TimeEntry;
            const standardLunchBreak = 0.5 * 60 * 60 * 1000; // 0,5h

            expect(newEndHourBasedOnBreakDuration(timeEntry, standardLunchBreak))
                .toBe('17:12');
        });

        it('reduces the end time by the amount of additional break time taken', () => {
            const timeEntry: TimeEntry = {
                hours: 7.7, // worked hours are the same
                start: '09:00',
                end: '17:42', // but there is a 30m extra break time
            } as TimeEntry;
            const standardLunchBreak = 0.5 * 60 * 60 * 1000; // 0,5h

            expect(newEndHourBasedOnBreakDuration(timeEntry, standardLunchBreak))
                .toBe('17:12');
        });

        it('keeps the same end time for short days', () => {
            const timeEntry: TimeEntry = {
                hours: 3.09, // short day
                start: '09:00',
                end: '12:05', // no real lunch break, since day ends here
            } as TimeEntry;
            const standardLunchBreak = 0.5 * 60 * 60 * 1000; // 0,5h

            expect(newEndHourBasedOnBreakDuration(timeEntry, standardLunchBreak))
                .toBe('12:05');
        });

        it('formats new end time correctly for night shifts', () => {
            const timeEntry: TimeEntry = {
                hours: 8.0, // actual work hours are 8
                start: '00:30',
                end: '09:45', 
                // total time spent is 9:15
                // total break time is 1:15
                // allowed break is 00:30 
                // => end time should be reduced with 45m
            } as TimeEntry;
            const standardLunchBreak = 0.5 * 60 * 60 * 1000; // 0,5h

            expect(newEndHourBasedOnBreakDuration(timeEntry, standardLunchBreak))
                .toBe('09:00');
        });
    });

    describe('#convertHourStringToMs()', () => {
        it('returns the hour string in miliseconds', () => {
            expect(convertHourStringToMs('10:00')).toBe(36000000); // 36.000.000
        });
    });

    describe('#convertDecimalTimeToHourString()', () => {
        it('converts time written in decimal format to an hour string', () => {
            expect(convertDecimalTimeToHourString(7.66)).toBe('07:39');
        });
    })
});