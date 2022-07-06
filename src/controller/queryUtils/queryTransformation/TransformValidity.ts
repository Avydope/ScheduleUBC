import IDChecker from "../../dataSetUtils/IDChecker";
import {InsightError} from "../../IInsightFacade";
import {isKeyInApply} from "../queryValidation/ColumnsValidaty";
import undefinedError = Mocha.utils.undefinedError;

export const APPLY_KEYS = [
	"MAX",
	"MIN",
	"AVG",
	"COUNT",
	"SUM"
];


/**
 * checks the overall validity of the transformation
 * @param transformation
 */
export function isTransformationValid(
	transformation: any,
	mField: any,
	sField: any,
	columns: any
) {
	if (!isTransformationExist(transformation)) {
		return false;
	} else if (Object.keys(transformation).length !== 2) {
		return false;
	} else if (transformation.GROUP === null || transformation.GROUP === undefined
		|| transformation.APPLY === null || transformation.APPLY === undefined) {
		return false;
	}
	isColumnInApplyOrGroup(transformation, columns);
	return validateApply(transformation.APPLY, mField, sField)
		&& validateGroup(transformation.GROUP, mField, sField);

}

function isColumnInApplyOrGroup(transformation: any, columns: any) {
	let applies = Object.values(transformation.APPLY);
	columns.forEach((column: any) => {
		if (!transformation.GROUP.includes(column) && !isKeyInApply(applies, column)) {
			throw new InsightError();
		}
	});
}

/**
 * validate the groups in transformation
 */
function validateGroup(group: any, mField: any, sField: any) {
	if (group.length === 0 || group === undefined || group === null) {
		return false;
	}
	if (!(group instanceof Array)) {
		return false;
	}
	for (let key of Object.values(group)) {
		if (!validateFieldKey(key, mField, sField)) {
			return false;
		}
	}
	return true;
}


function validateFieldKey(key: any, mField: any, sField: any) {
	let keySplit: string[] = key.split("_");
	let idCheck = new IDChecker();
	if (typeof keySplit[1] !== "string") {
		return false;
	}
	if (keySplit.length !== 2) {
		return false;
	}
	return idCheck.checkValidID(key)
		&& (sField.includes(keySplit[1]) || mField.includes(keySplit[1]));
}


/**
 * validate apply in transformation
 */
function validateApply(apply: any, mField: any, sField: any) {
	if (!(apply instanceof Array) || apply === undefined || apply === null) {
		return false;
	}
	for (let rule of Object.values(apply)) {
		if (!validateRule(rule, mField, sField)) {
			return false;
		}
	}
	return true;
}

function validateRule(rule: any, mField: any, sField: any) {
	const id = /^.*_.*$/;
	if (!isTransformationExist(rule)) {
		return false;
	} else if (id.test(Object.keys(rule)[0])) {
		return false;
	} else if (Object.keys(rule).length !== 1) {
		return false;
	}
	return validateToken(Object.values(rule)[0], mField, sField);
}

/**
 * Validates token as well as token type
 * @param token
 * @param mField
 * @param sField
 */
function validateToken(token: any, mField: any, sField: any) {
	let tmp: any = Object.values(token)[0];
	let tokenField = tmp.split("_")[1];
	if (!isTransformationExist(token)) {
		return false;
	} else if (Object.keys(token).length !== 1) {
		return false;
	}
	if (!APPLY_KEYS.includes(Object.keys(token)[0])) {
		return false;
	}
	if (typeof tokenField !== "string") {
		return false;
	}
	if (Object.keys(token)[0] === "COUNT") {
		return (mField.includes(tokenField) || sField.includes(tokenField));
	} else {
		return mField.includes(tokenField);
	}
}

/**
 * check if transformation is an object that exists
 * @param transformation
 */
function isTransformationExist(transformation: any) {
	if (typeof transformation !== "object" || transformation instanceof Array) {
		return false;
	} else if (transformation === null || transformation === undefined) {
		return false;
	} else if (Object.keys(transformation).length === 0) {
		return false;
	}
	return true;
}
