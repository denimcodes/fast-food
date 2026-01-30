import { images } from '@/constants';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import { useDebouncedCallback } from 'use-debounce';

const SearchBar = () => {
  const params = useLocalSearchParams<{ query?: string }>();
  const [query, setQuery] = useState(params.query);

  const debouncedSearch = useDebouncedCallback((text: string) => router.setParams({ query }), 500)

  const handleSearch = (text: string) => {
    setQuery(text);
    debouncedSearch(text);
  }

  return (
    <View className='searchbar'>
      <TextInput
        className='flex-1 p-5'
        placeholder='Search for pizzas, burgers...'
        value={query}
        onChangeText={handleSearch}
        placeholderTextColor="#a0a0a0"
        returnKeyType='search' />

      <TouchableOpacity className='pr-5' onPress={() => router.setParams({ query })}>
        <Image source={images.search} className='size-6' resizeMode='contain' tintColor={"#5d5f6d"} />
      </TouchableOpacity>
    </View>
  )
}

export default SearchBar