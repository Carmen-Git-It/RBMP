import Serializable from "../serializable";
import PlaylistSlot from "./playlistSlot";

export default class PlaylistConfig implements Serializable<PlaylistConfig>{
    id: number;

    name: String;
    description: String;
    start_time: number;
    end_time: number;
    slots: Array<PlaylistSlot>

    deserialize(input){
        this.id = input.id;
        this.name = input.name;
        this.description = input.description;
        this.start_time = input.start_time;
        this.end_time = input.end_time;
        this.slots = new Array();
        for (var slot of input.slots){
            this.slots.push(new PlaylistSlot().deserialize(slot));
        }

        return this;
    }

    serialize(){
        return JSON.stringify(this);
    }   
}