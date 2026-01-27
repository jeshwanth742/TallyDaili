/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#121212', // Material Dark
                surface: '#1E1E1E',
                primary: '#00E676', // Neon Green
                warning: '#FFC400', // Amber
                danger: '#FF3D00', // Deep Orange
                text: {
                    primary: '#FFFFFF',
                    secondary: '#B0BEC5'
                }
            }
        },
    },
    plugins: [],
}
