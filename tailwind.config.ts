import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        text: {
          50: "hsl(148, 60%, 95%)",
          100: "hsl(151, 61%, 90%)",
          200: "hsl(150, 61%, 80%)",
          300: "hsl(150, 59%, 70%)",
          400: "hsl(150, 60%, 60%)",
          500: "hsl(150, 60%, 50%)",
          600: "hsl(150, 60%, 40%)",
          700: "hsl(150, 59%, 30%)",
          800: "hsl(150, 61%, 20%)",
          900: "hsl(151, 61%, 10%)",
          950: "hsl(152, 60%, 5%)",
        },
        background: {
          50: "hsl(235, 44%, 95%)",
          100: "hsl(234, 41%, 90%)",
          200: "hsl(233, 43%, 80%)",
          300: "hsl(234, 42%, 70%)",
          400: "hsl(233, 43%, 60%)",
          500: "hsl(233, 43%, 50%)",
          600: "hsl(233, 43%, 40%)",
          700: "hsl(234, 42%, 30%)",
          800: "hsl(233, 43%, 20%)",
          900: "hsl(234, 41%, 10%)",
          950: "hsl(229, 44%, 5%)",
        },
        primary: {
          50: "hsl(140, 12%, 95%)",
          100: "hsl(146, 14%, 90%)",
          200: "hsl(150, 12%, 80%)",
          300: "hsl(148, 12%, 70%)",
          400: "hsl(147, 12%, 60%)",
          500: "hsl(147, 12%, 50%)",
          600: "hsl(147, 12%, 40%)",
          700: "hsl(148, 12%, 30%)",
          800: "hsl(150, 12%, 20%)",
          900: "hsl(146, 14%, 10%)",
          950: "hsl(160, 12%, 5%)",
        },
        secondary: {
          50: "hsl(200, 12%, 95%)",
          100: "hsl(197, 14%, 90%)",
          200: "hsl(200, 12%, 80%)",
          300: "hsl(199, 12%, 70%)",
          400: "hsl(200, 12%, 60%)",
          500: "hsl(199, 12%, 50%)",
          600: "hsl(200, 12%, 40%)",
          700: "hsl(199, 12%, 30%)",
          800: "hsl(200, 12%, 20%)",
          900: "hsl(197, 14%, 10%)",
          950: "hsl(200, 12%, 5%)",
        },
        accent: {
          50: "hsl(220, 12%, 95%)",
          100: "hsl(214, 14%, 90%)",
          200: "hsl(220, 12%, 80%)",
          300: "hsl(218, 12%, 70%)",
          400: "hsl(218, 12%, 60%)",
          500: "hsl(219, 12%, 50%)",
          600: "hsl(218, 12%, 40%)",
          700: "hsl(218, 12%, 30%)",
          800: "hsl(220, 12%, 20%)",
          900: "hsl(214, 14%, 10%)",
          950: "hsl(220, 12%, 5%)",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config;
