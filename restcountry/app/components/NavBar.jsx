import React, { useState, useEffect } from 'react'
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '../hook/Theme';

export default function NavBar() {

    const { darkMode, setDarkMode } = useTheme();

    const handleChange = () => setDarkMode(!darkMode)

    useEffect(() => {
      document.body.setAttribute('data-theme', darkMode ? 'dark' : 'light')
    }, [darkMode])

  return (
    <AppBar className='darkLightCardNav' position="static" color='default' >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <p className='darkLightText'>Où dans le monde?</p>
          <p><IconButton onClick={handleChange} color="inherit">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton><span style={{verticalAlign : 'sub'}}>Dark Mode</span></p>
        </Toolbar>
      </AppBar>
  )
}
