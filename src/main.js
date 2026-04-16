import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (_jsxs("div", { style: { padding: '20px', color: 'red', background: '#111', height: '100vh' }, children: [_jsx("h1", { children: "Something went wrong." }), _jsx("pre", { children: this.state.error?.toString() })] }));
        }
        return this.props.children;
    }
}
console.log('Mounting React Application...');
const rootElement = document.getElementById('root');
if (!rootElement) {
    console.error('Failed to find the root element');
}
else {
    console.log('Root element found, starting render');
    ReactDOM.createRoot(rootElement).render(_jsx(React.StrictMode, { children: _jsx(ErrorBoundary, { children: _jsx(App, {}) }) }));
}
//# sourceMappingURL=main.js.map