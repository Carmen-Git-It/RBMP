import VideoFile from "./model/videoFile";

export default async function loadFiles() {
    const data = await window.electronAPI.openFile('openFile', {fileName: 'files.conf'})
    
    if (data == null){
        return new Array<VideoFile>();
    }
    const jsonData = JSON.parse(data.toString());
    var fileArr = new Array<VideoFile>();

    for (var f of jsonData) {
        var tempFile = new VideoFile().deserialize(f);
        fileArr.push(tempFile);
    }

    console.log("Files loaded.");
    return fileArr;
}