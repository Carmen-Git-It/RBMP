export default async function selectMediaDir() {
    const data = await window.electronAPI.selectMediaDir('selectMediaDir', {});
    // TODO: More processing first?
    // TODO: Filter out non-video files
    return data;
}