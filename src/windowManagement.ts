class WindowManagement {
  screens: TilingScreen[] = [];
  spaces: TilingSpace[] = [];
  windows: TilingWindow[] = [];
  constructor() {}

  currentWindow = () =>
    Window.focused() ? TilingWindow.of(Window.focused()!) : undefined;
  currentSpace = () =>
    Space.active() ? TilingSpace.of(Space.active()!) : undefined;
  currentScreen = () => TilingScreen.of(Screen.main());
  visibleWindow = () => Window.all().filter((w) => (w ? w.isVisible() : false));

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
    nextScreen.currentSpace()?.moveWindows([this.currentWindow()!.window]);

    if (this.currentWindow()?.currentGrid) {
      this.currentWindow()?.toGrid(
        this.currentWindow()?.currentGrid!,
        nextScreen
      );
    }
  };

  /** move window to previous screen */
  moveWindowToPreviousScreen = () => {
    const currentScreen = Screen.main();
    const lastScreen = currentScreen.previous();
    lastScreen.currentSpace()?.moveWindows([this.currentWindow()!.window]);

    if (this.currentWindow()?.currentGrid) {
      this.currentWindow()?.toGrid(
        this.currentWindow()?.currentGrid!,
        lastScreen
      );
    }
  };

  /** move window to next space */
  moveWindowToNextSpace = () => {
    const currentSpace = Space.active();
    let nextSpace = currentSpace?.next();

    if (nextSpace?.screens()[0] !== currentSpace?.screens()[0]) {
      nextSpace = this.currentScreen()?.spaces()[0].space;
    }

    nextSpace?.moveWindows([this.currentWindow()!.window]);
    this.currentWindow()?.focus();
  };

  /** move window to previous space */
  moveWindowToPrevSpace = () => {
    const currentSpace = Space.active();
    let lastSpace = currentSpace?.previous();

    if (lastSpace?.screens()[0] !== currentSpace?.screens()[0]) {
      lastSpace =
        this.currentScreen()?.spaces()[
          this.currentScreen()!.spaces().length - 1
        ].space;
    }

    lastSpace?.moveWindows([this.currentWindow()!.window]);
    this.currentWindow()?.focus();
  };

  bindKey = (
    _description: string,
    {
      key,
      combination,
    }: { key: Phoenix.KeyIdentifier; combination: Phoenix.ModifierKey[] },
    callback: () => void
  ) => {
    Key.on(key, combination, callback);
  };
}
