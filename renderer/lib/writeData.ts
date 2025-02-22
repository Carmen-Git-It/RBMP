export default function writeData(fileName, data) {
  window.electronAPI.send("write_file", {
    fileName: fileName,
    data: JSON.stringify(data),
  });
  console.log("Wrote file " + fileName);
}
