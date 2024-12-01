import { nextui } from '@nextui-org/react';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#1677ff",
              foreground: "#ffffff",
              50: "#eef4ff",
              100: "#e6f0ff",
              200: "#bfdbfe",
            },
            focus: "#1677ff",
            background: {
              DEFAULT: "#ffffff",
            },
            default: {
              50: "#f9fafb",
              100: "#f3f4f6",
            },
          },
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: "#1677ff",
              foreground: "#ffffff",
              50: "rgba(22, 119, 255, 0.15)",
              100: "rgba(22, 119, 255, 0.25)",
              200: "rgba(22, 119, 255, 0.35)",
            },
            focus: "#1677ff",
            background: {
              DEFAULT: "#18181b",
            },
            content1: {
              DEFAULT: "#27272a",
            },
            content2: {
              DEFAULT: "#3f3f46",
            },
            content3: {
              DEFAULT: "#52525b",
            },
            content4: {
              DEFAULT: "#71717a",
            },
            default: {
              50: "#27272a",
              100: "#3f3f46",
              200: "#52525b",
              300: "#71717a",
              400: "#a1a1aa",
              500: "#d4d4d8",
              600: "#e4e4e7",
              700: "#f4f4f5",
              foreground: "#fafafa",
            },
            divider: {
              DEFAULT: "rgba(255, 255, 255, 0.1)",
            },
          },
          layout: {
            hoverOpacity: 0.1,
            boxShadow: {
              small: "0 0 0 1px rgba(255, 255, 255, 0.1)",
              medium: "0 2px 4px 0 rgb(0 0 0 / 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)",
              large: "0 4px 6px -1px rgb(0 0 0 / 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)",
            },
          },
        },
      },
    }),
    require('@tailwindcss/typography'),
  ],
};

export default config; 