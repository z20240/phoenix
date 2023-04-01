require('./config.js');
require('./logger.js');
require('./utils.js');
require('./models/tilingWindow.js');
require('./models/tilingSpace.js');
require('./models/tilingScreen.js');
require('./windowManagement.js');

console.log('Phoenix has loaded!');

Phoenix.set({
  daemon: true,
  openAtLogin: true,
});

console.log(Space.all().map((space) => space.hash()));

const windowManagement = new WindowManagement();

const cmd_opt = ['cmd', 'alt'] as Phoenix.ModifierKey[];
const ctrl_cmd = ['ctrl', 'cmd'] as Phoenix.ModifierKey[];
const ctrl_opt = ['ctrl', 'alt'] as Phoenix.ModifierKey[];

windowManagement.bindKey('up', cmd_opt, 'Top Half', () =>
  windowManagement.currentWindow()?.toTopHalf()
);
windowManagement.bindKey('down', cmd_opt, 'Bottom Half', () =>
  windowManagement.currentWindow()?.toBottomHalf()
);
windowManagement.bindKey('left', cmd_opt, 'Left side toggle', () =>
  windowManagement.currentWindow()?.toLeftToggle()
);
windowManagement.bindKey('right', cmd_opt, 'Right side toggle', () =>
  windowManagement.currentWindow()?.toRightToggle()
);

windowManagement.bindKey('C', cmd_opt, 'Center with border', () =>
  windowManagement.currentWindow()?.toCenterWithBorder(1)
);
windowManagement.bindKey('Q', cmd_opt, 'Top Left', () =>
  windowManagement.currentWindow()?.toTopLeft()
);
windowManagement.bindKey('A', cmd_opt, 'Bottom Left', () =>
  windowManagement.currentWindow()?.toBottomLeft()
);
windowManagement.bindKey('W', cmd_opt, 'Top Right', () =>
  windowManagement.currentWindow()?.toTopRight()
);
windowManagement.bindKey('S', cmd_opt, 'Bottom Right', () =>
  windowManagement.currentWindow()?.toBottomRight()
);
windowManagement.bindKey('z', cmd_opt, 'Right Half', () =>
  windowManagement.currentWindow()?.toLeftHalf()
);
windowManagement.bindKey('x', cmd_opt, 'Left Half', () =>
  windowManagement.currentWindow()?.toRightHalf()
);
windowManagement.bindKey('space', cmd_opt, 'Maximize Window', () =>
  windowManagement.currentWindow()?.toFullScreen()
);
windowManagement.bindKey(
  'right',
  ctrl_opt,
  'To Next Screen',
  windowManagement.moveWindowToNextScreen
);
windowManagement.bindKey(
  'left',
  ctrl_opt,
  'To Previous Screen',
  windowManagement.moveWindowToPreviousScreen
);
windowManagement.bindKey(
  'right',
  ctrl_cmd,
  'To Next Space',
  windowManagement.moveWindowToNextSpace
);
windowManagement.bindKey(
  'left',
  ctrl_cmd,
  'To Previous Space',
  windowManagement.moveWindowToPrevSpace
);
// windowManagement.bindKey('=', mash, 'Increase Grid Columns', () =>
//   changeGridWidth(+1)
// );
// windowManagement.bindKey('-', mash, 'Reduce Grid Columns', () =>
//   changeGridWidth(-1)
// );
// windowManagement.bindKey(']', mash, 'Increase Grid Rows', () =>
//   changeGridHeight(+1)
// );
// windowManagement.bindKey('[', mash, 'Reduce Grid Rows', () =>
//   changeGridHeight(-1)
// );

windowManagement.bindKey(';', cmd_opt, 'Snap all to grid', () => {
  windowManagement
    .visibleWindow()
    .map((win) => TilingWindow.of(win)?.snapToGrid());
});
// windowManagement.bindKey(
//   'I',
//   mash,
//   'Shrink by One Column',
//   windowShrinkOneGridColumn
// );
// windowManagement.bindKey(
//   'O',
//   mash,
//   'Grow by One Column',
//   windowGrowOneGridColumn
// );
// windowManagement.bindKey(
//   ',',
//   mash,
//   'Shrink by One Row',
//   windowShrinkOneGridRow
// );
// windowManagement.bindKey('.', mash, 'Grow by One Row', windowGrowOneGridRow);
