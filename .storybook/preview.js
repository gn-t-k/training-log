import { addDecorator } from '@storybook/react'
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider/next-12'
import * as NextImage from 'next/image'

addDecorator((Story) => (
  <MemoryRouterProvider>
    <Story />
  </MemoryRouterProvider>
))

export const parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

const OriginalNextImage = NextImage.default

Object.defineProperty(NextImage, 'default', {
  configurable: true,
  value: (props) => <OriginalNextImage {...props} placeholder={undefined} unoptimized />,
})
