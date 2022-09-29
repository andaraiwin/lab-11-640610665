import {
  readChatRoomsDB,
  writeChatRoomsDB,
} from "../../../../backendLibs/dbLib";
import { v4 as uuidv4 } from "uuid";
import { checkToken } from "../../../../backendLibs/checkToken";

export default function roomIdMessageRoute(req, res) {
  if (req.method === "GET") {
    //check token
    const user = checkToken(req);
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Yon do not have permission to access this api",
      });
    }

    //get roomId from url
    const roomId = req.query.roomId;

    const rooms = readChatRoomsDB();

    //check if roomId exist

    //find room and return
    const roomIdx = rooms.findIndex((x) => x.roomId === roomId);
    if (roomIdx === -1)
      return res.status(404).json({ ok: false, message: "Invalid room id" });

    return res.json({ ok: true, messages: rooms[roomIdx].messages });

    //...
  } else if (req.method === "POST") {
    //check token
    const user = checkToken(req);
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Yon do not have permission to access this api",
      });
    }

    //get roomId from url
    const roomId = req.query.roomId;
    const rooms = readChatRoomsDB();

    //check if roomId exist
    const roomIdx = rooms.findIndex((x) => x.roomId === roomId);
    if (roomIdx === -1)
      return res.status(404).json({ ok: false, message: "Invalid room id" });

    //validate body
    if (typeof req.body.text !== "string" || req.body.text.length === 0)
      return res.status(400).json({ ok: false, message: "Invalid text input" });

    //create message
    const text = req.body.text;

    if (typeof text !== "string") {
      return res.status(400).json({ ok: false, massage: "Invalid text input" });
    }

    const newId = uuidv4();

    const newMessage = {
      messageId: newId,
      text: text,
      username: user.username,
    };

    rooms[roomIdx].messages.push(newMessage);

    writeChatRoomsDB(rooms);

    return res.json({ ok: true, message: newMessage });
  }
}
