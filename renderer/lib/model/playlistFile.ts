import Serializable from "../serializable";
import VideoFile from "./videoFile";
import { v4 as uuidv4 } from "uuid";

export default class PlaylistFile implements Serializable<PlaylistFile> {
  id: String;

  file: VideoFile;
  timeStart: number; // In minutes from 00:00
  timeEnd: number; // In minutes from 00:00
  muted: boolean;
  volume: number; // From 0-100

  generateUUID() {
    this.id = uuidv4();
  }

  deserialize(input) {
    this.id = input.id;

    this.file = new VideoFile().deserialize(input.file);
    this.timeStart = input.timeStart;
    this.timeEnd = input.timeEnd;
    this.muted = input.muted || this.file.muted;
    this.volume = input.volume;

    return this;
  }

  serialize() {
    return JSON.stringify(this);
  }
}
