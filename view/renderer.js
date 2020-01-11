// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const {ipcRenderer} = require('electron')
ipcRenderer.on('synchronous-message', (event, arg) => {
  // event.returnValue = 'pong';  // 送信元へレスポンスを返す
  
  const name = prompt("名前を入力してください");
  alert(name);
});
