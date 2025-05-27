import VideoFile from "./model/videoFile";

export default async function loadFiles() {
  if (Object.hasOwn(window, "electronAPI")) {
    const w: any = window;
    const data = await w.electronAPI.openFile("openFile", {
      fileName: "files.conf",
    });

    if (data == null) {
      return new Array<VideoFile>();
    }
    const jsonData = JSON.parse(data.toString());
    const fileArr = new Array<VideoFile>();

    for (const f of jsonData) {
      const tempFile = new VideoFile().deserialize(f);
      fileArr.push(tempFile);
    }

    console.log("Files loaded.");
    return fileArr;
  }
}
