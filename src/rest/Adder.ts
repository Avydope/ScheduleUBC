import {Request, Response} from "express";
import {IInsightFacade, InsightDatasetKind, InsightError} from "../controller/IInsightFacade";

export default class Adder {

	public static async performAdd(facade: IInsightFacade, id: string, kind: string, body: Buffer): Promise<string[]> {
		if (kind === "courses") {
			const datasetKind = InsightDatasetKind.Courses;
			return await facade.addDataset(id, body.toString("base64"), datasetKind);
		} else if (kind === "rooms") {
			const datasetKind = InsightDatasetKind.Rooms;
			return await facade.addDataset(id, body.toString("base64"), datasetKind);
		} else {
			return Promise.reject(new InsightError("Error with kind"));
		}
	}
}
