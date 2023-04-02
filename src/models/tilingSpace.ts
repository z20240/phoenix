class TilingSpace implements ITilingSpace {
  static spaceHashes: { [id: number]: TilingSpace } = {};

  id: number;
  space: Space;
  workspace1: TilingWindow[] = [];
  workspace2: TilingWindow[] = [];
  screenCenterPoint: Point = {} as Point;

  constructor(space: Space) {
    this.space = space;
    this.id = space.hash();
    this._setRectAreaToEachWorkspace();
  }

  static of = (space: Space) => {
    if (!TilingSpace.spaceHashes[space.hash()]) TilingSpace.spaceHashes[space.hash()] = new TilingSpace(space);

    return TilingSpace.spaceHashes[space.hash()];
  };

  static getSpaceByHash = (hash: number) => TilingSpace.spaceHashes[hash];

  isNormal = () => this.space.isNormal();
  isFullScreen = () => this.space.isFullScreen();
  screens = () => this.space.screens().map((screen) => TilingScreen.of(screen));
  windows = (options?: { visible: boolean }) => this.space.windows(options).map((window) => TilingWindow.of(window));
  moveWindows = (windows: Window[]) => this.space.moveWindows(windows);
  getVisibleWindows = () => this.windows().filter((win) => !win.isFloating && !win.isMinimized());

  focusLeft = () => {
    Window.at({ x: this.screenCenterPoint.x - GAP_X * 5, y: this.screenCenterPoint.y })?.focus();
  };

  focusRight = () => {
    Window.at({ x: this.screenCenterPoint.x + GAP_X * 5, y: this.screenCenterPoint.y })?.focus();
  };

  focusPrevWindowInWorkspace = (window: TilingWindow) => {
    const currentSpace = TilingSpace.of(Space.active()!);

    const workspace = currentSpace.getWorkspaceByWindow(window);

    if (!workspace) return;

    const index = workspace.findIndex((win) => win.id === window.id);

    workspace[index - 1 < 0 ? workspace.length - 1 : index - 1]?.focus();
  };

  focusNextWindowInWorkspace = (window: TilingWindow) => {
    const currentSpace = TilingSpace.of(Space.active()!);

    const workspace = currentSpace.getWorkspaceByWindow(window);

    if (!workspace) return;

    const index = workspace.findIndex((win) => win.id === window.id);

    workspace[index + 1 > workspace.length - 1 ? 0 : index + 1]?.focus();
  };

  swapToLeft = (window: TilingWindow) => {
    const currentSpace = TilingSpace.of(Space.active()!);

    if (!currentSpace.workspace1.find((win) => win.id === window.id)) return;

    [currentSpace.workspace1, currentSpace.workspace2] = [currentSpace.workspace2, currentSpace.workspace1];

    currentSpace.arrangeAllWindowsToGrid();
  };

  swapToRight = (window: TilingWindow) => {
    const currentSpace = TilingSpace.of(Space.active()!);

    if (!currentSpace.workspace2.find((win) => win.id === window.id)) return;

    [currentSpace.workspace1, currentSpace.workspace2] = [currentSpace.workspace2, currentSpace.workspace1];

    currentSpace.arrangeAllWindowsToGrid();
  };

  insertToLeft = (window: TilingWindow) => {
    const currentSpace = TilingSpace.of(Space.active()!);

    let idx: number = -1;
    if ((idx = currentSpace.workspace1.findIndex((win) => win.id === window.id)) !== -1) {
      currentSpace.workspace1.splice(idx, 1);
      currentSpace.workspace2.push(window);
    }

    currentSpace.arrangeAllWindowsToGrid();
  };

  insertToRight = (window: TilingWindow) => {
    const currentSpace = TilingSpace.of(Space.active()!);

    let idx: number = -1;
    if ((idx = currentSpace.workspace2.findIndex((win) => win.id === window.id)) !== -1) {
      currentSpace.workspace2.splice(idx, 1);
      currentSpace.workspace1.push(window);
    }

    currentSpace.arrangeAllWindowsToGrid();
  };

  arrangeAllWindowsInWorkspaces = (windows: TilingWindow[]) => {
    // if no workspace is passed, arrange windows in workspace1 and workspace2
    windows.forEach((win, index) => {
      index % 2 === 0 ? this.workspace1.push(win) : this.workspace2.push(win);
    });
  };

  arrangeAllWindowsToGrid = () => {
    switch (this._hasWindowsInWorkspaces()) {
      case '1':
        return this._setArrangeWindowsInWorkspace([this.workspace1]);
      case '1,2':
        return this._setArrangeWindowsInWorkspace([this.workspace1, this.workspace2]);
      default:
        return false;
    }
  };

  inWorkspaceArea = (point: Point) => {
    const { x } = point;
    const { x: centerX } = this.screenCenterPoint;

    if (x < centerX || !this.workspace1.length) return this.workspace1;

    return this.workspace2;
  };

  removeWindowFromWorkspace = (window: TilingWindow) => {
    const workspace = this.getWorkspaceByWindow(window);

    if (workspace) {
      const index = workspace.findIndex((win) => win.id === window.id);
      workspace.splice(index, 1);
    }
  };

  clearWorkspaces = () => {
    this.workspace1 = [];
    this.workspace2 = [];
  };

  resetWindowsMode = () => {
    this.windows().forEach((win) => {
      win.reset();
    });
  };

  info = () => {
    return `Space -> [${this.id}] \n`;
  };

  _hasWindowsInWorkspaces = () => {
    const hasWorkspace = [];
    if (this.workspace1.length) hasWorkspace.push(1);
    if (this.workspace2.length) hasWorkspace.push(2);
    return hasWorkspace.join(',');
  };

  // arrange windows in workspace to grid
  _arrangeToGrid = (workspace: TilingWindow[], windowCallback: ArrangeGridMethod, ...args: any) => {
    for (let i = 0; i < workspace.length; i++) {
      const win = workspace[i];
      win.isStack = workspace.length > 1;
      win[windowCallback](...args);
    }
    return true;
  };

  getWorkspaceByWindow = (window: TilingWindow) => {
    if (this.workspace1.includes(window)) return this.workspace1;
    if (this.workspace2.includes(window)) return this.workspace2;
    return null;
  };

  _setRectAreaToEachWorkspace = () => {
    const screen = this.space.screens()[0];
    const screenFrame = screen.flippedVisibleFrame();
    const [centerWidth, centerHeight] = [Math.round(screenFrame.width / 2), Math.round(screenFrame.height / 2)];
    this.screenCenterPoint = { x: screenFrame.x + centerWidth, y: screenFrame.y + centerHeight };
  };

  _setArrangeWindowsInWorkspace = (workspaces: TilingWindow[][]) => {
    if (workspaces.length === 1) {
      return this._arrangeToGrid(workspaces[0], ArrangeGridMethod.toFullScreen);
    }

    if (workspaces.length === 2) {
      this._arrangeToGrid(workspaces[0], ArrangeGridMethod.toLeftHalf);
      this._arrangeToGrid(workspaces[1], ArrangeGridMethod.toRightHalf);
      return true;
    }
  };
}
