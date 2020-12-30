import type { Command, Macro, TimeEntry } from "./types";

const SELECT_CONTENT_AREA_FRAME_COMMAND: Command = {
    "Command": "selectFrame",
    "Target": "id=contentAreaFrame",
    "Value": ""
};
const SELECT_WORK_AREA_FRAME_COMMAND: Command = {
    "Command": "selectFrame",
    "Target": "id=isolatedWorkArea",
    "Value": ""
};
const PAUSE_10000_COMMAND: Command = {
    "Command": "pause",
    "Target": "10000",
    "Value": ""
};
const CLICK_SAVE_COMMAND: Command = {
    "Command": "click",
    "Target": "xpath=(//td[@ct=\"MLC\"]/div[@ct=\"B\"]/span/span[contains(., \"Save\")])[1]",
    "Value": ""
};
const CLICK_DISPLAY_DAY_COMMAND: Command = {
    Command: "click",
    Target: "xpath=//td[@ct='MLC'][last()]/div/span/span[@class='lsButton__text ']",
    Value: ""
};

export const getDayEffortCommands = (entry: TimeEntry): Command[] => {
    const [year, month, day] = entry.date.split('-');

    const typeWorkDayCommand: Command = {
        Command: "type",
        Target: "xpath=//td[@ct='MLC']/span/input[@ct='I']",
        Value: `${day}.${month}.${year}`,
    };
    const typeStartTimeCommand: Command = {
        Command: "type",
        Target: "xpath=(//tr[2]/td/span/input[@ct='I'])[1]",
        Value: entry.start
    };
    const typeEndTimeCommand: Command = {
        "Command": "type",
        "Target": "xpath=(//tr[2]/td/span/input[@ct='I'])[2]",
        "Value": entry.end
    };

    return [
        typeWorkDayCommand,
        // User must click "Display" button manually
        typeStartTimeCommand,
        typeEndTimeCommand,
        // User can change 
        // User must click "Save" manually,
        PAUSE_10000_COMMAND,
    ];
}

export const createMacroForSPortal = (timeEntries: TimeEntry[]): Macro => {
    const commands = timeEntries.map(entry => getDayEffortCommands(entry));

    const flattenedCommands = commands.flat();
    flattenedCommands.unshift(SELECT_CONTENT_AREA_FRAME_COMMAND, SELECT_WORK_AREA_FRAME_COMMAND);

    const today = new Date();

    return {
        "Name": "SPortal Macro",
        "CreationDate": `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`,
        "Commands": flattenedCommands,
    };
}