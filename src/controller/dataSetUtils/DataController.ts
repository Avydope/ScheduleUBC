import fs = require("fs");
import {InsightDatasetKind} from "../IInsightFacade";

export default class DataController{

	public async saveToDisk(
		content: string,
		dataset: any[],
		id: string,
		kind: InsightDatasetKind
	){
		try{
			if (!fs.existsSync("./data")) {
				fs.mkdirSync("./data");
			}
			let datasetString = JSON.stringify(dataset);
			fs.writeFileSync("./data/" +  id + ".json", datasetString);
			// fs.writeFileSync(`data/${id}.json`, JSON.stringify(insightDataSet));
			// dataSetsIDs.push(id);
			// dataSets.set(id, dataset);
		} catch (err){
			return err;
		}

	}

	public getDiskDatasets(): string[]{
		if (!fs.existsSync("./data")) {
			return [];
		}
		let files = fs.readdirSync("./data/");
		files = files.map(function (item){
			return item.replace(/\.[^/.]+$/, "");
		});
		return files;
	}

	public checkLocalDiskParity(localDatasets: string[]): string[]{
		let diskDatasets = this.getDiskDatasets();

		let onDiskNotLocalIDs: any[] = [];

		// Convert to set for easier parsing
		let localSetDatasets = new Set(localDatasets);

		// add id that is on disk but not on local to array
		for (let dataset of diskDatasets){
			if (!localSetDatasets.has(dataset)) {
				onDiskNotLocalIDs.push(dataset);
			}
		}

		return onDiskNotLocalIDs;
	}

	public parseDiskJSONData(id: string): any{
		let JSONData: object = {};
		try{
			let rawData = fs.readFileSync("./data/" +  id + ".json");
			JSONData = JSON.parse(rawData.toString());
		} catch (err){
			console.log("Error with reading dataset on disk. Error: \n" + err);
			return JSONData;
		}
		return JSONData;
	}

	public removeFromDisk(id: string) {
		try{
			fs.unlinkSync("./data/" +  id + ".json");
		} catch (err){
			throw new Error();
		}
	}


}
