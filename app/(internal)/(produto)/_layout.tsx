import { Stack } from 'expo-router'
import React from 'react'

export default function _layout() {
  return (
      <Stack screenOptions={{headerTitle: '', headerShown: false}}>
              <Stack.Screen name='ListaProduto'/>
      </Stack>
  )
}