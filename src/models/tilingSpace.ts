interface ITilingSpace {
  space: Space;
  id: number;
}

class TilingSpace implements ITilingSpace {
  static spaceHashes: { [id: number]: TilingSpace } = {};

  space: Space;
  id: number;
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
  windows = (options: { visible: boolean }) =>
    this.space.windows(options).map((window) => TilingWindow.of(window));
  moveWindows = (windows: Window[]) => this.space.moveWindows(windows);

  info = () => {
    return `Space -> [${this.id}] \n`;
  };
}
