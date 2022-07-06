import Server from "../../src/rest/Server";
import InsightFacade from "../../src/controller/InsightFacade";
import chai, {expect, use} from "chai";
import chaiHttp from "chai-http";
import * as fs from "fs-extra";
import {InsightDatasetKind} from "../../src/controller/IInsightFacade";

describe("Facade D3", function () {

	let facade: InsightFacade;
	let server: Server;

	const datasetsToLoad: {[key: string]: string} = {
		courses: "./test/resources/archives/courses.zip",
		nonZip: "./test/resources/archives/nonZip.txt",
		rooms: "./test/resources/archives/rooms.zip",
	};

	const persistDir = "./data";
	const datasetContents = new Map<string, any>();

	const SERVER_URL = "http://localhost:1234";

	use(chaiHttp);

	before(function () {
		fs.removeSync(persistDir);
		facade = new InsightFacade();
		server = new Server(1234);
		server.start();
		for (const key of Object.keys(datasetsToLoad)) {
			const content = fs.readFileSync(datasetsToLoad[key]);
			datasetContents.set(key, content);
		}
	});

	after(function () {
		server.stop();
		fs.removeSync(persistDir);
	});

	beforeEach(function () {
		// fs.removeSync(persistDir);
		// might want to add some process logging here to keep track of what"s going on
	});

	afterEach(function () {
		// might want to add some process logging here to keep track of what"s going on
	});

	describe("Add", function () {

		beforeEach(function () {
			fs.removeSync(persistDir);
		});

		it("PUT test for courses dataset", function () {
			try {
				return chai.request(SERVER_URL)
					.put("/dataset/courses/courses")
					.send(datasetContents.get("courses"))
					.set("Content-Type", "application/x-zip-compressedx-zip-compressed")
					.then(function (res: ChaiHttp.Response) {
						expect(res.status).to.be.equal(200);
						expect(res.body).to.deep.equal({result: ["courses"]});
					})
					.catch(function (err) {
						// some logging here please!
						expect.fail();
					});
			} catch (err) {
				// and some more logging here!
				expect.fail();
			}
		});

		it("PUT test for rooms dataset", function () {
			try {
				return chai.request(SERVER_URL)
					.put("/dataset/rooms/rooms")
					.send(datasetContents.get("rooms"))
					.set("Content-Type", "application/x-zip-compressedx-zip-compressed")
					.then(function (res: ChaiHttp.Response) {
						expect(res.status).to.be.equal(200);
						expect(res.body).to.deep.equal({result: ["rooms"]});
					})
					.catch(function (err) {
						// some logging here please!
						expect.fail();
					});
			} catch (err) {
				// and some more logging here!
				expect.fail();
			}
		});

		it("PUT test for invalid type", function () {
			try {
				return chai.request(SERVER_URL)
					.put("/dataset/nonZip/rooms")
					.send(datasetContents.get("nonZip"))
					.set("Content-Type", "application/x-zip-compressedx-zip-compressed")
					.then(function (res: ChaiHttp.Response) {
						expect(res.status).to.be.equal(400);
					})
					.catch(function (err) {
						// some logging here please!
						expect.fail();
					});
			} catch (err) {
				// and some more logging here!
				expect.fail();
			}
		});
	});

	describe("Remove", function () {
		beforeEach(function () {
			fs.removeSync(persistDir);
		});

		it("404 DELETE test for no dataset", function () {
			try {
				return chai.request(SERVER_URL)
					.delete("/dataset/courses")
					.then(function (res: ChaiHttp.Response) {
						expect(res.status).to.be.equal(404);
					})
					.catch(function (err) {
						// some logging here please!
						expect.fail();
					});
			} catch (err) {
				// and some more logging here!
				expect.fail();
			}
		});

		it("400 DELETE test for no dataset", function () {
			try {
				return chai.request(SERVER_URL)
					.delete("/dataset/_")
					.then(function (res: ChaiHttp.Response) {
						expect(res.status).to.be.equal(400);
					})
					.catch(function (err) {
						// some logging here please!
						expect.fail();
					});
			} catch (err) {
				// and some more logging here!
				expect.fail();
			}
		});

		it("200 DELETE test for one dataset", async function () {
			try {
				return await chai.request(SERVER_URL)
					.put("/dataset/courses/courses")
					.send(datasetContents.get("courses"))
					.set("Content-Type", "application/x-zip-compressedx-zip-compressed")
					.then(async () => {
						await chai.request(SERVER_URL)
							.delete("/dataset/courses")
							.then(function (res: ChaiHttp.Response) {
								expect(res.status).to.be.equal(200);
								expect(res.body).to.deep.equal({result: "courses"});
							})
							.catch(function (err) {
								// some logging here please!
								expect.fail();
							});
					})
					.catch(function (err) {
						// some logging here please!
						expect.fail();
					});
			} catch (err) {
				// and some more logging here!
				expect.fail();
			}
		});

		it("404 DELETE test for one dataset", async function () {
			try {
				return await chai.request(SERVER_URL)
					.put("/dataset/courses/courses")
					.send(datasetContents.get("courses"))
					.set("Content-Type", "application/x-zip-compressedx-zip-compressed")
					.then(async () => {
						await chai.request(SERVER_URL)
							.delete("/dataset/courses404")
							.then(function (res: ChaiHttp.Response) {
								expect(res.status).to.be.equal(404);
							})
							.catch(function (err) {
								// some logging here please!
								expect.fail();
							});
					})
					.catch(function (err) {
						// some logging here please!
						expect.fail();
					});
			} catch (err) {
				// and some more logging here!
				expect.fail();
			}
		});

		it("400 DELETE test for one dataset", async function () {
			try {
				return await chai.request(SERVER_URL)
					.put("/dataset/courses/courses")
					.send(datasetContents.get("courses"))
					.set("Content-Type", "application/x-zip-compressedx-zip-compressed")
					.then(async () => {
						await chai.request(SERVER_URL)
							.delete("/dataset/_")
							.then(function (res: ChaiHttp.Response) {
								expect(res.status).to.be.equal(400);
							})
							.catch(function (err) {
								// some logging here please!
								expect.fail();
							});
					})
					.catch(function (err) {
						// some logging here please!
						expect.fail();
					});
			} catch (err) {
				// and some more logging here!
				expect.fail();
			}
		});
	});

	describe("List", function () {

		beforeEach(function () {
			fs.removeSync(persistDir);
		});

		it("GET test for no datasets", async function () {
			try {
				return await chai.request(SERVER_URL)
					.get("/datasets")
					.then(function (res: ChaiHttp.Response) {
						expect(res.status).to.be.equal(200);
						expect(res.body).to.deep.equal({result: []});
					})
					.catch(function (err) {
						// some logging here please!
						expect.fail();
					});
			} catch (err) {
				// and some more logging here!
				expect.fail();
			}
		});

		it("GET test for one dataset", async function () {
			try {
				return await chai.request(SERVER_URL)
					.put("/dataset/courses/courses")
					.send(datasetContents.get("courses"))
					.set("Content-Type", "application/x-zip-compressedx-zip-compressed")
					.then(async () => {
						await chai.request(SERVER_URL)
							.get("/datasets")
							.then(function (res: ChaiHttp.Response) {
								expect(res.status).to.be.equal(200);
								expect(res.body).to.deep.equal({
									result: [
										{
											id: "courses",
											kind: InsightDatasetKind.Courses,
											numRows: 64612,
										},
									]
								});
							})
							.catch(function (err) {
								// some logging here please!
								expect.fail();
							});
					})
					.catch(function (err) {
						// some logging here please!
						expect.fail();
					});
			} catch (err) {
				// and some more logging here!
				expect.fail();
			}
		});

		it("GET test for two datasets", async function () {
			try {
				return await chai.request(SERVER_URL)
					.put("/dataset/courses/courses")
					.send(datasetContents.get("courses"))
					.set("Content-Type", "application/x-zip-compressedx-zip-compressed")
					.then(async () => {
						await chai.request(SERVER_URL)
							.put("/dataset/rooms/rooms")
							.send(datasetContents.get("rooms"))
							.set("Content-Type", "application/x-zip-compressedx-zip-compressed")
							.then(async () => {
								await chai.request(SERVER_URL)
									.get("/datasets")
									.then(function (res: ChaiHttp.Response) {
										expect(res.status).to.be.equal(200);
										expect(res.body).to.deep.equal({
											result: [
												{
													id: "courses",
													kind: InsightDatasetKind.Courses,
													numRows: 64612,
												},
												{
													id: "rooms",
													kind: InsightDatasetKind.Rooms,
													numRows: 364,
												},
											]
										});
									})
									.catch(function (err) {
										// some logging here please!
										expect.fail();
									});
							})
							.catch(function (err) {
								// some logging here please!
								expect.fail();
							})
							.catch(function (err) {
								// some logging here please!
								expect.fail();
							});
					})
					.catch(function (err) {
						// some logging here please!
						expect.fail();
					});
			} catch (err) {
				// and some more logging here!
				expect.fail();
			}
		});
	});


	describe("Query", function () {

		before(async function () {
			await chai.request(SERVER_URL)
				.put("/dataset/courses/courses")
				.send(datasetContents.get("courses"))
				.set("Content-Type", "application/x-zip-compressedx-zip-compressed")
				.catch(function (err) {
					console.log("Error adding dataset!");
					console.log(err);
				});
		});

		it("POST test 200", async function () {
			try {
				return await chai.request(SERVER_URL)
					.post("/query")
					.send({
						WHERE: {
							OR: [
								{
									AND: [
										{
											GT: {
												courses_avg: 98
											}
										},
										{
											IS: {
												courses_dept: "apsc"
											}
										}
									]
								},
								{
									EQ: {
										courses_avg: 99
									}
								},
								{
									AND: [
										{
											GT: {
												courses_avg: 99
											}
										}
									]
								}
							]
						},
						OPTIONS: {
							COLUMNS: [
								"courses_dept",
								"courses_id",
								"courses_avg"
							],
							ORDER: "courses_avg"
						}
					})
					.then(function (res: ChaiHttp.Response) {
						expect(res.status).to.be.equal(200);
						expect(res.body).to.deep.equal({
							result: [
								{
									courses_dept: "cnps",
									courses_id: "574",
									courses_avg: 99.19
								},
								{
									courses_dept: "math",
									courses_id: "527",
									courses_avg: 99.78
								},
								{
									courses_dept: "math",
									courses_id: "527",
									courses_avg: 99.78
								}
							]
						});
					})
					.catch(function (err) {
						// some logging here please!
						expect.fail();
					});
			} catch (err) {
				// and some more logging here!
				expect.fail();
			}
		});

		it("POST test 400", async function () {
			try {
				return await chai.request(SERVER_URL)
					.post("/query")
					.send("")
					.then(function (res: ChaiHttp.Response) {
						expect(res.status).to.be.equal(400);
					})
					.catch(function (err) {
						// some logging here please!
						expect.fail();
					});
			} catch (err) {
				// and some more logging here!
				expect.fail();
			}
		});
	});

	describe("Server", function () {

		beforeEach(function () {
			fs.removeSync(persistDir);
		});

		it("Server stop and reset on different port", function () {
			try {
				return chai.request(SERVER_URL)
					.put("/dataset/rooms/rooms")
					.send(datasetContents.get("rooms"))
					.set("Content-Type", "application/x-zip-compressedx-zip-compressed")
					.then(async () => {
						await server.stop();
					}).then(async () => {
						server = new Server(6666);
						await server.start();
					}).then(async () => {
						await chai.request("http://localhost:6666")
							.get("/datasets")
							.then(function (res: ChaiHttp.Response) {
								expect(res.status).to.be.equal(200);
								expect(res.body).to.deep.equal({
									result: [
										{
											id: "rooms",
											kind: InsightDatasetKind.Rooms,
											numRows: 364,
										},
									]
								});
							})
							.catch(function (err) {
								// some logging here please!
								expect.fail();
							});
					})
					.catch(function (err) {
						// some logging here please!
						expect.fail();
					});
			} catch (err) {
				// and some more logging here!
				expect.fail();
			}
		});
	});
});
