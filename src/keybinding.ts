const cmd_opt = ['cmd', 'alt'] as Phoenix.ModifierKey[];
const shift_cmd = ['shift', 'cmd'] as Phoenix.ModifierKey[];
const ctrl_cmd = ['ctrl', 'cmd'] as Phoenix.ModifierKey[];
const ctrl_opt = ['ctrl', 'alt'] as Phoenix.ModifierKey[];
const ctrl_opt_cmd = ['ctrl', 'alt', 'cmd'] as Phoenix.ModifierKey[];
const shift_opt_cmd = ['shift', 'alt', 'cmd'] as Phoenix.ModifierKey[];

/**
 * Key bindings configuration
 */
const KeyBindingConfig: IKeyBindingConfig[] = [
  {
    description: 'Maximize the window',
    keybinding: 'up - cmd+alt',
    action: () => {
      windowManagement.currentWindow()?.isFloating ? windowManagement.maximizeWindow() : windowManagement.focusPrevWindowInWorkspace();
    },
  },
  {
    description: 'Move window to center border',
    keybinding: 'down - cmd+alt',
    action: () => {
      windowManagement.currentWindow()?.isFloating ? windowManagement.moveWindowToCenterBorder() : windowManagement.focusNextWindowInWorkspace();
    },
  },
  {
    description: 'Move window to center border',
    keybinding: 'left - cmd+alt',
    action: () => {
      windowManagement.currentWindow()?.isFloating ? windowManagement.moveWindowToLeftHalf() : windowManagement.focusLeft();
    },
  },
  {
    description: 'Move window to center border',
    keybinding: 'right - cmd+alt',
    action: () => {
      windowManagement.currentWindow()?.isFloating ? windowManagement.moveWindowToRightHalf() : windowManagement.focusRight();
    },
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
    action: () => windowManagement.toggleMaximizeWindow(),
  },
  {
    description: 'Maximize Window',
    keybinding: 'space - ctrl+cmd+alt',
    action: () => windowManagement.toggleToFloatingWindow(),
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
    keybinding: 'R - shift+cmd',
    action: () => windowManagement.arrangeAllWindows(),
  },
  {
    description: 'swap the workspace left',
    keybinding: 'right - ctrl+alt+cmd',
    action: () => windowManagement.swapToLeft(),
  },
  {
    description: 'swap the workspace right',
    keybinding: 'left - ctrl+alt+cmd',
    action: () => windowManagement.swapToRight(),
  },
  {
    description: 'insert the window to workspace left',
    keybinding: 'right - shift+alt+cmd',
    action: () => windowManagement.insertToLeft(),
  },
  {
    description: 'insert the window to workspace right',
    keybinding: 'left - shift+alt+cmd',
    action: () => windowManagement.insertToRight(),
  },
];

const keyBinding = (windowManagement: WindowManagement) => {
  KeyBindingConfig.forEach((keyBinding) => {
    const { description, keybinding, action } = keyBinding;
    const [keyIdentifier, modifiers] = keybinding.split(' - ');
    const key = keyIdentifier.trim() as Phoenix.KeyIdentifier;
    const combination = modifiers.split('+').map((m) => m.trim()) as Phoenix.ModifierKey[];
    windowManagement.bindKey(description, { key, combination }, action);
  });
};
