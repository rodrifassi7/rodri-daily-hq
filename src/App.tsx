import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Home from './screens/Home';
import Habits from './screens/Habits';
import ToDo from './screens/ToDo';
import Training from './screens/Training';
import Nutrition from './screens/Nutrition';
import Review from './screens/Review';

export type Screen = 'home' | 'habits' | 'todo' | 'training' | 'nutrition' | 'review';

function App() {
    console.log('App component rendering...');
    const [currentScreen, setCurrentScreen] = useState<Screen>('home');
    console.log('Current screen:', currentScreen);

    const renderScreen = () => {
        switch (currentScreen) {
            case 'home': return <Home />;
            case 'habits': return <Habits />;
            case 'todo': return <ToDo />;
            case 'training': return <Training />;
            case 'nutrition': return <Nutrition />;
            case 'review': return <Review />;
            default: return <Home />;
        }
    };

    return (
        <AppProvider>
            <Layout currentScreen={currentScreen} onScreenChange={setCurrentScreen}>
                {renderScreen()}
            </Layout>
        </AppProvider>
    );
}

export default App;
