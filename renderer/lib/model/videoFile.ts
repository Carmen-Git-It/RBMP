import Serializable from "../serializable";
import VideoType from "./videoType";
import {v4 as uuidv4} from 'uuid';

export default class VideoFile implements Serializable<VideoFile>{
    id: String;

    fileName: String;
    filePath: String;   // Absolute path
    duration: number;   // In ms
    type: VideoType;
    muted: boolean;     // If true, always run muted

    generateUUID() {
        this.id = uuidv4();
    }

    deserialize(input){
        this.id = input.id;
        this.fileName = input.fileName;
        this.filePath = input.filePath;
        this.duration = input.duration;
        this.muted = input.muted;
        this.type = new VideoType().deserialize(input.type);

        return this;
    }

    serialize(){
        return JSON.stringify(this);
    }
}