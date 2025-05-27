import VideoFile from "./videoFile";

export default class Folder {
  name: string;
  files: VideoFile[];

  constructor() {
    this.files = new Array();
  }
}
