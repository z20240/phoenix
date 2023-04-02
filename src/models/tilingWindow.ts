class TilingWindow implements ITilingWindow {
  static windowHashes: { [id: number]: TilingWindow } = {};

  window: Window;
  id: number;
  isStack: boolean;
  isFloating: boolean;
  lastFrame?: Rectangle;
  currentGrid?: Rectangle;

  constructor(window: Window) {
    this.window = window;
    this.id = window.hash();
    this.isStack = false;
    this.isFloating = FLOATING_APPS.includes(window.app().name());
  }

  static of = (window: Window) => {
    if (!TilingWindow.windowHashes[window.hash()])
      TilingWindow.windowHashes[window.hash()] = new TilingWindow(window);

    return TilingWindow.windowHashes[window.hash()];
  };

  static focused = () =>
    Window.focused() ? TilingWindow.of(Window.focused()!) : undefined;

  static all = (options?: { visible: boolean }) =>
    Window.all(options).map((window) => TilingWindow.of(window));

  static recent = () =>
    Window.recent().map((window) => TilingWindow.of(window));

  others = (options?: { visible?: boolean; screen?: Screen }) =>
    this.window.others(options).map((window) => TilingWindow.of(window));

  title = () => this.window.title();
  isMain = () => this.window.isMain();
  isNormal = () => this.window.isNormal();
  isFullScreen = () => this.window.isFullScreen();
  isMinimized = () => this.window.isMinimized();
  isVisible = () => this.window.isVisible();
  app = () => this.window.app();
  screen = () => TilingScreen.of(this.window.screen());
  spaces = () => this.window.spaces().map((space) => TilingSpace.of(space));
  size = () => this.window.size();
  frame = () => this.window.frame();
  setTopLeft = (point: Point) => this.window.setTopLeft(point);
  setSize = (size: Size) => this.window.setSize(size);
  setFrame = (frame: Rectangle) => this.window.setFrame(frame);
  setFullScreen = (fullScreen: boolean) =>
    this.window.setFullScreen(fullScreen);
  maximize = () => this.window.maximize();
  minimize = () => this.window.minimize();
  unminimize = () => this.window.unminimize();
  neighbours = (direction: Phoenix.Direction) =>
    this.window.neighbors(direction).map((window) => TilingWindow.of(window));
  focus = () => this.window.focus();
  focusClosestNeighbor = (direction: Phoenix.Direction) =>
    this.window.focusClosestNeighbor(direction);
  close = () => this.window.close();

  topLeft = () => this.window.topLeft();
  topRight = () =>
    ({
      x: this.frame().x + this.frame().width,
      y: this.frame().y,
    } as Point);
  bottomLeft = () =>
    ({
      x: this.frame().x,
      y: this.frame().y + Math.round(this.frame().height / 2),
    } as Point);

  bottomRight = () =>
    ({
      x: this.frame().x + Math.round(this.frame().width / 2),
      y: this.frame().y + Math.round(this.frame().height / 2),
    } as Point);

  /**
   * +----(+)---------+
   * |     |          |
   * |     |          |
   * +-----+----------+
   */
  topFirstMiddleLeft = () => {
    const { x, y, width, height } = this.window.frame();
    return { x: x + Math.round(width / 3), y: y };
  };
  /**
   * +---------(+)----+
   * |          |     |
   * |          |     |
   * +----------+-----+
   */
  topSecondMiddleLeft = () => {
    const { x, y, width, height } = this.window.frame();
    return { x: x + Math.round((width * 2) / 3), y: y };
  };

  visibles = () =>
    Window.all()
      .filter((w) => (w !== undefined ? w.isVisible() : false))
      .map((w) => TilingWindow.of(w));

  screenFrame = (screen?: Screen) => {
    return (
      (screen !== null ? screen?.flippedVisibleFrame() : void 0) ||
      this.window.screen().flippedVisibleFrame()
    );
  };

  getGrid = () => {
    let frame = this.window.frame();
    let [boxHeight, boxWidth] = this.getBoxSize();
    let grid = {
      y: Math.round((frame.y - this.screenFrame().y) / boxHeight),
      x: Math.round((frame.x - this.screenFrame().x) / boxWidth),
      width: Math.max(1, Math.round(frame.width / boxWidth)),
      height: Math.max(1, Math.round(frame.height / boxHeight)),
    } as Rectangle;
    console.log(`Window grid: ${JSON.stringify(grid)}`);
    return grid;
  };

  getBoxSize = () => {
    return [
      this.screenFrame().width / GRID_WIDTH,
      this.screenFrame().height / GRID_HEIGHT,
    ];
  };

  calculateGrid = ({ x, y, width, height }: Rectangle, screen?: Screen) => {
    console.log(
      '🚀 ~ file: tilingWindow.ts:139 ~ TilingWindow ~ width:',
      width,
      this.screenFrame(screen).width
    );

    return {
      y:
        Math.round(y * this.screenFrame(screen).height) +
        GAP_X +
        this.screenFrame(screen).y,
      x:
        Math.round(x * this.screenFrame(screen).width) +
        GAP_Y +
        this.screenFrame(screen).x,
      width: Math.round(width * this.screenFrame(screen).width) - 2.0 * GAP_X,
      height:
        Math.round(height * this.screenFrame(screen).height) - 2.0 * GAP_Y,
    };
  };

  toGrid = (gridRect: Rectangle, screen?: Screen) => {
    this.currentGrid = gridRect;
    let rect = this.calculateGrid(gridRect, screen);
    return this.window.setFrame(rect);
  };

  info = () => {
    let f = this.window.frame();
    return `Window -> [${this.window.app().processIdentifier()}] ${this.window
      .app()
      .name()} : \n{x:${f.x}, y:${f.y}, width:${f.width}, height:${
      f.height
    }}, isStack:${this.isStack}, isFloating:${this.isFloating}\n`;
  };

  proportionWidth = () => {
    let s_w, w_w;
    s_w = this.screenFrame().width;
    w_w = this.window.frame().width;
    return Math.round((w_w / s_w) * 10) / 10;
  };

  snapAllToGrid = () => {
    this.visibles().map((window) => window!.snapToGrid());
  };

  changeGridWidth = (n: number) => {
    let frame = this.getGrid();
    if (n > 0) frame.width = Math.min(frame.width + n, GRID_WIDTH);
    else frame.width = Math.max(frame.width + n, 1);

    return this.setGrid(frame);
  };

  changeGridHeight = (n: number) => {
    let frame = this.getGrid();
    if (n > 0) frame.height = Math.min(frame.height + n, GRID_HEIGHT);
    else frame.height = Math.max(frame.height + n, 1);
    return this.setGrid(frame);
  };

  getLeftWindows = () =>
    this.window
      .neighbors('west')
      .filter((win) => win.topLeft().x < this.topLeft().x - 10);

  getRightWindows = () =>
    this.window
      .neighbors('east')
      .filter(
        (win) =>
          TilingWindow.of(win)?.topRight()?.x || 0 > this.topRight().x + 10
      );

  fullGridFrame = () => {
    return this.calculateGrid({
      y: 0,
      x: 0,
      width: 1,
      height: 1,
    } as Rectangle);
  };

  rememberFrame = () => {
    return (this.lastFrame = this.window.frame());
  };

  forgetFrame = () => {
    this.lastFrame = undefined;
  };

  toFullScreen = (options?: { justMaximum: boolean }) => {
    if (options?.justMaximum)
      return this.toGrid({ y: 0, x: 0, width: 1, height: 1 });

    if (!isEqual(this.window.frame(), this.fullGridFrame())) {
      this.rememberFrame();
      return this.toGrid({ y: 0, x: 0, width: 1, height: 1 });
    } else if (this.lastFrame) {
      this.window.setFrame(this.lastFrame);
      return this.forgetFrame();
    }
  };

  togglingWidth = () => {
    switch (this.proportionWidth()) {
      case 0.8:
        return 0.5;
      case 0.5:
        return 0.3;
      default:
        return 0.8;
    }
  };

  setGrid = ({ y, x, width, height }: Rectangle, screen?: Screen) => {
    let gridHeight, gridWidth;
    screen = screen || this.window.screen();
    gridWidth = this.screenFrame().width / GRID_WIDTH;
    gridHeight = this.screenFrame().height / GRID_HEIGHT;
    return this.window.setFrame({
      y: y * gridHeight + this.screenFrame(screen).y + GAP_Y,
      x: x * gridWidth + this.screenFrame(screen).x + GAP_X,
      width: width * gridWidth - GAP_X * 2.0,
      height: height * gridHeight - GAP_Y * 2.0,
    });
  };

  /** setting grid */
  snapToGrid = () => {
    if (this.isNormal()) return this.setGrid(this.getGrid());
  };
  toTopHalf = () => {
    return this.toGrid({ x: 0, y: 0, width: 1, height: 0.5 });
  };
  toBottomHalf = () => {
    return this.toGrid({ x: 0, y: 0.5, width: 1, height: 0.5 });
  };
  toLeftHalf = () => {
    return this.toGrid({ x: 0, y: 0, width: 0.5, height: 1 });
  };
  toRightHalf = () => {
    return this.toGrid({ x: 0.5, y: 0, width: 0.5, height: 1 });
  };
  toLeftToggle = () => {
    return this.toGrid({
      x: 0,
      y: 0,
      width: this.togglingWidth(),
      height: 1,
    });
  };
  toRightToggle = () => {
    return this.toGrid({
      x: 1 - this.togglingWidth(),
      y: 0,
      width: this.togglingWidth(),
      height: 1,
    });
  };
  toTopRight = () => {
    return this.toGrid({ x: 0.5, y: 0, width: 0.5, height: 0.5 });
  };
  toBottomRight = () => {
    return this.toGrid({ x: 0.5, y: 0.5, width: 0.5, height: 0.5 });
  };
  toTopLeft = () => {
    return this.toGrid({ x: 0, y: 0, width: 0.5, height: 0.5 });
  };
  toBottomLeft = () => {
    return this.toGrid({ x: 0, y: 0.5, width: 0.5, height: 0.5 });
  };
  toCenterWithBorder = (border = 1) => {
    let [boxWidth, boxHeight] = this.getBoxSize();
    let rect = {
      x: border,
      y: border,
      width: GRID_WIDTH - border * 2,
      height: GRID_HEIGHT - border * 2,
    } as Rectangle;
    this.setGrid(rect);
  };
}
