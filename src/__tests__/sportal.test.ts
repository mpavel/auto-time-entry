import { getDayEffortCommands } from "../sportal";
import type { TimeEntry } from "../types";

describe('Apollo Macro', () => {
    describe('#getDayEffortCommands()', () => {
        it('returns the commands for a day work efforts in Apollo', () => {
            const timeEntry: TimeEntry = {
                date: '2020-12-03',
                project: 'Work',
                hours: 7.71,
                start: '9:00',
                end: '17:12'
            };

            expect(getDayEffortCommands(timeEntry)).toEqual([
                {
                    "Command": "type",
                    "Target": "xpath=//td[@ct='MLC']/span/input[@ct='I']",
                    "Value": "03.12.2020"
                },
                {
                    "Command": "type",
                    "Target": "xpath=(//tr[2]/td/span/input[@ct='I'])[1]",
                    "Value": "9:00"
                },
                {
                    "Command": "type",
                    "Target": "xpath=(//tr[2]/td/span/input[@ct='I'])[2]",
                    "Value": "17:12"
                },
                {
                    "Command": "pause",
                    "Target": "10000",
                    "Value": ""
                }
            ]);
        });
    });
})