import {InsightError, InsightResult, ResultTooLargeError} from "../../IInsightFacade";
import {columnsReferencedInQuery, dataSetsReferencedInQuery, validateQuery} from "../queryValidation/QueryValidity";
import {processListOfSections} from "./SectionsProcessing";
import {filterList} from "./QueryFilterProcessing";
import {processListColumns} from "./QueryColumnsProcessing";
import {sortList} from "./QueryOrderSort";
import {transform} from "../queryTransformation/GroupTransformation";
import {querySort} from "../queryTransformation/QuerySorting";

export function performQueryHelper(
	query: any,
	dataSets: Map<string, any>
): InsightResult[] {

	let iDsToKind = new Map<string, any>();
	dataSets.forEach((dataSet) => {
		iDsToKind.set(dataSet.id, dataSet.kind);
	});
	validateQuery(query, iDsToKind);
	let queryObject: any = query;
	let id = dataSetsReferencedInQuery(query, iDsToKind);
	let insightResult = dataSets.get(id);
	let filteredSections: any[] = [];
	if (Object.values(queryObject.WHERE).length === 0 && !queryObject.TRANSFORMATIONS) {
		return insightResult.data;
	}
	let processedSectionsList = processListOfSections(insightResult.data, id);
	processedSectionsList.forEach((list: any) => {
		let isFilteredList = filterList(queryObject.WHERE, list);
		if (isFilteredList) {
			filteredSections.push(list);
		}
	});
	if (Object.values(queryObject.WHERE).length === 0) {
		filteredSections = processedSectionsList;
	}
	if (queryObject.TRANSFORMATIONS) {
		filteredSections = transform(query, filteredSections);
	}
	filteredSections = processListColumns(filteredSections, query, iDsToKind);
	let order = queryObject.OPTIONS.ORDER;
	if (order) {
		if (typeof order === "string") {
			sortList(query, filteredSections);
		} else {
			querySort(filteredSections, order.dir, order.keys);
		}
	}
	return filteredSections;
}
