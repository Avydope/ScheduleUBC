import * as http from "http";
import {GeoResponse} from "../IInsightFacade";

export default class GeoParser {


	public getLongLat(address: string): Promise<GeoResponse>{
		return new Promise<GeoResponse>( (resolve, reject) => {
			let geo: GeoResponse;
			let httpAddress = "http://cs310.students.cs.ubc.ca:11316/api/v1/project_team628/" + address;
			httpAddress = httpAddress.split(" ").join("%20");
			http.get(httpAddress, (res: any) => {
				res.setEncoding("utf8");
				let data = "";
				res.on("data", (chunk: any) => data += chunk);
				res.on("end", () => {
					try {
						let parsedData = JSON.parse(data);
						geo = {
							lat: parsedData.lat,
							lon: parsedData.lon
						};
						return resolve(geo);
					} catch (e) {
						geo = {
							error: "error"
						};
						return resolve(geo);
					}
				});
			}).on("error", (e) => {
				console.error("Got error");
				return reject(geo);
			});
		});

	}


}
