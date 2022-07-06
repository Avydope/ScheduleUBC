import Decimal from "decimal.js";

export function applyTransformation(
	group: any[],
	transformationCode: string,
	key: string) {
	switch(transformationCode) {
		case "AVG":
			return avgApply(group, key);
			break;
		case "MAX":
			return maxApply(group, key);
			break;
		case "MIN":
			return minApply(group, key);
			break;
		case "SUM":
			return sumApply(group, key);
			break;
		case "COUNT":
			return countApply(group, key);
			break;
		default:
			throw Error;
	}
}

function avgApply(group: any[], key: string) {
	let avg: Decimal = group.reduce(function(sum: Decimal, data) {
		const dataNum = new Decimal(data[key]);
		return sum.add(dataNum);
	}, new Decimal(0));
	let result = Number((avg.toNumber() / group.length).toFixed(2));
	return result;
}

function maxApply(group: any[], key: string) {
	let max = group.reduce(function(prevMax, currentMax) {
		if(currentMax[key] > prevMax[key]) {
			return currentMax;
		} else {
			return prevMax;
		}
	});
	return max[key];
}

function minApply(group: any[], key: string) {
	let min = group.reduce(function(prevMax, currentMax) {
		if(currentMax[key] < prevMax[key]) {
			return currentMax;
		} else {
			return prevMax;
		}
	});
	return min[key];
}

function countApply(group: any[], key: string) {
	let countList: {[key: string]: any} = {};
	group.forEach(function (data) {
		if(!countList[data[key]]) {
			countList[data[key]] = true;
		}
	});
	let count = Object.entries(countList).length;
	return count;
}

function sumApply(group: any[], key: string) {
	let sum = group.reduce((total, data) => Number(data[key]) + total, 0);
	return Number(sum.toFixed(2));
}
