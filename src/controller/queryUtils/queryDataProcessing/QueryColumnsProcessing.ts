import {validateColumns} from "../queryValidation/ColumnsValidaty";
import {dataSetsReferencedInQuery} from "../queryValidation/QueryValidity";

/**
 * gets only the required columns about a given course
 * **/
export function processListColumns(listOfSections: any[], query: any, IDsToKind: Map<string, any>) {
	let listOfProcessedColumnsSections: any[] = [];
	if (query.TRANSFORMATIONS) {
		let columnKeys = query.OPTIONS.COLUMNS;
		listOfSections.forEach((section) => {
			let arr: any = Object.entries(section).filter((sectionEntry: any) => {
				return (columnKeys.includes(sectionEntry[0]));
			});
			let newSection = Object.fromEntries(arr);
			listOfProcessedColumnsSections.push(newSection);
		});
	} else {
		let columnsObject = validateColumns(query, IDsToKind);
		let dataSet = dataSetsReferencedInQuery(query, IDsToKind);
		let columns: any[] = [];
		columnsObject.keysSetReferenceSoFar.forEach((key) => {
			key = dataSet + "_" + key;
			columns.push(key);
		});
		listOfSections.forEach((section) => {
			let newSection: any = {};
			columns.forEach((key) => {
				newSection[key] = section[key];
			});
			listOfProcessedColumnsSections.push(newSection);
		});
	}

	return listOfProcessedColumnsSections;
}
