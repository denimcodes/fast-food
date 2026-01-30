import { images } from '@/constants'
import useAuthStore from '@/stores/auth.store'
import { Redirect, Slot } from 'expo-router'
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Dimensions, ImageBackground, Image } from 'react-native'

const Layout = () => {
  const {isAuthenticated} = useAuthStore();

  if (isAuthenticated) return <Redirect href="/" />

  return (
    <KeyboardAvoidingView behavior={Platform.OS == 'android' ? 'height' : 'padding'}>
      <ScrollView className='bg-white h-full' keyboardShouldPersistTaps="handled">
        <View className='w-full relative' style={{ height: Dimensions.get('screen').height / 2.25 }}>
          <ImageBackground source={images.loginGraphic} className='size-full rounded-b-lg' resizeMode='stretch' />
          <Image source={images.logo} className='self-center size-48 absolute -bottom-16 z-10' />
        </View>
        <Slot />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default Layout