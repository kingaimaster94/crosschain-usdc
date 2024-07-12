module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ["Inter"],
    },
    extend: {
      width: {
        128: "32rem",
      },
      minWidth: {
        "4/5": "80%",
        96: "24rem",
      },
    },
  },
  plugins: [require("daisyui")],
};
