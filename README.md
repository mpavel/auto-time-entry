# Auto Time Entry

TL;DR

Convert CSV files from time tracking software into UI.Vision RPA JSON macros.


## How to use

1. Export a month of data from your time tracking software into a CSV file
2. Copy the CSV file into time-entries
3. `npm start`
4. Open the `macros` folder and copy the macro for SAP or Apollo time tracking
5. Open SAP or Apollo (depending on step 4)
6. Open the UI.Vision RPA Chrome Extension and paste the JSON macro
7. Run the Macro to fill in the timesheets automatically

*IMPORTANT*
Please note that SPortal requires manual interactions:
1. After the date is inserted, you must click the "Display" button manually
2. After the time is filled in, you can select "Present" or "Working from remote workplace" in the dropdown, and you must click the "Save" button manually

## Supported Time Tracking Software

* [Harvest](https://getharvest.com)