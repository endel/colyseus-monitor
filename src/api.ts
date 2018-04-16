import { Server } from "colyseus";
import * as express from "express";

export function getAPI (server: Server) {
    const api = express.Router();
    const handlers = Object.keys((<any>server.matchMaker).handlers);

    api.get("/", (req: express.Request, res: express.Response) => {
        const result: any = {};

        Promise.all(
            handlers.map((handler) => {
                return server.matchMaker.
                    getAvailableRooms(handler).
                    then((rooms: any[]) => {
                        result[handler] = rooms;
                    }).
                    catch((err) => console.error(err));
            })
        ).then(() => res.json(result));
    });

    api.get("/room", (req: express.Request, res: express.Response) => {
        const roomId = req.query.roomId;
        server.matchMaker.
            remoteRoomCall(roomId, "getAvailableData").
            then((data: any) => res.json(data)).
            catch((err) => console.error(err));
    });

    return api;
}