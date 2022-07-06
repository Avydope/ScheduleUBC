import {Request, Response} from "express";
import InsightFacade from "../controller/InsightFacade";
import {IInsightFacade} from "../controller/IInsightFacade";

export default class Querier {

	public static performQuery(facade: IInsightFacade, body: JSON) {
		console.log(body);
		return facade.performQuery(body);
	}

}
