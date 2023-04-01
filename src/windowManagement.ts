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

  moveWindowToNextSpace = () => {
    const currentSpace = Space.active();
    let nextSpace = currentSpace?.next();

    if (nextSpace?.screens()[0] !== currentSpace?.screens()[0]) {
      nextSpace = this.currentScreen()?.spaces()[0].space;
    }

    nextSpace?.moveWindows([this.currentWindow()!.window]);
    this.currentWindow()?.focus();
  };

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
    key: Phoenix.KeyIdentifier,
    combination: Phoenix.ModifierKey[],
    _description: string,
    callback: () => void
  ) => {
    Key.on(key, combination, callback);
  };
}
