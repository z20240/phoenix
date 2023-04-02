type ArrangeGridMethod =
  | 'toFullScreen'
  | 'toLeftHalf'
  | 'toRightHalf'
  | 'toTopRight'
  | 'toBottomRight'
  | 'toTopLeft'
  | 'toBottomLeft';

class TilingSpace implements ITilingSpace {
  static spaceHashes: { [id: number]: TilingSpace } = {};

  id: number;
  space: Space;
  workspace1: TilingWindow[] = [];
  workspace2: TilingWindow[] = [];
  workspace3: TilingWindow[] = [];
  workspace4: TilingWindow[] = [];

  constructor(Space: Space) {
    this.space = Space;
    this.id = Space.hash();
  }

  static of = (space: Space) => {
    if (!TilingSpace.spaceHashes[space.hash()])
      TilingSpace.spaceHashes[space.hash()] = new TilingSpace(space);

    return TilingSpace.spaceHashes[space.hash()];
  };

  isNormal = () => this.space.isNormal();
  isFullScreen = () => this.space.isFullScreen();
  screens = () => this.space.screens().map((screen) => TilingScreen.of(screen));
  windows = (options?: { visible: boolean }) =>
    this.space.windows(options).map((window) => TilingWindow.of(window));
  moveWindows = (windows: Window[]) => this.space.moveWindows(windows);

  getVisibleWindows = () =>
    this.windows().filter((win) => !win.isFloating && !win.isMinimized());

  arrangeAllWindowsInWorkspaces = (windows: TilingWindow[]) => {
    // if no workspace is passed, arrange windows in workspace1 and workspace2
    windows.forEach((win, index) => {
      index % 2 === 0 ? this.workspace1.push(win) : this.workspace2.push(win);
    });
  };

  arrangeAllWindowsToGrid = () => {
    const windows = this.getVisibleWindows();

    // // if only one window, make it full screen.
    // if (windows.length === 1) return windows[0].toFullScreen();

    switch (this._hasWindowsInWorkspaces()) {
      case '1':
        return this._setArrangeWindowsInWorkspace([this.workspace1]);
      case '1,2':
        return this._setArrangeWindowsInWorkspace([
          this.workspace1,
          this.workspace2,
        ]);
      case '1,2,3':
        return this._setArrangeWindowsInWorkspace([
          this.workspace1,
          this.workspace2,
          this.workspace3,
        ]);
      case '1,2,3,4':
        return this._setArrangeWindowsInWorkspace([
          this.workspace1,
          this.workspace2,
          this.workspace3,
          this.workspace4,
        ]);

      default:
        return false;
    }
  };

  clearWorkspaces = () => {
    this.workspace1 = [];
    this.workspace2 = [];
    this.workspace3 = [];
    this.workspace4 = [];
  };

  info = () => {
    return `Space -> [${this.id}] \n`;
  };

  _hasWindowsInWorkspaces = () => {
    const hasWorkspace = [];
    if (this.workspace1.length) hasWorkspace.push(1);
    if (this.workspace2.length) hasWorkspace.push(2);
    if (this.workspace3.length) hasWorkspace.push(3);
    if (this.workspace4.length) hasWorkspace.push(4);
    return hasWorkspace.join(',');
  };

  // arrange windows in workspace to grid
  _arrangeToGrid = (
    workspace: TilingWindow[],
    windowCallback: ArrangeGridMethod,
    ...args: any[]
  ) => {
    for (let i = 0; i < workspace.length; i++) {
      const win = workspace[i];
      win.isStack = workspace.length > 1;
      win[windowCallback](...args);
    }
    return true;
  };

  _setArrangeWindowsInWorkspace = (workspaces: TilingWindow[][]) => {
    if (workspaces.length === 1) {
      return this._arrangeToGrid(workspaces[0], 'toFullScreen', {
        justMaximum: true,
      });
    }

    if (workspaces.length === 2) {
      this._arrangeToGrid(workspaces[0], 'toLeftHalf');
      this._arrangeToGrid(workspaces[1], 'toRightHalf');
      return true;
    }

    if (workspaces.length === 3) {
      this._arrangeToGrid(workspaces[0], 'toLeftHalf');
      this._arrangeToGrid(workspaces[1], 'toTopRight');
      this._arrangeToGrid(workspaces[2], 'toBottomRight');
      return true;
    }

    if (workspaces.length === 4) {
      this._arrangeToGrid(workspaces[0], 'toTopLeft');
      this._arrangeToGrid(workspaces[1], 'toTopRight');
      this._arrangeToGrid(workspaces[2], 'toBottomRight');
      this._arrangeToGrid(workspaces[3], 'toBottomLeft');
      return true;
    }
  };
}
