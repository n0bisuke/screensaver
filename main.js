// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, Tray, nativeImage, dialog, ipc, screen} = require('electron')

const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, settngWindow, counter=0;
let screenSaverState = false;

/**スクリーンセーバー起動 */
function openScreenSaver () {
  if(!screenSaverState){
    mainWindow.show()

    // mainWindow.once('ready-to-show', () => {
    //   mainWindow.show()
    // })
    // mainWindow.setResizable(false);
    // mainWindow.maximize()
    screenSaverState = true;
  }
}

function createWindow () {
  const size = screen.getPrimaryDisplay().size;
  mainWindow = new BrowserWindow({
    // modal: true,
    show: false,
    x:0,
    y:0,
    width: size.width,   // 最大サイズで表示する
    height: size.height,
    // opacity: 0.7,
    // width: 2000,
    // height: 1000,
    // maximizable: true,
    // simpleFullscreen: true,
    // fullscreen: true, //フルスクリーン
    frame: false,       // フレームを非表示にする
    resizable: false,
    // kiosk: true,
    webPreferences: {
      nodeIntegration: true, //
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('./view/index.html')
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  //監視
  let prev_mousePos = ``;
  setInterval(()=>{
    const mousePos = JSON.stringify(screen.getCursorScreenPoint());
    if(prev_mousePos === mousePos){
      counter++;
    }else{
      counter = 0; //マウスを動かしたらカウンタリセット
      if(screenSaverState) {
        mainWindow.hide();
        screenSaverState = false;
      }
    }
    
    prev_mousePos = mousePos;
    
    console.log(prev_mousePos, mousePos, counter);
    if(counter > 5){
      openScreenSaver();
    }
  },1*1000);

  var trayIcon = new Tray(nativeImage.createFromPath(__dirname + "/icon.png"));
    // タスクトレイに右クリックメニューを追加
    const contextMenu = Menu.buildFromTemplate([
        { label: "環境設定",
          click: function () { 
            settngWindow = new BrowserWindow({
              width: 500,
              height: 250,
              // opacity: 0.7,
              // transparent: true,
              // frame: false,       // フレームを非表示にする
              resizable: false,
              webPreferences: {
                preload: path.join(__dirname, 'preload.js')
              }
            })          
            // and load the index.html of the app.
            settngWindow.loadFile('./view/setting.html')
            settngWindow.focus();
          } 
        },
        { label: "終了", click: function () { mainWindow.close(); } }
    ]);
    trayIcon.setContextMenu(contextMenu);

    // タスクトレイのツールチップをアプリ名に
    trayIcon.setToolTip(app.name);

    // タスクトレイが左クリックされた場合、アプリのウィンドウをアクティブに
    // trayIcon.on("clicked", function () {
    //     mainWindow.focus();
    // });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
