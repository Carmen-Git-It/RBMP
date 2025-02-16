import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import  { Box, Tabs, Tab, Paper } from '@mui/material'
import Link from '../components/Link'
import { styled } from '@mui/material'
import Player from './player/index'
import { useState, useEffect } from 'react'
import Config from './config'

const Root = styled('div')(({ theme }) => {
  return {
    textAlign: 'center',
  }
})

export default function HomePage() {
  const [currentTab, setCurrentTab] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newTab: number) => {
    setCurrentTab(newTab);
  };

  const [hasWindow, setHasWindow] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>RBMS</title>
      </Head>
      <Root>
        <Paper elevation={6}>
          <Box sx={{borderBottom: 1, borderColor: 'divider', marginBottom: 3}}>
            <Tabs value={currentTab} onChange={handleTabChange} centered >
              <Tab label="Player" />
              <Tab label="Config" />
            </Tabs>
          </Box>
        </Paper>
        
        <Paper elevation={1} sx={{marginLeft: 2, marginRight: 2}}>
          {currentTab == 0 && hasWindow && <Player/>}
          {currentTab == 1 && <Config/>}
        </Paper>
      </Root>
    </React.Fragment>
  )
}
