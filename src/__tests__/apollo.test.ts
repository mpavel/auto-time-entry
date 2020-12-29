import { getDayEffortCommands } from "../apollo";
import { TimeEntry } from "../types";

describe('Apollo Commands', () => {
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
                    Command: "click",
                    Target: "linkText=3",
                    Value: "",
                },
                {
                    Command: "click",
                    Target: "linkText=HH:MM",
                    Value: "",
                },
                {
                    Command: "click",
                    Target: "xpath=//*[@id=\"ui-panel-4-content\"]/div/div/div/div[2]/input",
                    Value: "",
                },
                {
                    Command: "type",
                    Target: "xpath=//*[@id=\"ui-panel-4-content\"]/div/div/div/div[2]/input",
                    Value: "07:42",
                },
                {
                    Command: "click",
                    Target: "xpath=//span[contains(text(), 'Holiday')]",
                    Value: "",
                },
                {
                    Command: "pause",
                    Target: "1000",
                    Value: "",
                },
                {
                    Command: "click",
                    Target: "id=bookButton",
                    Value: "",
                },
                {
                    Command: "click",
                    Target: "//*[@class=\"message ng-star-inserted\"]",
                    Value: "",
                }
            ]);
        });
    });
});