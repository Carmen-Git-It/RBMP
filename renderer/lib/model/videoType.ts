import Serializable from "../serializable";
import {v4 as uuidv4} from 'uuid';

export default class VideoType implements Serializable<VideoType> {
    id: String
    name: String
    
    constructor() {
        this.id = uuidv4();
    }

    deserialize(input) {
        this.id = input.id;
        this.name = input.name;

        return this;
    }

    serialize() {
        return JSON.stringify(this);
    }
}