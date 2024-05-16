import plugin from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", 
  "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      colors: {
        primary: "#6b8afd",
        secondary: "#2e333d",
        dark: "#212328",
        danger: "#eb3330",
        success: "#4aac68",
      },
      width: { 
        '350': '350px', 
    }, height: { 
      '500': '500px', 
  }, 
    },
  },

  plugins : [
    function({addUtilities}){
      const newUtilities = {
        ".no-scrollbar::-webkit-scrollbar": {
          display:"none"
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width":"none"
        }
      }
      addUtilities(newUtilities)
    }, 
    // require('flowbite/plugin')
  ]

};
