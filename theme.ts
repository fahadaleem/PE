import { extendTheme } from "@chakra-ui/react";
import "@fontsource/poppins";
import "@fontsource/raleway";

// 2. Call `extendTheme` and pass your custom values
export const theme = extendTheme({
  colors: {
    brand: {
      primary: "#2B303A",
      secondary: "#0C7C59",
      fieldBorder: "#d5d5d5",
      fieldBorderActive: "#000",
      error: "#FF3333",
    },
  },
  fonts: {
    text: "Poppins",
    body: "Poppins",
    heading: "Raleway",
  },
});
