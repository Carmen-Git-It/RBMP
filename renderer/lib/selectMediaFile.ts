export default async function selectMediaFile() {
  const data = await window.electronAPI.selectMediaFile("selectMediaFile", {});
  return data;
}
