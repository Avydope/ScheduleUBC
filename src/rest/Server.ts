import express, {Application, Request, Response} from "express";
import * as http from "http";
import cors from "cors";
import Echoer from "./Echoer";
import Adder from "./Adder";
import Remover from "./Remover";
import Querier from "./Querier";
import Lister from "./Lister";
import {IInsightFacade, NotFoundError} from "../controller/IInsightFacade";
import InsightFacade from "../controller/InsightFacade";

export default class Server {
	private readonly port: number;
	private express: Application;
	private server: http.Server | undefined;
	public facade: IInsightFacade;

	constructor(port: number) {
		console.info(`Server::<init>( ${port} )`);
		this.port = port;
		this.express = express();
		this.facade = new InsightFacade();

		this.registerMiddleware();
		this.registerRoutes();

		// NOTE: you can serve static frontend files in from your express server
		// by uncommenting the line below. This makes files in ./frontend/public
		// accessible at http://localhost:<port>/
		this.express.use(express.static("./frontend/public"));
	}

	/**
	 * Starts the server. Returns a promise that resolves if success. Promises are used
	 * here because starting the server takes some time and we want to know when it
	 * is done (and if it worked).
	 *
	 * @returns {Promise<void>}
	 */
	public start(): Promise<void> {
		return new Promise((resolve, reject) => {
			console.info("Server::start() - start");
			if (this.server !== undefined) {
				console.error("Server::start() - server already listening");
				reject();
			} else {
				this.server = this.express.listen(this.port, () => {
					console.info(`Server::start() - server listening on port: ${this.port}`);
					resolve();
				}).on("error", (err: Error) => {
					// catches errors in server start
					console.error(`Server::start() - server ERROR: ${err.message}`);
					reject(err);
				});
			}
		});
	}

	/**
	 * Stops the server. Again returns a promise so we know when the connections have
	 * actually been fully closed and the port has been released.
	 *
	 * @returns {Promise<void>}
	 */
	public stop(): Promise<void> {
		console.info("Server::stop()");
		return new Promise((resolve, reject) => {
			if (this.server === undefined) {
				console.error("Server::stop() - ERROR: server not started");
				reject();
			} else {
				this.server.close(() => {
					console.info("Server::stop() - server closed");
					resolve();
				});
			}
		});
	}

	// Registers middleware to parse request before passing them to request handlers
	private registerMiddleware() {
		// JSON parser must be place before raw parser because of wildcard matching done by raw parser below
		this.express.use(express.json());
		this.express.use(express.raw({type: "application/*", limit: "10mb"}));

		// enable cors in request headers to allow cross-origin HTTP requests
		this.express.use(cors());
	}

	// Registers all request handlers to routes
	private registerRoutes() {
		// This is an example endpoint this you can invoke by accessing this URL in your browser:
		// http://localhost:4321/echo/hello
		this.express.get("/echo/:msg", Server.echo);

		// TODO: your other endpoints should go here
		this.express.put("/dataset/:id/:kind", this.add.bind(this));
		this.express.delete("/dataset/:id", this.remove.bind(this));
		this.express.post("/query", this.query.bind(this));
		this.express.get("/datasets", this.list.bind(this));

	}

	// The next two methods handle the echo service.
	// These are almost certainly not the best place to put these, but are here for your reference.
	// By updating the Server.echo function pointer above, these methods can be easily moved.
	private static echo(req: Request, res: Response) {
		try {
			console.log(`Server::echo(..) - params: ${JSON.stringify(req.params)}`);
			const response = Echoer.performEcho(req.params.msg);
			res.status(200).json({result: response});
		} catch (err) {
			res.status(400).json({error: err});
		}
	}

	public async add(req: Request, res: Response) {
		console.log(`Server::add(..) - params: ${JSON.stringify(req.params)}`);
		Adder.performAdd(this.facade, req.params.id, req.params.kind, req.body)
			.then((result) => {
				res.status(200).json({result: result});
				console.log(result);
			})
			.catch((err) => {
				res.status(400).json({error: err.message});
				console.log(err.name + " - " + err.message);
			});
	}

	public remove (req: Request, res: Response){
		console.log(`Server::remove(..) - params: ${JSON.stringify(req.params)}`);
		Remover.performRemove(this.facade, req.params.id)
			.then((result) => {
				res.status(200).json({result: result});
				console.log(result);
			})
			.catch((err) => {
				if (err instanceof NotFoundError) {
					res.status(404).json({error: err.message});
					console.log(err.name + " - " + err.message);
				} else {
					res.status(400).json({error: err.message});
					console.log(err.name + " - " + err.message);
				}
			});
	}

	public query (req: Request, res: Response){
		Querier.performQuery(this.facade, req.body).then((result) => {
			res.status(200).json({result: result});
			console.log(result);
		})
			.catch((err) => {
				res.status(400).json({error: err.message});
				console.log(err.name + " - " + err.message);
			});


	}


	public list (req: Request, res: Response){
		Lister.performList(this.facade)
			.then((result) => {
				res.status(200).json({result: result});
				console.log(result);
			});
	}


}
