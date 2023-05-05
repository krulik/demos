import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './App.css';
import React, { createContext, useContext, useState } from 'react';

import Button from '@mui/material/Button';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';


const MyThemeContext = createContext({
  mode: 'light',
  colors: {
    light: {
      primary: 'lightgreen',
      onPrimary: 'black'
    },
    dark: {
      primary: 'black',
      onPrimary: 'white'
    }
  }
})

function List({ children }) {
  return (
    <ul className='reset'>
      {children.map((content, index) => (
        <li key={index}>
          {index % 2 === 1 ?
            <Card
              backgroundColor={'primary'}
              color={'onPrimary'}
              margin={'2em'}
              minWidth={'200px'}
              border={'none'}
            >
              {content}
            </Card> :
            <Card>{content}</Card>
          }
        </li>
      ))}
    </ul>
  );
}

function Card({ children, ...style }) {
  const theme = useContext(MyThemeContext);
  const colors = theme.colors[theme.mode];
  const themeOverride = {
    backgroundColor: colors[style.backgroundColor],
    color: colors[style.color]
  };

  return (
    <div style={ {
      border: '1px solid',
      borderRadius: '0.25em',
      padding: '0.5em',
      width: 'fit-content',
      marginBottom: '1em',
      ...style,
      ...themeOverride
    } }>
      <p>{children}</p>
    </div>
  );
}

function App() {
  const theme = useContext(MyThemeContext);

  const [currentMode, setCurrentMode] = useState(theme.mode);

  return (
    <MyThemeContext.Provider value={ {
      ...theme,
      mode: currentMode
    } }>
      <main>
        <p>
          <Button variant={currentMode === 'light' ? 'contained': 'outlined'} onClick={() => {
            setCurrentMode('light');
            }}>Set light <LightModeOutlinedIcon /> </Button>

          <Button variant={currentMode === 'dark' ? 'contained': 'outlined'} onClick={() => {
            setCurrentMode('dark');
          }}>Set dark <DarkModeOutlinedIcon /> </Button>
        </p>

        <List>
          <span>shalev</span>
          <span>mira</span>
          <span>kinneret</span>
          <span>geffen</span>
        </List>
      </main>
    </MyThemeContext.Provider>
  );
}

export default App;
