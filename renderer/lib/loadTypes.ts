import VideoType from "./model/videoType";

export default async function loadTypes() {
  const data = await window.electronAPI.openFile("openFile", {
    fileName: "types.conf",
  });

  if (data == null) {
    return new Array<VideoType>();
  }
  const jsonData = JSON.parse(data.toString());
  const typeArr = new Array<VideoType>();

  for (const type of jsonData) {
    const tempType = new VideoType().deserialize(type);
    typeArr.push(tempType);
  }

  console.log("Types loaded.");
  return typeArr;
}
