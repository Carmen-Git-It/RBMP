import dayjs from "dayjs";
import Playlist from "./model/playlist";
import PlaylistConfig from "./model/playlistConfig";
import PlaylistFile from "./model/playlistFile";
import PlaylistSlot from "./model/playlistSlot";
import VideoFile from "./model/videoFile";
import VideoType from "./model/videoType";

// TODO: Reduce code re-use, extract functions
export default async function generatePlaylist(
  config: PlaylistConfig,
  files: VideoFile[],
  fillerType: VideoType,
) {
  const usedFiles = new Array<String>();
  let isFiller = false;

  const generatedPlaylist = new Playlist();
  generatedPlaylist.generateUUID();
  generatedPlaylist.name = "Generated Playlist";
  generatedPlaylist.date = dayjs();
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

      if (slot.featured) {
        if (currentTime > slot.startTime) {
          if (!isFiller) {
            validFiles = files.filter((f) => f.type.id === fillerType.id);
            isFiller = true;
            if (validFiles.length === 0) {
              throw new Error("No files of filler type " + fillerType.name);
            }
          }

          // File re-use
          if (validFiles.length === 0) {
            validFiles = files.filter((f) => f.type.id === fillerType.id);
          }
          const randomIndex = Math.floor(
            Math.random() * (validFiles.length - 1),
          );

          const file = new PlaylistFile();
          file.generateUUID();
          file.file = validFiles[randomIndex];
          file.timeStart = currentTime;
          file.timeEnd = currentTime + validFiles[randomIndex].duration / 60;
          file.muted = slot.muted;
          file.volume = slot.volume;
          newSlot.files.push(file);

          currentTime += validFiles[randomIndex].duration / 60;
          totalDuration += validFiles[randomIndex].duration / 60;
          validFiles = validFiles.splice(randomIndex, 1);
        } else {
          validFiles = validFiles.filter(
            (f) => f.duration / 60 < slot.endTime - slot.startTime,
          );

          if (validFiles.length === 0) {
            // TODO: handle this error such that it's visible to the user. snackbar?
            throw new Error(
              "Error! No media files of type " +
                slot.type.name +
                " fit in slot " +
                slot.startTime +
                " - " +
                slot.endTime +
                "!",
            );
          }

          const randomIndex = Math.floor(
            Math.random() * (validFiles.length - 1),
          );

          const file = new PlaylistFile();
          file.generateUUID();
          file.file = validFiles[randomIndex];
          file.timeStart = currentTime;
          file.timeEnd = currentTime + validFiles[randomIndex].duration / 60;
          console.log("FILE DURATION: " + validFiles[randomIndex].duration)
          console.log("FILE TIMEEND - TIMESTART: " + (file.timeEnd - file.timeStart))
          file.muted = slot.muted;
          file.volume = slot.volume;
          newSlot.files.push(file);

          currentTime += validFiles[randomIndex].duration / 60;
          totalDuration += validFiles[randomIndex].duration / 60;
        }
      } else {
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
        file.muted = slot.muted;
        file.volume = slot.volume;

        usedFiles.push(validFiles[randomIndex].id);
        newSlot.files.push(file);

        currentTime += validFiles[randomIndex].duration / 60;
        totalDuration += validFiles[randomIndex].duration / 60;
        validFiles.splice(randomIndex, 1);
      }
    }

    generatedPlaylist.slots.push(newSlot);
  }

  return generatedPlaylist;
}
