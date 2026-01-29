import { images, offers } from "@/constants";
import { Fragment } from "react";
import { FlatList, Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import cn from 'clsx';
import CartButton from "@/components/CartButton";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-white">

      <FlatList
        data={offers}
        renderItem={({ item, index }) => {
          const isEven = index % 2 == 0;

          return (<View>
            <Pressable className={cn("offer-card", isEven ? "flex-row-reverse" : "flex-row")} style={{ backgroundColor: item.color }} android_ripple={{ color: '#fffff22' }}>
              {({ pressed }) => (
                <Fragment>
                  <View className="h-full w-1/2">
                    <Image source={item.image} className="size-full" resizeMode="contain" />
                  </View>
                  <View className={cn("offer-card__info", isEven ? 'pl-10' : 'pr-10')}>
                    <Text className="h1-bold text-white leading-tight">{item.title}</Text>
                    <Image source={images.arrowRight} resizeMode="contain" className="size-10" tintColor="#ffffff" />
                  </View>
                </Fragment>
              )}
            </Pressable>
          </View>)
        }}
        contentContainerStyle={{ paddingBottom: 28, paddingStart: 14, paddingEnd: 14 }}
        ListHeaderComponent={() => (
          <View className="w-full flex-row flex-between my-5">
            <View className="flex-start">
              <Text className="uppercase small-bold text-primary">Deliver To</Text>
              <TouchableOpacity className="flex-center flex-row gap-x-1 mt-0.5">
                <Text className="paragraph-bold text-dark-100">Guwahati</Text>
                <Image source={images.arrowDown} className="size-3" resizeMode="contain" />
              </TouchableOpacity>
            </View>
            <CartButton />
          </View>
        )} />
    </SafeAreaView>
  );
}
