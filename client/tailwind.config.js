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
        sidebarblue: "#5865F2",
        base: "#1E1F22",
        lightbase: "#2B2D31",
        hoverbase: "#404249"
      },
      width: { 
        '350': '350px', 
        '640': '640px',
        '700': '700px'
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
