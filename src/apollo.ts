import { convertDecimalTimeToHourString } from "./services";
import type { Command, Macro, TimeEntry } from "./types";

const PROJECT_OR_TASK = 'User relations';

const SELECT_HOUR_MINUTES_COMMAND = {
    Command: "click",
    Target: "linkText=HH:MM",
    Value: "",
};
const CLICK_HOUR_MINUTES_INPUT_COMMAND = {
    Command: "click",
    Target: "xpath=//*[@id=\"ui-panel-4-content\"]/div/div/div/div[2]/input",
    Value: "",
};
const PAUSE_BEFORE_BOOKING_COMMAND = {
    Command: "pause",
    Target: "1000",
    Value: "",
};
const CLICK_SUCCESS_BUBBLE_COMMAND = {
    Command: "click",
    Target: "//*[@class=\"message ng-star-inserted\"]",
    Value: "",
};

export const getDayEffortCommands = (timeEntry: TimeEntry): Command[] => {
    const [year, month, day] = timeEntry.date.split('-');
    const selectDayCommand: Command = {
        Command: "click",
        Target: `linkText=${Number(day)}`,
        Value: "",
    };

    const insertWorkHoursCommand = {
        Command: "type",
        Target: "xpath=//*[@id=\"ui-panel-4-content\"]/div/div/div/div[2]/input",
        Value: convertDecimalTimeToHourString(timeEntry.hours),
    };

    const selectProjectAndTaskCommand = {
        Command: "click",
        Target: `xpath=//span[contains(text(), '${PROJECT_OR_TASK}')]`,
        Value: "",
    };

    const bookCommand = {
        Command: "click",
        Target: "id=bookButton",
        Value: "",
    };

    return [
        selectDayCommand,
        SELECT_HOUR_MINUTES_COMMAND,
        CLICK_HOUR_MINUTES_INPUT_COMMAND,
        insertWorkHoursCommand,
        selectProjectAndTaskCommand,
        PAUSE_BEFORE_BOOKING_COMMAND,
        bookCommand,
        CLICK_SUCCESS_BUBBLE_COMMAND,
    ];
}


export const createMacroForApollo = (timeEntries: TimeEntry[]): Macro => {
    const commands = timeEntries.map(entry => getDayEffortCommands(entry));

    const today = new Date();

    return {
        "Name": "Apollo Macro",
        "CreationDate": `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`,
        "Commands": commands.flat(),
    };
}