interface ITilingScreen {
  screen: Screen;
  id: number;
}

interface ITilingSpace {
  id: number;
  space: Space;
}

interface ITilingWindow {
  window: Window;
  id: number;
  isStack: boolean;
  lastFrame?: Rectangle;
}

interface IWorkspace {
  [id: number]: TilingWindow;
}

type KeyBingsString =
  | `${Phoenix.KeyIdentifier} - ${Phoenix.ModifierKey}`
  | `${Phoenix.KeyIdentifier} - ${Phoenix.ModifierKey}+${Phoenix.ModifierKey}`
  | `${Phoenix.KeyIdentifier} - ${Phoenix.ModifierKey}+${Phoenix.ModifierKey}+${Phoenix.ModifierKey}`;
interface IKeyBindingConfig {
  description: string;
  keybinding: KeyBingsString;
  action: () => void;
}
