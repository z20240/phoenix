require('./config.js');
require('./constants.js');
require('./utils.js');
require('./models/tilingWindow.js');
require('./models/tilingSpace.js');
require('./models/tilingScreen.js');
require('./windowManagement.js');
require('./keybinding.js');

console.log('Phoenix has loaded!');

Phoenix.set({
  daemon: true,
  openAtLogin: true,
});

console.log(Space.all().map((space) => space.hash()));

const windowManagement = new WindowManagement();

windowManagement.registerStopDragEvent(windowManagement.arrangeWindowByDrag);
windowManagement.registerAppEvent(() => windowManagement.arrangeAllWindows());

keyBinding(windowManagement);
