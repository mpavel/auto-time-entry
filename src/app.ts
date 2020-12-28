const csv = require('neat-csv');
const fs = require('fs');

import { extractRelevantColumns, groupRowsByDay, removeLunchBreakDuration } from "./services";
import type { TimeEntry } from "./types";

const loadCsv = async (filePath: string): Promise<Array<any> | undefined> => {
    try {
        const csvContent = fs.readFileSync(filePath, 'utf-8');

        return await csv(csvContent);
    } catch (e) {
        console.log('Error:', e.message);
    }
};

const createStepsForSAP = (workHours: TimeEntry[]) => {
    console.log('Steps for SAP is work in progress ...');
}

const createStepsForApollo = (workHours: TimeEntry[]) => {
    console.log('Steps for Apollo is work in progress ...');
}


(async () => {
    const csvRows = await loadCsv('./time-entries/2020-12.csv');

    if (!csvRows) {
        return;
    }

    const relevantColumns = extractRelevantColumns(csvRows);
    const dayEntries = groupRowsByDay(relevantColumns);

    const workHours = removeLunchBreakDuration(dayEntries);

    createStepsForSAP(workHours);
    createStepsForApollo(workHours);

    console.log('Complete');
})();