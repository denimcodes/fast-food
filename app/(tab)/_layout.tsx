import React from 'react'
import { Redirect, Slot } from 'expo-router'

const Layout = () => {
  const isAuthenticated = false;

  if (!isAuthenticated) return <Redirect href="/sign-in" />

  return <Slot />
}

export default Layout