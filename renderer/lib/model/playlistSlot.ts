import Serializable from "../serializable";
import VideoType from "./videoType";

export default class PlaylistSlot implements Serializable<PlaylistSlot>{
    id: number;

    startTime: number;
    endTime: number;
    type: VideoType;
    volume: number;
    muted: boolean;

    deserialize(input){
        this.id = input.id;
        this.startTime = input.startTime;
        this.endTime = input.endTime;
        this.type = new VideoType().deserialize(input.type);
        this.volume = input.volume;
        this.muted = input.muted;

        return this;
    }

    serialize(){
        return JSON.stringify(this);
    }
}