const cmd_opt = ['cmd', 'alt'] as Phoenix.ModifierKey[];
const ctrl_cmd = ['ctrl', 'cmd'] as Phoenix.ModifierKey[];
const ctrl_opt = ['ctrl', 'alt'] as Phoenix.ModifierKey[];
const ctrl_opt_cmd = ['ctrl', 'alt', 'cmd'] as Phoenix.ModifierKey[];

/**
 * Key bindings configuration
 */
const KeyBindingConfig: IKeyBindingConfig[] = [
  {
    description: 'Maximize the window',
    keybinding: 'up - cmd+alt',
    action: () => windowManagement.maximizeWindow(),
  },
  {
    description: 'Maximize the window',
    keybinding: 'up - cmd+alt',
    action: () => windowManagement.maximizeWindow(),
  },
  {
    description: 'Move window to center border',
    keybinding: 'down - cmd+alt',
    action: () => windowManagement.moveWindowToCenterBorder(),
  },
  {
    description: 'Move window to center border',
    keybinding: 'left - cmd+alt',
    action: () => windowManagement.moveWindowToLeftHalf(),
  },
  {
    description: 'Move window to center border',
    keybinding: 'right - cmd+alt',
    action: () => windowManagement.moveWindowToRightHalf(),
  },
  {
    description: 'toggle to adjust window to Left side',
    keybinding: 'home - cmd+alt',
    action: () => windowManagement.toggleLeftSide(),
  },
  {
    description: 'toggle to adjust window to Right side',
    keybinding: 'end - cmd+alt',
    action: () => windowManagement.toggleRightSide(),
  },
  {
    description: 'Move window to Top Left',
    keybinding: 'Q - cmd+alt',
    action: () => windowManagement.moveWindowToTopLeft(),
  },
  {
    description: 'Move window to Bottom Left',
    keybinding: 'A - cmd+alt',
    action: () => windowManagement.moveWindowToBottomLeft(),
  },
  {
    description: 'Move window to Top Right',
    keybinding: 'W - cmd+alt',
    action: () => windowManagement.moveWindowToTopRight(),
  },
  {
    description: 'Move window to Bottom Right',
    keybinding: 'S - cmd+alt',
    action: () => windowManagement.moveWindowToBottomRight(),
  },
  {
    description: 'Maximize Window',
    keybinding: 'space - cmd+alt',
    action: () => windowManagement.maximizeWindow(),
  },
  {
    description: 'To Next Screen',
    keybinding: 'right - ctrl+alt',
    action: () => windowManagement.moveWindowToNextScreen(),
  },
  {
    description: 'To Previous Screen',
    keybinding: 'left - ctrl+alt',
    action: () => windowManagement.moveWindowToPreviousScreen(),
  },
  {
    description: 'To Next Space',
    keybinding: 'right - ctrl+cmd',
    action: () => windowManagement.moveWindowToNextSpace(),
  },
  {
    description: 'To Previous Space',
    keybinding: 'left - ctrl+cmd',
    action: () => windowManagement.moveWindowToPrevSpace(),
  },
  {
    description: 'Increase Grid Columns',
    keybinding: 'end - ctrl+alt+cmd',
    action: () => windowManagement.extendGridWidth(),
  },
  {
    description: 'Reduce Grid Columns',
    keybinding: 'home - ctrl+alt+cmd',
    action: () => windowManagement.reduceGridWidth(),
  },
  {
    description: 'Increase Grid Rows',
    keybinding: 'pageDown - ctrl+alt+cmd',
    action: () => windowManagement.extendGridHeight(),
  },
  {
    description: 'Reduce Grid Rows',
    keybinding: 'pageUp - ctrl+alt+cmd',
    action: () => windowManagement.reduceGridHeight(),
  },
  {
    description: 'Arrange Windows',
    keybinding: 'R - ctrl+alt+cmd',
    action: () => windowManagement.arrangeAllWindows(),
  },
];

const keyBinding = (windowManagement: WindowManagement) => {
  KeyBindingConfig.forEach((keyBinding) => {
    const { description, keybinding, action } = keyBinding;
    const [keyIdentifier, modifiers] = keybinding.split(' - ');
    const key = keyIdentifier.trim() as Phoenix.KeyIdentifier;
    const combination = modifiers
      .split('+')
      .map((m) => m.trim()) as Phoenix.ModifierKey[];
    windowManagement.bindKey(description, { key, combination }, action);
  });
};
