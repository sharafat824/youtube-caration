/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{vue,js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            aspectRatio: {
                '9/16': '9 / 16',
            },
        },
    },
    plugins: [],
};
