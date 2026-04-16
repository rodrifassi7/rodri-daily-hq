import React from 'react';
import type { Screen } from '../App';
interface LayoutProps {
    children: React.ReactNode;
    currentScreen: Screen;
    onScreenChange: (screen: Screen) => void;
}
declare const Layout: React.FC<LayoutProps>;
export default Layout;
//# sourceMappingURL=Layout.d.ts.map