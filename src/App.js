import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Home from './screens/Home';
import Habits from './screens/Habits';
import ToDo from './screens/ToDo';
import Training from './screens/Training';
import Nutrition from './screens/Nutrition';
import Review from './screens/Review';
function App() {
    console.log('App component rendering...');
    const [currentScreen, setCurrentScreen] = useState('home');
    console.log('Current screen:', currentScreen);
    const renderScreen = () => {
        switch (currentScreen) {
            case 'home': return _jsx(Home, {});
            case 'habits': return _jsx(Habits, {});
            case 'todo': return _jsx(ToDo, {});
            case 'training': return _jsx(Training, {});
            case 'nutrition': return _jsx(Nutrition, {});
            case 'review': return _jsx(Review, {});
            default: return _jsx(Home, {});
        }
    };
    return (_jsx(AppProvider, { children: _jsx(Layout, { currentScreen: currentScreen, onScreenChange: setCurrentScreen, children: renderScreen() }) }));
}
export default App;
//# sourceMappingURL=App.js.map