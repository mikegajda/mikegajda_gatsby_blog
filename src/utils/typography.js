import Typography from "typography"
import bootstrapTheme from "typography-theme-bootstrap";


// import wordpress2013 from "typography-theme-wordpress-2013"

// wordpress2013.headerLineHeight = 1.1
// wordpress2013.overrideThemeStyles = () => {
//   return {
//     a: {
//       color: `rgb(60,99,243)`,
//     },
//     h1: {
//       lineHeight: 1,
//     },
//   }
// }

bootstrapTheme.overrideThemeStyles = () => {
  return {
    div: {
      maxWidth: "1100px"
    }
  }
}


const typography = new Typography(bootstrapTheme);

export const { rhythm, scale } = typography
export default typography;
