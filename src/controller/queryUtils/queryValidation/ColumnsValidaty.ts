import {InsightError} from "../../IInsightFacade";

export const COURSES_QUERY_KEYS: string[] = [
	"dept",
	"id",
	"avg",
	"instructor",
	"title",
	"pass",
	"fail",
	"audit",
	"uuid",
	"year",
];

export const ROOMS_QUERY_KEYS: string[] = [
	"fullname",
	"shortname",
	"number",
	"name",
	"address",
	"type",
	"lat",
	"lon",
	"seats",
	"furniture",
	"href"
];

function isValidQueryKeys(
	query: any,
	dataSetsReferenceSoFar: Set<string>,
	keysSetReferenceSoFar: Set<string>,
	IDsToKind: Map<string, any>
): boolean {
	let columnValues: any = Object.values(query.OPTIONS.COLUMNS);
	for (let columnValue of columnValues) {
		if (columnValue === null || columnValue === undefined) {
			return false;
		}
		if (query.TRANSFORMATIONS) {
			if(!query.TRANSFORMATIONS.APPLY || !query.TRANSFORMATIONS.GROUP) {
				throw new InsightError();
			}
			let applyValues: any = Object.values(query.TRANSFORMATIONS.APPLY);

			if (!validateQueryKeyRegular(columnValue, dataSetsReferenceSoFar, keysSetReferenceSoFar, IDsToKind)
				&& !validateKeyDefinedInApply(applyValues, columnValue, dataSetsReferenceSoFar,
					keysSetReferenceSoFar, IDsToKind)) {
				return false;
			}
		} else if (!query.TRANSFORMATIONS) {
			if (!validateQueryKeyRegular(columnValue, dataSetsReferenceSoFar, keysSetReferenceSoFar, IDsToKind)) {
				return false;
			}
		}
	}
	return dataSetsReferenceSoFar.size === 1;
}

export function validateKeyDefinedInApply(
	applyValues: any,
	columnValue: any,
	dataSetsReferencedSoFar: any,
	keysReferencedSoFar: any,
	IDsToKind: any
) {
	let ret;
	let applyStrings: string[] = [];
	for (let applyValue of applyValues) {
		let tmp = Object.keys(applyValue)[0];
		applyStrings.push(tmp);
	}
	if (applyStrings.includes(columnValue)) {
		applyValues.forEach((applyValue: any) => {
			let values = Object.values(applyValue);
			let firstValue: any = Object.values(values)[0];
			let keyValue: any = Object.values(firstValue)[0];
			ret = validateQueryKeyRegular(keyValue, dataSetsReferencedSoFar, keysReferencedSoFar, IDsToKind);
		});
	}
	return ret;
}

export function isKeyInApply(applyValues: any, columnValue: any) {
	let applyStrings: string[] = [];
	for (let applyValue of applyValues) {
		let tmp = Object.keys(applyValue)[0];
		applyStrings.push(tmp);
	}
	return applyStrings.includes(columnValue);
}


function validateQueryKeyRegular(
	columnValue: any,
	dataSetsReferenceSoFar: Set<string>,
	keysSetReferenceSoFar: Set<string>,
	IDsToKind: Map<string, any>
) {
	let keys = columnValue.split("_");
	if (keys.length > 2) {
		return false;
	}
	if (!Array.from(IDsToKind.keys()).includes(keys[0])) {
		return false;
	}
	if (Array.from(IDsToKind.keys()).includes(keys[0])) {
		for (let [id, kind] of IDsToKind) {
			if (id === keys[0]) {
				if (kind === "courses") {
					if (!COURSES_QUERY_KEYS.includes(keys[1])) {
						console.log("returning because it queries room keys from a courses dataset");
						return false;
					}
				} else if (kind === "rooms") {
					if (!ROOMS_QUERY_KEYS.includes(keys[1])) {
						console.log("returning false because it queries course keys from a rooms dataset");
						return false;
					}
				}
			}
		}
	}
	dataSetsReferenceSoFar.add(keys[0]);
	keysSetReferenceSoFar.add(keys[1]);
	return true;
}

/**
 * If the columns are successfully validated return a set of datasets to confirm with filter that there haven't been
 * any referenced datasets in the filters not in the columns
 * @param query
 * @param IDsToKind
 */
export function validateColumns(query: any, IDsToKind: Map<string, any>) {
	let dataSetsReferenceSoFar = new Set<string>();
	let keysSetReferenceSoFar = new Set<string>();
	let columnValues: any = Object.values(query.OPTIONS.COLUMNS);
	const queryObject: any = query;
	if (columnValues.length === 0) {
		throw new InsightError();
	}
	if (!isValidQueryKeys(queryObject, dataSetsReferenceSoFar, keysSetReferenceSoFar, IDsToKind)) {
		throw new InsightError();
	}

	return {dataSetsReferenceSoFar, keysSetReferenceSoFar};
}

