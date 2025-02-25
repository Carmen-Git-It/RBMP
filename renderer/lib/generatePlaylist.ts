import Playlist from "./model/playlist";
import PlaylistConfig from "./model/playlistConfig";
import PlaylistFile from "./model/playlistFile";
import PlaylistSlot from "./model/playlistSlot";
import VideoFile from "./model/videoFile";

export default async function generatePlaylist(
  config: PlaylistConfig,
  files: VideoFile[],
) {
  const usedFiles = new Array<String>();

  const generatedPlaylist = new Playlist();
  generatedPlaylist.generateUUID();
  generatedPlaylist.name = "Generated Playlist";
  generatedPlaylist.slots = new Array();

  for (const slot of config.slots) {
    let totalDuration = 0;
    let currentTime = slot.startTime;
    
    const newSlot = new PlaylistSlot();
    newSlot.startTime = slot.startTime;
    newSlot.endTime = slot.endTime;
    newSlot.files = new Array();

    // Want to filter out already used files
    let validFiles = files.filter(
      (f) => f.type.id === slot.type.id && !usedFiles.includes(f.id),
    );

    // No files of the slot type available
    if (validFiles.length === 0) {
      validFiles = files.filter((f) => f.type.id === slot.type.id);
      if (validFiles.length === 0) {
        throw new Error("Error! No files matching type: " + slot.type.name);
      }
    }

    while (totalDuration < slot.endTime - slot.startTime) {
      // slot times in minutes, videofile durations in seconds

      // in case we need to re-use files
      if (validFiles.length === 0) {
        validFiles = files.filter((f) => f.type.id === slot.type.id);
      }

      const randomIndex = Math.floor(Math.random() * (validFiles.length - 1));

      const file = new PlaylistFile();
      file.generateUUID();
      file.file = validFiles[randomIndex];
      file.timeStart = currentTime;
      file.timeEnd = currentTime + validFiles[randomIndex].duration / 60;
      file.muted = false;
      file.volume = 100;

      usedFiles.push(validFiles[randomIndex].id);
      newSlot.files.push(file);

      currentTime += validFiles[randomIndex].duration / 60;
      totalDuration += validFiles[randomIndex].duration / 60;
      validFiles.splice(randomIndex, 1);
    }

    generatedPlaylist.slots.push(newSlot);
  }

  return generatedPlaylist;
}
