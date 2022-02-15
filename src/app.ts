const csv = require('neat-csv');
const fs = require('fs');

import { createMacroForApollo } from "./apollo";
import { extractRelevantColumns, groupRowsByDay, removeLunchBreakDuration } from "./services";
import { createMacroForSPortal } from "./sportal";
import type { Macro } from "./types";

const loadCsv = async (filePath: string): Promise<Array<any> | undefined> => {
    try {
        const csvContent = fs.readFileSync(filePath, 'utf-8');

        console.log(`Completed reading file: ${filePath}`);

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

(async () => {
    const csvRows = await loadCsv('./time-entries/may.csv');

    if (!csvRows) {
        console.log('Could not find any rows in the input file.');
        return;
    }

    const relevantColumns = extractRelevantColumns(csvRows);
    const dayEntries = groupRowsByDay(relevantColumns);

    const timeEntries = removeLunchBreakDuration(dayEntries);

    saveMacro('apollo', createMacroForApollo(timeEntries));
    saveMacro('sportal', createMacroForSPortal(timeEntries));

    console.log('Complete');
})();
