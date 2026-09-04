const { app, BrowserWindow, Menu, shell, screen } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

  mainWindow = new BrowserWindow({
    width: Math.min(1440, Math.floor(screenWidth * 0.95)),
    height: Math.min(900, Math.floor(screenHeight * 0.95)),
    minWidth: 1024,
    minHeight: 680,
    center: true,
    title: 'HÀNH TRÌNH CHINH PHỤC VINH QUANG - Quản Lý Lớp Học',
    backgroundColor: '#f8fafc',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false, // Allows local file audio/images to load offline smoothly
      spellcheck: false,
    },
    show: false, // Don't show until ready-to-show to avoid white flash
  });

  // Load production dist/index.html or dev server if specified
  const isDev = process.env.NODE_ENV === 'development' || process.argv.includes('--dev');
  const distIndexPath = path.join(__dirname, 'dist', 'index.html');

  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else if (fs.existsSync(distIndexPath)) {
    mainWindow.loadFile(distIndexPath);
  } else {
    // If dist hasn't been built yet, try loading file or show friendly message
    mainWindow.loadFile(path.join(__dirname, 'index.html')).catch(() => {
      mainWindow.loadURL('http://localhost:3000');
    });
  }

  // Smooth appearance when content is loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open external links in default browser instead of electron window
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  // Custom Application Menu (Vietnamese)
  const template = [
    {
      label: 'Hệ thống',
      submenu: [
        {
          label: 'Tải lại trang (F5)',
          accelerator: 'F5',
          click: () => mainWindow.webContents.reload(),
        },
        {
          label: 'Tải lại hoàn toàn (Ctrl+R)',
          accelerator: 'CmdOrCtrl+R',
          click: () => mainWindow.webContents.reloadIgnoringCache(),
        },
        { type: 'separator' },
        {
          label: 'Thoát ứng dụng',
          accelerator: 'Alt+F4',
          click: () => app.quit(),
        },
      ],
    },
    {
      label: 'Hiển thị',
      submenu: [
        {
          label: 'Bật/Tắt Toàn màn hình (F11)',
          accelerator: 'F11',
          click: () => mainWindow.setFullScreen(!mainWindow.isFullScreen()),
        },
        { type: 'separator' },
        {
          label: 'Phóng to (+)',
          accelerator: 'CmdOrCtrl+Plus',
          click: () => {
            const zoom = mainWindow.webContents.getZoomFactor();
            mainWindow.webContents.setZoomFactor(Math.min(zoom + 0.1, 2.0));
          },
        },
        {
          label: 'Thu nhỏ (-)',
          accelerator: 'CmdOrCtrl+-',
          click: () => {
            const zoom = mainWindow.webContents.getZoomFactor();
            mainWindow.webContents.setZoomFactor(Math.max(zoom - 0.1, 0.6));
          },
        },
        {
          label: 'Mặc định (100%)',
          accelerator: 'CmdOrCtrl+0',
          click: () => mainWindow.webContents.setZoomFactor(1.0),
        },
        { type: 'separator' },
        {
          label: 'Công cụ phát triển (DevTools)',
          accelerator: 'CmdOrCtrl+Shift+I',
          click: () => mainWindow.webContents.toggleDevTools(),
        },
      ],
    },
    {
      label: 'Trợ giúp',
      submenu: [
        {
          label: 'Giới thiệu phần mềm',
          click: () => {
            const { dialog } = require('electron');
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Hành Trình Chinh Phục Vinh Quang',
              message: 'Hệ Thống Quản Lý Lớp Học & Điểm Thưởng',
              detail: 'Phiên bản Offline Desktop v1.0.0\nTác giả: Cô Phương Anh\nỨng dụng chạy hoàn toàn offline không cần kết nối mạng.',
              buttons: ['Đóng'],
            });
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Single instance lock to prevent multiple windows opening
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(createWindow);

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
}
