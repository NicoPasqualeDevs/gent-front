const MENU_KEY = 'gent_menu_state';

export const menuStorage = () => {
  const saveMenuState = (isOpen: boolean): void => {
    localStorage.setItem(MENU_KEY, JSON.stringify(isOpen));
  };

  const getMenuState = (): boolean => {
    const menuState = localStorage.getItem(MENU_KEY);
    return menuState ? JSON.parse(menuState) : true; // Por defecto true
  };

  return {
    saveMenuState,
    getMenuState
  };
}; 