import PlaylistConfig from "./model/playlistConfig";

export default async function loadConfigs() {
  if (Object.hasOwn(window, "electronAPI")) {
    const w: any = window;
    const data = await w.electronAPI.openFile("openFile", {
      fileName: "configs.conf",
    });

    if (data == null) {
      return new Array<PlaylistConfig>();
    }
    const jsonData = JSON.parse(data.toString());
    const configArr = new Array<PlaylistConfig>();

    for (const config of jsonData) {
      const tempConfig = new PlaylistConfig().deserialize(config);
      configArr.push(tempConfig);
    }

    console.log("Configs loaded.");
    return configArr;
  }
}
