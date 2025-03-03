import Serializable from "../serializable";
import PlaylistFile from "./playlistFile";
import { v4 as uuidv4 } from "uuid";

export default class PlaylistSlot implements Serializable<PlaylistSlot> {
  id: String;

  startTime: number; // Start time in minutes from 00:00
  endTime: number; // End time in minutes from 00:00

  files: PlaylistFile[]; // Array of files for that slot

  generateUUID() {
    this.id = uuidv4();
  }

  deserialize(input) {
    this.id = input.id;
    this.startTime = input.startTime;
    this.endTime = input.endTime;
    this.files = new Array();

    for (const f of input.files) {
      this.files.push(new PlaylistFile().deserialize(f));
    }

    return this;
  }

  serialize() {
    return JSON.stringify(this);
  }
}
