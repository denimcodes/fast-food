import React from 'react'
import { Redirect, Slot } from 'expo-router'
import useAuthStore from '@/stores/auth.store'

const TabLayout = () => {
  const {isAuthenticated} = useAuthStore();

  if (!isAuthenticated) return <Redirect href="/sign-in" />

  return <Slot />
}

export default TabLayout