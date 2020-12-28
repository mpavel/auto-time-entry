const csv = require('neat-csv');
const fs = require('fs');

import { extractRelevantColumns, groupRowsByDay, removeLunchBreakDuration } from "./services";

const loadCsv = async (filePath: string): Promise<Array<any> | undefined> => {
    try {
        const csvContent = fs.readFileSync(filePath, 'utf-8');

        return await csv(csvContent);
    } catch (e) {
        console.log('Error:', e.message);
    }
};


(async () => {
    const csvRows = await loadCsv('./time-entries/2020-12.csv');

    if (!csvRows) {
        return;
    }

    const relevantColumns = extractRelevantColumns(csvRows);
    const dayEntries = groupRowsByDay(relevantColumns);

    const workHours = removeLunchBreakDuration(dayEntries);

    console.log(workHours);
})();