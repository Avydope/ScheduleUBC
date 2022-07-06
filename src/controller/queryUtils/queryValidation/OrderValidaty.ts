import {InsightError} from "../../IInsightFacade";
import {isKeyInApply} from "./ColumnsValidaty";

/**
 * Throws an exception if the order section is invalid, otherwise returns true
 * @param query
 */
export function validateOrder(query: any) {
	const queryObject: any = query;

	if (queryObject.OPTIONS.ORDER === undefined) {
		// This query does not have an order
		return {};
	}
	if (queryObject.OPTIONS.ORDER instanceof Array) {
		throw new InsightError();
	}
	let key = queryObject.OPTIONS.ORDER;
	let keyType = typeof key;
	if(keyType === "string" && !(query.TRANSFORMATIONS)) {
		key = validateUnderScoreKey(key);
	}
	if(query.TRANSFORMATIONS){
		let applyValues: any = Object.values(query.TRANSFORMATIONS.APPLY);
		if(keyType === "string" && !isKeyInApply(applyValues, key)) {
			throw new InsightError();
		} else if(keyType === "object") {
			/** TODO: accept more cases
			 */
			if (Object.keys(key)[0] !== "dir" || Object.keys(key)[1] !== "keys") {
				throw new InsightError();
			}
			if (Object.values(key)[0] !== "UP" && Object.values(key)[0] !== "DOWN") {
				throw new InsightError();
			}
			if (!(key.keys instanceof Array)) {
				throw new InsightError();
			}
			for(let orderKey of key.keys) {
				if(!isKeyInApply(applyValues, orderKey) && !validateUnderScoreKey(orderKey)) {
					throw new InsightError();
				}
			}
		}
	}

	return key;

}

function validateUnderScoreKey(key: any) {
	let underScoreCounter = 0;
	for (let i of key) {
		if (i === "_") {
			underScoreCounter++;
		}
	}

	if (underScoreCounter > 1) {
		throw new InsightError();
	}

	let dataset = key.split("_");
	if (dataset.length > 2) {
		throw new InsightError();
	}

	return {dataset: dataset[0], key: dataset[1]};
}
