const csv = require('neat-csv');
const fs = require('fs');

import { writeFile } from "fs";
import { createMacroForApollo } from "./apollo";
import { extractRelevantColumns, groupRowsByDay, removeLunchBreakDuration } from "./services";
import type { Command, Macro, TimeEntry } from "./types";

const loadCsv = async (filePath: string): Promise<Array<any> | undefined> => {
    try {
        const csvContent = fs.readFileSync(filePath, 'utf-8');

        return await csv(csvContent);
    } catch (e) {
        console.log('Error:', e.message);
    }
};

const saveMacro = (destination: string, macro: Macro) => {
    fs.writeFile(`./macros/${destination}.json`, JSON.stringify(macro), 'UTF-8', (error: any) => {
        if (error) {
            return console.log(error.message);
        }
        console.log(`Successfully written macro to ./macros/${destination}.json`)
    });
}

const createMacroForSAP = (timeEntries: TimeEntry[]) => {
    console.log('Steps for SAP is work in progress ...');
}


(async () => {
    const csvRows = await loadCsv('./time-entries/2020-12.csv');

    if (!csvRows) {
        return;
    }

    const relevantColumns = extractRelevantColumns(csvRows);
    const dayEntries = groupRowsByDay(relevantColumns);

    const timeEntries = removeLunchBreakDuration(dayEntries);

    createMacroForSAP(timeEntries);
    const apolloMacro = createMacroForApollo(timeEntries);

    saveMacro('apollo', apolloMacro);

    console.log('Complete');    
})();