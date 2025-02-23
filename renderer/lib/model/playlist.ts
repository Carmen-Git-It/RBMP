import Serializable from "../serializable";
import PlaylistSlot from "./playlistSlot";
import { v4 as uuidv4 } from "uuid";

export default class Playlist implements Serializable<Playlist> {
  id: String;

  name: String;
  slots: PlaylistSlot[];

  generateUUID() {
    this.id = uuidv4();
  }

  deserialize(input) {
    this.id = input.id;
    this.name = input.name;

    for (const slot of input.slots) {
      this.slots.push(new PlaylistSlot().deserialize(slot));
    }

    return this;
  }

  serialize() {
    return JSON.stringify(this);
  }
}
