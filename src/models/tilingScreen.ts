interface ITilingScreen {
  screen: Screen;
  id: number;
}

class TilingScreen implements ITilingScreen {
  static screenHashes: { [id: number]: TilingScreen } = {};

  screen: Screen;
  id: number;
  constructor(screen: Screen) {
    this.screen = screen;
    this.id = screen.hash();
  }

  static of = (screen?: Screen) => {
    if (!screen) return undefined;

    if (!TilingScreen.screenHashes[screen.hash()])
      TilingScreen.screenHashes[screen.hash()] = new TilingScreen(screen);

    return TilingScreen.screenHashes[screen.hash()];
  };

  frame = () => this.screen.frame();
  visibleFrame = () => this.screen.visibleFrame();
  flippedVisibleFrame = () => this.screen.flippedVisibleFrame();
  flippedFrame = () => this.screen.flippedFrame();
  currentSpace = () =>
    this.screen.currentSpace()
      ? TilingSpace.of(this.screen.currentSpace()!)
      : undefined;
  spaces = () => this.screen.spaces().map((space) => TilingSpace.of(space));
  windows = (options?: { visible: boolean }) =>
    this.screen.windows(options).map((window) => TilingWindow.of(window));

  info = () => {
    let f = this.frame();
    return `Screen -> [${this.id}] : {x:${f.x}, y:${f.y}, width:${f.width}, height:${f.height}}\n`;
  };
}
