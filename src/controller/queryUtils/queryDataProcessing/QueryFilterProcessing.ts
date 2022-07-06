/**
 * returns true if the section must be included in the result
 * @param filterObject
 * @param list
 */

export function filterList(filterObject: any, list: any) {
	let andList: boolean[] = [];
	let orList: boolean[] = [];
	let newObject = Object.values(filterObject)[0];
	let objectOperator = Object.keys(filterObject)[0];
	if (objectOperator === "AND" || objectOperator === "OR") {
		return logicFilter(newObject, objectOperator, list, andList, orList);
	} else if (objectOperator === "LT" || objectOperator === "GT" || objectOperator === "EQ") {
		return mComparator(newObject, objectOperator, list);
	} else if (objectOperator === "NOT") {
		return negationFilter(newObject, list);
		/**
		 * TODO: Check the missing wildcard tests
		 */
	} else if (objectOperator === "IS") {
		return isFilter(newObject, list);
	} else {
		return false;
	}
}

function logicFilter(filterObject: any, objectOperator: string, list: any, andList: boolean[], orList: boolean[]): any {
	for (let f of filterObject) {
		if (objectOperator === "AND") {
			andList.push(filterList(f, list));
		} else {
			orList.push(filterList(f, list));
		}
	}
	if (objectOperator === "AND") {
		return !andList.includes(false);
	} else {
		return orList.includes(true);
	}
}

function mComparator(filterObject: any, objectOperator: string, list: any) {
	let key = Object.keys(filterObject)[0];
	if (objectOperator === "LT") {
		return list[key] < filterObject[key];
	} else if (objectOperator === "GT") {
		return list[key] > filterObject[key];
	} else {
		return list[key] === filterObject[key];
	}
}

function negationFilter(filterObject: any, list: any): boolean {
	return !filterList(filterObject, list);
}

function isFilter(filterObject: any, list: any) {
	let key = Object.keys(filterObject)[0];
	let paramValue = filterObject[key];
	let paramField = list[key];
	let firstWild = paramValue.startsWith("*");
	let secondWild = paramValue.endsWith("*");

	if(firstWild && secondWild && paramValue.length > 1) {
		return paramField.includes(paramValue.substring(1, paramValue.length - 1));
	} else if(firstWild) {
		return paramField.endsWith(paramValue.substring(1));
	} else if(secondWild) {
		return paramField.startsWith(paramValue.substring(0, paramValue.length - 1));
	} else {
		return paramField === paramValue;
	}

}
