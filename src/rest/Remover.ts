import {Request, Response} from "express";
import {IInsightFacade, NotFoundError} from "../controller/IInsightFacade";

export default class Remover {

	public static performRemove(facade: IInsightFacade, id: string) {
		return facade.removeDataset(id);
	}
}
