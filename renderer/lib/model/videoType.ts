import Serializable from "../serializable";

export default class VideoType implements Serializable<VideoType> {
    id: number
    name: String

    deserialize(input) {
        this.id = input.id;
        this.name = input.name

        return this;
    }

    serialize() {
        return JSON.stringify(this);
    }
}