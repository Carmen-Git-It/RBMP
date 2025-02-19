export default function saveConfigs(configs) {
    window.electronAPI.send('write_file', {fileName: "configs.conf", data: JSON.stringify(configs)});
    console.log("Configs saved");
}