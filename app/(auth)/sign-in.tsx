import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import { signIn } from '@/lib/appwrite'
import { Link, router } from 'expo-router'
import { useState } from 'react'
import { View, Text, Button, Alert } from 'react-native'

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const submit = async () => {
    const {email, password} = form;
    if (!email || !password) return Alert.alert('Error', 'Please enter valid email address and password')

    setIsSubmitting(true)

    try {
      await signIn({email, password});
      
      Alert.alert('Success', 'User signed in successfully')
      router.replace('/')
    } catch (e: any) {
      Alert.alert('Error', e.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <View className='gap-10 bg-white rounded-lg p-5 mt-5'>
      <CustomInput placeholder='Enter email address' value={form.email} onChangeText={(text) => {setForm((prev) => ({...prev, email: text}))}} label='Email' keyboardType='email-address' />
      <CustomInput placeholder='Enter password' value={form.password} onChangeText={(text) => { setForm((prev) => ({...prev, password: text}))}} label='Password' secureTextEntry={true} />
      <CustomButton title='Sign in' isLoading={isSubmitting} onPress={submit} />

      <View className='flex justify-center mt-5 flex-row gap-2'>
        <Text className='base-regular text-gray-100'>Don't have an account?</Text>
        <Link href='/sign-up' className='base-bold text-primary'>Sign up</Link>
      </View>
    </View>
  )
}

export default SignIn