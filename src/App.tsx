import { useState } from 'react';
import { AuthGate } from './components/AuthGate';
import Layout from './components/Layout';
import Home from './screens/Home';
import Habits from './screens/Habits';
import ToDo from './screens/ToDo';
import Training from './screens/Training';
import Nutrition from './screens/Nutrition';
import Review from './screens/Review';

export type Screen = 'home' | 'habits' | 'todo' | 'training' | 'nutrition' | 'review';

// Vive dentro de AuthGate: al cambiar de usuario se reinicia en Home
function Main() {
    const [currentScreen, setCurrentScreen] = useState<Screen>('home');

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
        <Layout currentScreen={currentScreen} onScreenChange={setCurrentScreen}>
            {renderScreen()}
        </Layout>
    );
}

function App() {
    return (
        <AuthGate>
            <Main />
        </AuthGate>
    );
}

export default App;
