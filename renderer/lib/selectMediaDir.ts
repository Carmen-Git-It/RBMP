export default async function selectMediaDir() {
  if (Object.hasOwn(window, "electronAPI")) {
    const w: any = window;
    const data = await w.electronAPI.selectMediaDir("selectMediaDir", {});
    return data;
  }
}
