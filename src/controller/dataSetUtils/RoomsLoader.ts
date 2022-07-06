import JSZip from "jszip";
import parse5 from "parse5";
import GeoParser from "./GeoParser";

export default  class RoomsLoader {
	public async loadRooms(content: string): Promise<any[]> {
		const zipContent = new JSZip();
		return new Promise((resolve, reject) => {
			try{
				zipContent.loadAsync(content, {base64: true})
					.then(async (zip) => {
						// parse index.htm for buildings
						let index = zip.folder("rooms")?.file("index.htm");
						if (index != null){
							let indexString = await index.async("string");
							let text = await parse5.parse(indexString);
							let buildings = await this.getBuildings(text);
							// parse rooms from buildings
							let rooms = await this.getRooms(buildings, zip);
							return resolve(rooms);
						} else{
							console.log("index not found");
							return reject();
						}
					}).catch(() => {
						return reject();
					});
			} catch (e) {
				console.log(e);
				return reject();
			}

		});
	}

	private async getBuildings(text: parse5.Document){
		// get all the tables
		let tableData: any[];
		let childNodes: any[] = [];
		for (let obj of text.childNodes){
			childNodes.push(obj);
		}
		tableData = RoomsLoader.getElementHtml(childNodes, "td");
		// find the right table rows
		let buildings = [];
		for (let dataCell of tableData){
			if (dataCell?.attrs[0]?.value === "views-field views-field-title") {
				for (let childNode of dataCell.childNodes) {
					if (childNode?.nodeName === "a" && childNode?.attrs[0]?.name === "href"){
						let roomFile = childNode.attrs[0].value;
						buildings.push(roomFile);
					}
				}
			}
		}
		return buildings;
	}

	private async getRooms(buildings: any[], zip: JSZip): Promise<any[]>{
		return await new Promise((resolve) => {
			const promises: any[] = [];
			let rooms: any[] = [];
			for (let i in buildings){
				buildings[i] = buildings[i].substring(2);
			}
			zip.folder("rooms")?.forEach(function (relativePath, file) {
				if (buildings.includes(relativePath)){
					promises.push(zip.file(file.name)?.async("string"));
				}
			});
			Promise.all(promises).then(function (data) {
				return data;
			}).then(async (data) => {
				for (let i in data){
					data[i] = parse5.parse(data[i]);
				}
				return data;
			}).then(async (data) => {
				for (let buildingFile of data) {
					rooms = rooms.concat(RoomsLoader.getRoomInFiles(buildingFile));
				}
			}).then(() => {
				let addressesUnique = new Set<string>();
				for (let roomItem of rooms) {
					addressesUnique.add(roomItem?.address);
				}
				let addressArray: string[] = Array.from(addressesUnique);
				let promisesLonLat: any[] = [];
				let geoParser = new GeoParser();
				addressArray.forEach(function(item) {
					promisesLonLat.push(geoParser.getLongLat(item));
				});
				Promise.all(promisesLonLat).then((result) => {
					let geoMap = new Map();
					for (let i in result){
						geoMap.set(addressArray[i], result[i]);
					}
					for (let room of rooms) {
						let geoObj = geoMap.get(room.address);
						room.lon = parseFloat(geoObj?.lon);
						room.lat = parseFloat(geoObj?.lat);
					}
				}).then(() => {
					return resolve(rooms);
				});
			});
		});
	}

	private static getRoomInFiles (buildingFile: any) {
		let rooms: any[] = [];
		let childNodes: any[] = [];
		for (let obj of buildingFile.childNodes){
			childNodes.push(obj);
		}
		let buildingInfoDiv = RoomsLoader.getBuildingInfoDiv(childNodes);
		let [full, address] = RoomsLoader.getNameAddress(buildingInfoDiv[0]);
		for (let obj of buildingFile.childNodes){
			childNodes.push(obj);
		}
		let tableRows = RoomsLoader.getElementHtml(childNodes, "tr");
		for (let row of tableRows){
			let [number, seats, type, furniture, href] = RoomsLoader.getRoomNumSeatTypeFurn(row);
			let short = href?.split("/")?.pop()?.split("-")[0];
			if (number !== undefined) {
				// Fix lat, lon outside function
				let [tempLat, tempLon] = [0,0];
				let items = [number, seats, type, furniture, href, full, short, address, tempLat, tempLon];
				let room = RoomsLoader.createRoomObject(items);
				rooms.push(room);
			}
		}
		return rooms;
	}

	private static getRoomNumSeatTypeFurn(row: any) {
		let numberNode, seatsNode, typeNode, furnitureNode, hrefNode;
		let number, seats, type, furniture, href;
		for (let childNode of row.childNodes){
			if (childNode?.attrs === undefined){
				continue;
			} else if (childNode?.attrs[0]?.value === "views-field views-field-field-room-number"){
				numberNode = childNode;
			} else if (childNode?.attrs[0]?.value === "views-field views-field-field-room-capacity"){
				seatsNode = childNode;
			} else if (childNode?.attrs[0]?.value === "views-field views-field-field-room-type"){
				typeNode = childNode;
			} else if (childNode?.attrs[0]?.value === "views-field views-field-field-room-furniture"){
				furnitureNode = childNode;
			}
		}
		if (numberNode !== undefined){
			number = numberNode.childNodes[1]?.childNodes[0]?.value?.replace("/n", "")?.trim();
			href = numberNode.childNodes[1]?.attrs[0]?.value?.replace("/n", "")?.trim();
		}
		if (seatsNode !== undefined) {
			seats = seatsNode.childNodes[0].value?.replace("/n", "")?.trim();
		}
		if (typeNode !== undefined){
			type = typeNode.childNodes[0].value?.replace("/n", "")?.trim();
		}
		if (furnitureNode !== undefined){
			furniture = furnitureNode.childNodes[0].value?.replace("/n", "")?.trim();
		}
		return [number, seats, type, furniture, href];

	}

	private static getNameAddress(div: any) {
		let full, address;
		let childNodes = [];
		for (let childNode of div.childNodes){
			childNodes.push(childNode);
		}
		full = childNodes[1]?.childNodes[0]?.childNodes[0]?.value;
		address = childNodes[3]?.childNodes[0]?.childNodes[0]?.value;
		return [full, address];
	}

	private static getElementHtml(childNodes: any[], element: string): any[]{
		let data = [];
		while (childNodes.length > 0){
			let obj = childNodes[0];
			if (obj.childNodes === undefined) {
				childNodes.shift();
			} else {
				for (let childNode of obj.childNodes){
					childNodes.push(childNode);
					if (childNode.nodeName === element) {
						data.push(childNode);
					}
				}
				childNodes.shift();
			}
		}
		return data;
	}

	private static getBuildingInfoDiv (childNodes: any[]){
		let data = [];
		while (childNodes.length > 0){
			let obj = childNodes[0];
			if (obj.childNodes === undefined) {
				childNodes.shift();
			} else {
				for (let childNode of obj.childNodes){
					childNodes.push(childNode);
					if (childNode?.attrs !== undefined && childNode?.attrs[0]?.value === "building-info"){
						data.push(childNode);
					}
				}
				childNodes.shift();
			}
		}
		return data;

	}

	private static createRoomObject(items: string[]) {
		let [number, seats, type, furniture, href, full, short, address, lat, long] = items;
		let room = {
			fullname: full,
			shortname: short,
			number: number,
			name: short + "_" + number,
			address: address,
			lat: lat,
			lon: long,
			seats: parseInt(seats, 10),
			type: type,
			furniture: furniture,
			href: href,
		};
		return room;
	}
}
