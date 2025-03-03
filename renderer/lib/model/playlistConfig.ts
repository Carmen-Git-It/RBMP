import Serializable from "../serializable";
import PlaylistConfigSlot from "./playlistConfigSlot";
import { v4 as uuidv4 } from "uuid";

export default class PlaylistConfig implements Serializable<PlaylistConfig> {
  id: String;

  name: String;
  description: String;
  slots: PlaylistConfigSlot[];

  generateUUID() {
    this.id = uuidv4();
  }

  deserialize(input) {
    this.id = input.id;
    this.name = input.name;
    this.description = input.description;
    this.slots = new Array();
    for (const slot of input.slots) {
      this.slots.push(new PlaylistConfigSlot().deserialize(slot));
    }

    return this;
  }

  serialize() {
    return JSON.stringify(this);
  }
}
