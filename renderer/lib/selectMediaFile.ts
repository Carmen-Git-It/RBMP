export default async function selectMediaFile() {
  if (Object.hasOwn(window, "electronAPI")) {
    const w: any = window;
    const data = await w.electronAPI.selectMediaFile("selectMediaFile", {});
    return data;
  }
}
