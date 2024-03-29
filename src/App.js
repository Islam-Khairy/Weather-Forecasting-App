import './App.css';
import WeatherCrad from './components/WeatherCard';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';
import { WeatherProvider } from './contexts/WeatherContext';
import Footer from './components/Footer';

const theme = createTheme({
  typography: {
    fontFamily: ['Amiri', 'Aref_Ruqaa'].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <WeatherProvider>
        <div className='App'>
          <WeatherCrad />
          <Footer />
        </div>
      </WeatherProvider>
    </ThemeProvider>
  );
}

export default App;
