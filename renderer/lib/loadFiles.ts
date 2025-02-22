import VideoFile from "./model/videoFile";

export default async function loadFiles() {
  const data = await window.electronAPI.openFile("openFile", {
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
