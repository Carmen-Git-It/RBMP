export default async function loadUserConfig() {
  if (Object.hasOwn(window, "electronAPI")) {
    const w: any = window;
    const data = await w.electronAPI.openFile("openFile", {
      fileName: "config.conf",
    });

    if (data == null) {
      return null;
    }
    const jsonData = JSON.parse(data.toString());
  
    console.log("User configs loaded.");
    return jsonData;
  }
}
