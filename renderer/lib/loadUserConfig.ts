export default async function loadUserConfig() {
  const data = await window.electronAPI.openFile("openFile", {
    fileName: "config.conf",
  });

  if (data == null) {
    return null;
  }
  const jsonData = JSON.parse(data.toString());

  console.log("User configs loaded.");
  return jsonData;
}
