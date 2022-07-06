import {applyTransformation} from "./QueryTransformations";
import {InsightError} from "../../IInsightFacade";
import {isTransformationValid} from "./TransformValidity";
const mFields = ["avg", "pass", "fail", "audit", "year", "lat", "lon", "seats"];
const sFields = ["fullname", "shortname", "number", "name", "address", "type", "furniture",
	"href", "dept", "id", "instructor", "title", "uuid"];


export function transform(query: any, dataset: any) {
	let transformation = query.TRANSFORMATIONS;
	if(transformation === null) {
		return dataset;
	}
	let transformedSoFar: any[] = [dataset];
	if(query.TRANSFORMATIONS === undefined || query.TRANSFORMATIONS === null) {
		throw new InsightError();
	}
	let columns = query.OPTIONS.COLUMNS;
	if(!isTransformationValid(transformation, mFields, sFields, columns)){
		throw new InsightError();
	}
	let groupKeys: string[] = transformation.GROUP;
	if(groupKeys.length !== 0 || groupKeys !== undefined) {
		transformedSoFar = transformGroup(transformedSoFar, groupKeys);
	}
	let apply = transformation.APPLY;
	let columnKeys = Object.values(query.OPTIONS.COLUMNS);
	if(apply) {
		transformedSoFar = transformHelper(transformedSoFar, columnKeys, apply);
	}
	return transformedSoFar;
}

function transformHelper(
	group: any[][],
	columns: any[],
	applyTokens: object[]) {

	return group.map(function(data: any) {
		const arr: {[key: string]: any} = {};
		columns.forEach(function(key: any) {
			if(Object.keys(data[0]).includes(key)) {
				arr[key] = data[0][key];
			}
		});
		applyTokens.forEach(function(key: any) {
			const [transformationKey, keyObject]: any = Object.entries(key)[0];
			const [transformationCode, keyValue]: any = Object.entries(keyObject)[0];
			let ret = applyTransformation(data, transformationCode, keyValue);
			arr[transformationKey] = ret;
		});
		return arr;
	});
}

function transformGroup(group: any, keys: any): any[][]{
	let key = keys.shift();
	if(key === null || key === undefined) {
		return group;
	}
	let groupSoFar = recursionHelper(group, key);
	return transformGroup(groupSoFar, keys);
}

/**
 * updates the array of groups
 * @param groups
 * @param key
 */
function recursionHelper(groups: any[], key: any) {
	let result: any[] = [];
	groups.forEach(function(array: any) {
		const tfs: {[value: string]: any[]} = {};
		array.forEach(function(dataObject: any) {
			if(!tfs[dataObject[key]]) {
				tfs[dataObject[key]] = [];
				tfs[dataObject[key]].push(dataObject);
			} else {
				tfs[dataObject[key]].push(dataObject);
			}
		});
		let allArray = Object.values(tfs);
		allArray.forEach(function(arr: any) {
			result.push(arr);
		});
	});
	return result;
}


