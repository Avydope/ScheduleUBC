import {validateQuery} from "../../src/controller/queryUtils/queryValidation/QueryValidity";
import {expect} from "chai";
import {InsightError} from "../../src/controller/IInsightFacade";
import {getJsonObject} from "./queryTestUtils";
import exp from "constants";

describe("Test suite for query parsing", function () {
	it("validQueryWithoutOrder", function () {
		let query = getJsonObject("simple.json");
		let testMap = new Map<string, any>();
		testMap.set("courses", "courses");
		let result = validateQuery(query, testMap);
		expect(result).to.be.true;
	});
});
