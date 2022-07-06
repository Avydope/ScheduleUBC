const COURSE_KEYS: Map<string, string> = new Map<string, string>([
	["dept", "dept"],
	["id", "id"],
	["avg", "avg"],
	["instructor", "instructor"],
	["title", "title"],
	["pass", "pass"],
	["fail", "fail"],
	["audit", "audit"],
	["uuid", "uuid"],
	["year", "year"]
]);

const ROOM_KEYS: Map<string, string> = new Map<string, string>([
	["fullname", "fullname"],
	["shortname", "shortname"],
	["number", "number"],
	["name", "name"],
	["address", "address"],
	["type", "type"],
	["lat", "lat"],
	["lon", "lon"],
	["seats", "seats"],
	["furniture", "furniture"],
	["href", "href"]
]);


/**
 * loop through the sections available in the dataset and see what matches
 * **/
export function processListOfSections(sections: any[], id: string): any[] {
	let processedSections: any[] = [];
	sections.forEach((section) => {
		let newSection: any = {};
		Object.keys(section).forEach((key) => {
			if (COURSE_KEYS.has(key)) {
				ProcessCourseKeys(section, newSection, key, id);
			}
			if (ROOM_KEYS.has(key)) {
				processRoomKeys(section, newSection, key, id);
			}
		});
		processedSections.push(newSection);
	});
	return processedSections;
}

/**
 * process the query sections required
 * **/
function ProcessCourseKeys(oldSection: any, newSection: any, key: string, id: string) {
	if (key === "id") {
		newSection[id + "_" + COURSE_KEYS.get(key)] = oldSection[key].toString();
	} else if (key === "uuid") {
		if (oldSection[key] === "overall") {
			newSection[id + "_" + COURSE_KEYS.get("year")] = 1900;
		} else {
			newSection[id + "_" + COURSE_KEYS.get("uuid")] = oldSection["uuid"].toString();
		}
	} else if (key === "year") {
		if (oldSection[key] === "overall") {
			newSection[id + "_" + COURSE_KEYS.get("year")] = 1900;
		} else {
			newSection[id + "_" + COURSE_KEYS.get("year")] = oldSection["year"];
		}
	} else {
		if (oldSection[key] === "overall") {
			newSection[id + "_" + COURSE_KEYS.get("year")] = 1900;
		} else {
			newSection[id + "_" + COURSE_KEYS.get(key)] = oldSection[key];
		}
	}
}


function processRoomKeys(oldSection: any, newSection: any, key: string, id: string) {
	newSection[id + "_" + ROOM_KEYS.get(key)] = oldSection[key];
}

