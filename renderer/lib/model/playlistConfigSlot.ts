import Serializable from "../serializable";
import VideoType from "./videoType";
import { v4 as uuidv4 } from "uuid";

export default class PlaylistConfigSlot
  implements Serializable<PlaylistConfigSlot>
{
  id: String;

  startTime: number;
  endTime: number;
  type: VideoType;
  volume: number;
  muted: boolean;

  generateUUID() {
    this.id = uuidv4();
  }

  deserialize(input) {
    this.id = input.id;
    this.startTime = input.startTime;
    this.endTime = input.endTime;
    this.type = new VideoType().deserialize(input.type);
    this.volume = input.volume;
    this.muted = input.muted;

    return this;
  }

  serialize() {
    return JSON.stringify(this);
  }
}
