import { atom } from "jotai";
import PlaylistConfig from "../lib/model/playlistConfig";
import VideoFile from "../lib/model/videoFile";
import VideoType from "../lib/model/videoType";
import MediaDir from "../lib/model/mediaDir";
import Playlist from "../lib/model/playlist";

export const playlistPlayerAtom = atom<Playlist>(); // Array of current playlist video files to play
export const playlistConfigAtom = atom(new Array<PlaylistConfig>()); // Array of all playlist configurations
export const filesAtom = atom(new Array<VideoFile>()); // Array of all files registered
export const typesAtom = atom(new Array<VideoType>()); // Array of all file types (user-defined)
export const currentPlaylistConfigIdAtom = atom(0); // id of of the currently selected playlist config
export const dirsAtom = atom(new Array<MediaDir>()); // Array of all tracked directories
export const fillerAtom = atom<VideoType>(); // Current filler Type