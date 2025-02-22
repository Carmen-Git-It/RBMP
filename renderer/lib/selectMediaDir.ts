export default async function selectMediaDir() {
    const data = await window.electronAPI.selectMediaDir('selectMediaDir', {});
    return data;
}