import Playlist from "./model/playlist";

export default async function loadPlaylist() {
  const data = await window.electronAPI.openFile("openFile", {
    fileName: "playlist.conf",
  });

  if (data == null) {
    return null;
  }
  const jsonData = JSON.parse(data.toString());

  const playlist = new Playlist().deserialize(jsonData);

  console.log("Current playlist loaded.");
  return playlist;
}
