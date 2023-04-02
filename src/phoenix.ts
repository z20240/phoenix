require('./config.js');
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
const ctrl_opt_cmd = ['ctrl', 'alt', 'cmd'] as Phoenix.ModifierKey[];

windowManagement.bindKey(
  'Maximize the window',
  { key: 'up', combination: cmd_opt },
  () => windowManagement.maximizeWindow()
);
windowManagement.bindKey(
  'Move window to center border',
  { key: 'down', combination: cmd_opt },
  () => windowManagement.moveWindowToCenterBorder()
);
windowManagement.bindKey(
  'Move window to center border',
  { key: 'left', combination: cmd_opt },
  () => windowManagement.moveWindowToLeftHalf()
);
windowManagement.bindKey(
  'Move window to center border',
  { key: 'right', combination: cmd_opt },
  () => windowManagement.moveWindowToRightHalf()
);
windowManagement.bindKey(
  'toggle to adjust window to Left side',
  { key: 'home', combination: cmd_opt },
  () => windowManagement.toggleLeftSide()
);
windowManagement.bindKey(
  'toggle to adjust window to Right side',
  { key: 'end', combination: cmd_opt },
  () => windowManagement.toggleRightSide()
);
windowManagement.bindKey(
  'Move window to Top Left',
  { key: 'Q', combination: cmd_opt },
  () => windowManagement.moveWindowToTopLeft()
);
windowManagement.bindKey(
  'Move window to Bottom Left',
  { key: 'A', combination: cmd_opt },
  () => windowManagement.moveWindowToBottomLeft()
);
windowManagement.bindKey(
  'Move window to Top Right',
  { key: 'W', combination: cmd_opt },
  () => windowManagement.moveWindowToTopRight()
);
windowManagement.bindKey(
  'Move window to Bottom Right',
  { key: 'S', combination: cmd_opt },
  () => windowManagement.moveWindowToBottomRight()
);
windowManagement.bindKey(
  'Maximize Window',
  { key: 'space', combination: cmd_opt },
  () => windowManagement.maximizeWindow()
);
windowManagement.bindKey(
  'To Next Screen',
  { key: 'right', combination: ctrl_opt },
  () => windowManagement.moveWindowToNextScreen()
);
windowManagement.bindKey(
  'To Previous Screen',
  { key: 'left', combination: ctrl_opt },
  () => windowManagement.moveWindowToPreviousScreen()
);
windowManagement.bindKey(
  'To Next Space',
  { key: 'right', combination: ctrl_cmd },
  () => windowManagement.moveWindowToNextSpace()
);
windowManagement.bindKey(
  'To Previous Space',
  { key: 'left', combination: ctrl_cmd },
  () => windowManagement.moveWindowToPrevSpace()
);
windowManagement.bindKey(
  'Increase Grid Columns',
  { key: 'end', combination: ctrl_opt_cmd },
  () => windowManagement.extendGridWidth()
);
windowManagement.bindKey(
  'Reduce Grid Columns',
  { key: 'home', combination: ctrl_opt_cmd },
  () => windowManagement.reduceGridWidth()
);
windowManagement.bindKey(
  'Increase Grid Rows',
  { key: 'pageDown', combination: ctrl_opt_cmd },
  () => {
    console.log('--> key: pageup');
    windowManagement.extendGridHeight();
  }
);
windowManagement.bindKey(
  'Reduce Grid Rows',
  { key: 'pageUp', combination: ctrl_opt_cmd },
  () => windowManagement.reduceGridHeight()
);

windowManagement.bindKey(
  'Snap all to grid',
  { key: ';', combination: cmd_opt },
  () => {
    windowManagement
      .visibleWindow()
      .map((win) => TilingWindow.of(win)?.snapToGrid());
  }
);
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
