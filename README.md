# About the PB Housing Survey-Nov2025

This is information collected in November 2025 from Lyme NH residents. 
The questions for the survey were created by the Lyme Planning Board.

The main web page has three tabs showing a summary view of the responses, 
the data from the individual responses, 
and this description of the project.

The responses come from the 

## Collecting the survey results

Rich Brown created a Google form at
[bit.ly/LymeHousingSurvey2025](https://bit.ly/LymeHousingSurvey2025)
to collect the information. 

About ??? people entered the data on the form (online). 
Another ~?? people filled out the form on paper and mailed/returned it to the Town Offices.

Members of the Planning Board manually entered
those paper forms into the online form. 
Each paper form was numbered, and those numbers were entered manually as the first data in the "Other" field so we could track the data.

The data was exported as CSV from Google, then massaged to:

1. (If needed) Add a header row to give each of the columns a name.
   Format first row to remove wrap.
2. Add a second column (becomes Column B) with "Response" in line 1 and numbering each of the rows incrementally
3. For the manually-entered rows, remove the [###] from the final question.
4. Synchronize the response numbers? (No - just start the paper versions at the next one after the final electronic entry)
5. Convert the CSV to JSON using [http://www.convertcsv.com/csv-to-json.htm](http://www.convertcsv.com/csv-to-json.htm)
  - Select file to upload (copy/paste or use upload)
  - Input options - default (first row is column names)
  - Output options - default
  - Generate **CSV as JSON array**
  - Copy/paste to _Survey-feedback.json_
6. Add `responses = ` and a final `;`
   to convert to a valid Javascript statement

Also create _Survey-questions.json_ with "printable" questions
  (a summary of the question for display)
  It should have the form of a JSON array of strings:

   ```
   questions = [ 
     "Timestamp", 
     "First question",
     "Second question",
     ...
     ];
   ```

The web page page scripts read data from the
_Survey-feedback.js_ and _Survey-questions.js_ files,
and format the data using
a touch of Javascript and CSS.

## Development/Test Procedure

The _index.html_ page drives the appearance of the page.
It has three tabs, as described above.
The Summaries tab collates information from each of the questions.


The repository for these files is at: [https://github.com/richb-hanover/PB\_Housing\_Survey-November2025](https://github.com/richb-hanover/PB\_Housing\_Survey-November2025)
It contains the original data, as well test procedures for the Javascript and CSS files. 

Run the `yarn` command below, then edit any `*.js`, `*.html`, and `*.css` file and the page will automatically reload in Firefox Developer Browser.
Setup files copied from Wes Bos' CSS-Grid course at 
[https://github.com/wesbos/css-grid](https://github.com/wesbos/css-grid)

Run `yarn update --latest` to update to the latest versions of all the dependencies.

``` sh
yarn install # to get started

yarn start # to start monitoring the files in the folder.
```

---
### Tests made to convert from LCDC to PB Survey

- Start modifying README to describe the process
- `yarn update --latest` to get new dependencies
- `yarn start` appears to correctly display old (LCDC) data
- Created _Survey-feedback.json_ from housing results (with "Response" column.
- Switch back to _LCDC-feedback.json_ and switch files to Typescript (.ts suffix); add "type: module" to package.json
 
 ```
 Timestamp	Response	1. Rate of increase	2. Duplexes	2. 3-6 units	2. 7 to 15 units	3. Attainable	3. Affordable	4. Att-Aff Explanation	5. Lyme Common	5. Lyme Center	5. Commercial	5. Rural	5. East Lyme	5. Holts Ledge	5. Mtn & Forest	5. Wherever SF units	5. Nowhere	5. Other	6. Other explanation	7. Housing in Commercial	8. Multi-unit districs	9. Infill	10. Lyme School	11. Lyme School Explanation	12. Housing initiatives	13. Years in Lyme	14. Plan to move	15. Explanation of moving 	16. Age range	17. Smaller house	18. Smaller house explanation	19. Currently own	20. Other thoughts
 ```

