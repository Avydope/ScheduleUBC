import {create} from "domain";
import undefinedError = Mocha.utils.undefinedError;
import {InsightError} from "../../IInsightFacade";

export function querySort(data: any[], dir: string, keys: string[],) {
	if (keys.length === 0) {
		throw new InsightError();
	}
	for (let key of keys.reverse()) {
		data.sort((value1: any, value2: any) => {
			switch (dir) {
				case "DOWN":
					return sortHelper(key, value2, value1);
					break;
				case "UP":
					return sortHelper(key, value1, value2);
					break;
				default:
					return sortHelper(key, value2, value1);
					break;
			}

		});
	}
}

function sortHelper(key: any, value1: any, value2: any) {

	let ret;
	if (value1[key] === undefined || value2[key] === undefined) {
		throw new InsightError();
	}
	if (typeof value1[key] === "string") {
		if (value1[key].localeCompare(value2[key]) !== 0) {
			ret = value1[key].localeCompare(value2[key]);
		}
	} else {
		if (value1[key] > value2[key]) {
			ret = 1;
		} else if (value2[key] > value1[key]) {
			ret = -1;
		} else {
			ret = 0;
		}
	}
	return ret;
}

