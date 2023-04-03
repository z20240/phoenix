class WindowManagement {
  event: EventObject;
  constructor() {
    this.event = Event;
  }

  currentWindow = () => (Window.focused() ? TilingWindow.of(Window.focused()!) : undefined);
  currentSpace = () => (Space.active() ? TilingSpace.of(Space.active()!) : undefined);
  currentScreen = () => TilingScreen.of(Screen.main());
  visibleWindow = () => Window.all().filter((w) => (w ? w.isVisible() : false));
  on = (event: Phoenix.Event, callback: (handler: Event) => void) => this.event.on(event, callback);
  getSpaces = () => Space.all().map((space) => TilingSpace.of(space));
  getWindows = () => Window.all().map((window) => TilingWindow.of(window));
  getScreen = () => Screen.all().map((screen) => TilingScreen.of(screen));

  registerStopDragEvent = (callback: (prevSpace: TilingSpace, currentSpace: TilingSpace, window: TilingWindow, point: Point) => void) => {
    let mouseDragTimer: any = null,
      windowMovedTimer: any = null;
    let isDrag = false;

    this.event.on('mouseDidLeftDrag', (point) => {
      isDrag = true;
      this.event.on('windowDidMove', (window) => {
        clearTimeout(windowMovedTimer);

        const prevSpace = this.currentSpace()!;
        windowMovedTimer = setTimeout(() => {
          // set stop drag
          if (isDrag) {
            console.log('---> is Stop Draged');
            const currentSpace = this.currentSpace()!;
            const currentWindow = TilingWindow.of(window);
            callback(prevSpace, currentSpace, currentWindow, point);
          }
        }, 500);
      });

      clearTimeout(mouseDragTimer);
      mouseDragTimer = setTimeout(() => (isDrag = false), 600);
    });
  };

  registerAppEvent = (callback: (window?: TilingWindow, app?: App) => void) => {
    const window = this.currentWindow();
    this.event.on('appDidLaunch', (app) => callback(window, app));
    this.event.on('appDidShow', (app) => callback(window, app));
  };

  arrangeAllWindows = () => {
    this.getSpaces().forEach((space) => {
      space.clearWorkspaces();
      space.resetWindowsMode();

      const windows = space.getVisibleWindows();

      space.arrangeAllWindowsInWorkspaces(windows);
      space.arrangeAllWindowsToGrid();
    });
  };

  /** toggle to maximized the window or not */
  toggleMaximizeWindow = () => this.currentWindow()?.toggleMaximize();

  /** toggle to float the window or not */
  toggleToFloatingWindow = () => this.currentWindow()?.toggleToFloatingWindow();

  /** move window to top half */
  moveWindowToTopHalf = () => this.currentWindow()?.toTopHalf();

  /** move window to bottom half */
  moveWindowToBottomHalf = () => this.currentWindow()?.toBottomHalf();

  /** move window to left half */
  moveWindowToLeftHalf = () => this.currentWindow()?.toLeftHalf();

  /** move window to right half */
  moveWindowToRightHalf = () => this.currentWindow()?.toRightHalf();

  /** move window to top left */
  moveWindowToTopLeft = () => this.currentWindow()?.toTopLeft();

  /** move window to top right */
  moveWindowToTopRight = () => this.currentWindow()?.toTopRight();

  /** move window to bottom left */
  moveWindowToBottomLeft = () => this.currentWindow()?.toBottomLeft();

  /** move window to bottom right */
  moveWindowToBottomRight = () => this.currentWindow()?.toBottomRight();

  /** move window to center border */
  moveWindowToCenterBorder = () => this.currentWindow()?.toCenterWithBorder(1);

  /** Maximize the window */
  maximizeWindow = () => this.currentWindow()?.toFullScreen();

  /** toggle left side window to adjust the right border width. */
  toggleLeftSide = () => this.currentWindow()?.toLeftToggle();

  /** toggle right side window to adjust the left border width. */
  toggleRightSide = () => this.currentWindow()?.toRightToggle();

  /** extend the grid width */
  extendGridWidth = () => this.currentWindow()?.changeGridWidth(1);

  /** reduce the grid width */
  reduceGridWidth = () => this.currentWindow()?.changeGridWidth(-1);

  /** extend the grid height */
  extendGridHeight = () => this.currentWindow()?.changeGridHeight(1);

  /** reduce the grid height */
  reduceGridHeight = () => this.currentWindow()?.changeGridHeight(-1);

  /** move window to next screen */
  moveWindowToNextScreen = () => {
    const currentScreen = Screen.main();
    const nextScreen = currentScreen.next();

    TilingSpace.of(currentScreen.currentSpace()!).removeWindowFromWorkspace(this.currentWindow()!);

    nextScreen.currentSpace()?.moveWindows([this.currentWindow()!.window]);

    const tSpace = TilingSpace.of(nextScreen.currentSpace()!);
    tSpace.arrangeAllWindowsInWorkspaces(tSpace.getVisibleWindows());
    tSpace.arrangeAllWindowsToGrid();
  };

  /** move window to previous screen */
  moveWindowToPreviousScreen = () => {
    const currentScreen = Screen.main();
    const lastScreen = currentScreen.previous();

    TilingSpace.of(currentScreen.currentSpace()!).removeWindowFromWorkspace(this.currentWindow()!);

    lastScreen.currentSpace()?.moveWindows([this.currentWindow()!.window]);

    const tSpace = TilingSpace.of(lastScreen.currentSpace()!);
    tSpace.arrangeAllWindowsInWorkspaces(tSpace.getVisibleWindows());
    tSpace.arrangeAllWindowsToGrid();
  };

  /** move window to next space */
  moveWindowToNextSpace = () => {
    const currentSpace = Space.active();
    let nextSpace = currentSpace?.next();

    TilingSpace.of(currentSpace!).removeWindowFromWorkspace(this.currentWindow()!);

    if (nextSpace?.screens()[0] !== currentSpace?.screens()[0]) {
      nextSpace = this.currentScreen()?.spaces[0].space;
    }

    nextSpace?.moveWindows([this.currentWindow()!.window]);
    this.currentWindow()?.focus();

    this.arrangeAllWindows();

    this.currentSpace()?.arrangeAllWindowsInWorkspaces(this.currentSpace()?.getVisibleWindows()!);
    this.currentSpace()?.arrangeAllWindowsToGrid();
  };

  /** move window to previous space */
  moveWindowToPrevSpace = () => {
    const currentSpace = Space.active();
    let lastSpace = currentSpace?.previous();

    TilingSpace.of(currentSpace!).removeWindowFromWorkspace(this.currentWindow()!);

    if (lastSpace?.screens()[0] !== currentSpace?.screens()[0]) {
      lastSpace = this.currentScreen()?.spaces[this.currentScreen()!.spaces.length - 1].space;
    }

    lastSpace?.moveWindows([this.currentWindow()!.window]);
    this.currentWindow()?.focus();

    this.arrangeAllWindows();

    this.currentSpace()?.arrangeAllWindowsInWorkspaces(this.currentSpace()?.getVisibleWindows()!);
    this.currentSpace()?.arrangeAllWindowsToGrid();
  };

  /** mouse move window to next workspace */
  arrangeWindowByDrag = (oldSpace: TilingSpace, newSpace: TilingSpace, currentWindow: TilingWindow, point: Point) => {
    if (currentWindow.isFloating) return;

    this.arrangeAllWindows();

    oldSpace.removeWindowFromWorkspace(currentWindow);

    if (!oldSpace.workspace1.length && oldSpace.workspace2.length) {
      oldSpace.workspace1 = oldSpace.workspace2;
      oldSpace.workspace2 = [];
    }

    const workspace = newSpace.inWorkspaceArea(point);

    if (workspace) workspace.push(currentWindow);

    newSpace.arrangeAllWindowsToGrid();
  };

  /** focus left */
  focusLeft = () => this.currentSpace()?.focusLeft();

  /** focus right */
  focusRight = () => this.currentSpace()?.focusRight();

  /** focus previous window in workspace */
  focusPrevWindowInWorkspace = () => this.currentSpace()?.focusPrevWindowInWorkspace(this.currentWindow()!);

  /** focus next window in workspace */
  focusNextWindowInWorkspace = () => this.currentSpace()?.focusNextWindowInWorkspace(this.currentWindow()!);

  /** swap the workspace to left */
  swapToLeft = () => this.currentSpace()?.swapToLeft(this.currentWindow()!);

  /** swap the workspace to right */
  swapToRight = () => this.currentSpace()?.swapToRight(this.currentWindow()!);

  /** insert the workspace to left */
  insertToLeft = () => this.currentSpace()?.insertToLeft(this.currentWindow()!);

  /** insert the workspace to right */
  insertToRight = () => this.currentSpace()?.insertToRight(this.currentWindow()!);

  // ----  functional methods ----

  /** binding the stortcut. */
  bindKey = (
    _description: string,
    { key, combination }: { key: Phoenix.KeyIdentifier; combination: Phoenix.ModifierKey[] },
    callback: () => void
  ) => {
    Key.on(key, combination, callback);
  };
}
