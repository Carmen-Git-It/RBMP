import Serializable from "../serializable";
import VideoType from "./videoType";
import {v4 as uuidv4} from 'uuid';


export default class MediaDir implements Serializable<MediaDir>{
    id: String

    dirPath: String
    type: VideoType

    constructor() {
        this.id = uuidv4();
    }

    deserialize(input) {
        this.id = input.id;
        
        this.dirPath = input.dirPath;
        this.type = new VideoType().deserialize(input.type);

        return this;
    }

    serialize() {
        return JSON.stringify(this);
    }
}