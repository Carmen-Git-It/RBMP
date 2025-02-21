import Serializable from "../serializable";
import PlaylistSlot from "./playlistSlot";
import {v4 as uuidv4} from 'uuid';

export default class PlaylistConfig implements Serializable<PlaylistConfig>{
    id: String;

    name: String;
    description: String;
    start_time: number;
    end_time: number;
    slots: Array<PlaylistSlot>

    generateUUID() {
        this.id = uuidv4();
    }

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