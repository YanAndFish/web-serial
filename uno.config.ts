import { type UserConfig, defineConfig, presetIcons, presetUno, transformerDirectives } from 'unocss'

export default defineConfig({
  presets: [
    presetIcons({
      autoInstall: true,
    }),
    presetUno(),
  ],
  transformers: [
    transformerDirectives(),
  ],
}) as UserConfig
