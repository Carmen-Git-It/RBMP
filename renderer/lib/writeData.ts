export default function writeData(fileName, data) {
  if (Object.hasOwn(window, "electronAPI")) {
    const w: any = window;
    w.electronAPI.send("write_file", {
      fileName: fileName,
      data: JSON.stringify(data),
    });
    console.log("Wrote file " + fileName);
  }
}
