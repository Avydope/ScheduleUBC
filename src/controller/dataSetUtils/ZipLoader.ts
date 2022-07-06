import {InsightDatasetKind} from "../IInsightFacade";
import CoursesLoader from "./CoursesLoader";
import RoomsLoader from "./RoomsLoader";

export default class ZipLoader{

	public async loadDataset(content: string, kind: InsightDatasetKind): Promise<any[]>{
		if (kind === InsightDatasetKind.Courses) {
			let coursesLoader = new CoursesLoader();
			return coursesLoader.loadCourses(content);
		} else if (kind === InsightDatasetKind.Rooms) {
			let roomsLoader = new RoomsLoader();
			return roomsLoader.loadRooms(content);
		} else {
			return Promise.reject("Invalid dataset kind");
		}
	}
}
