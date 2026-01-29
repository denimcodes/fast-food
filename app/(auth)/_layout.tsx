import { Slot } from 'expo-router'
import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Layout = () => {
  return (
    <SafeAreaView>
      <Text>Auth layout</Text>
      <Slot />
    </SafeAreaView>
  )
}

export default Layout