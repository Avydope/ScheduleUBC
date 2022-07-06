import {Request, Response} from "express";
import {IInsightFacade} from "../controller/IInsightFacade";

export default class Lister {

	public static performList(facade: IInsightFacade) {
		return facade.listDatasets();
	}
}
