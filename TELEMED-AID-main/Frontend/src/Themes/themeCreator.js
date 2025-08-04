import { red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

const themeCreator = (theme) => {
  const navbarHeight = 65;
  const sidebarWidth= 60;
  
  const customTheme = createTheme({
    palette: {
      pink:{
        main:"#ff0055",
      },
      grey: {
        main: "#D9D9D9",
        light: "#F9F9F9",
        light2: "#F5F5F5",
        medium: "#9e9e9e",
        blueGrey: "#56687a",
        sky:'#F2F4F8',
        darkSky:'#7E8E9D'
      },
      green:{
        main: "#3EAA33",
        passed:'#E0FFDD',
      },
      white: {
        main: "#FFFFFF",
      },
      yellow: {
        main: "#FFDC00",
      },
      primary: {
        main: "#0f42aa",
        dark: "#000000",
        light: "rgba(15,66,170,0.45)",
      },
      secondary: {
        main: "#697077",
        light: "#EAF6FF",
      },
      blue: {
        main: "#159bca",
        light: "#d7e1f8",
      },
      darkBlue:{
        main:"#0F62FE",
      },
      greenMint: {
        main: "#33AA9C",
        light: '#DDF9FF'
      },
      black: {
        main: "#333333",
        light: "#454545",
        light2: "#595959",
      },
      red: {
        main: red[500],
        dark: "#FD0234",
        failed:'#FFDDDD',
      },
      purple:{
        main:'#6a1b9a',
        light:'#E8DDFF',
      },
      bleuCiel:{
        main: '#0077A1'
      },
      datagrid: {
        main: "#E6EBF2",
        odd: "#FFFFFF",
        even: "#f2f4fd",
      },
    },
    typography: {
      caption: {
        fontSize: "0.8rem",
        color: "red",
        margin: "0 !important",
      },
    },
    components: {
      MuiSwitch: {
        styleOverrides: {
          root: {
            // Nuclear override for all states
            '&.Mui-disabled': {
              '& .MuiSwitch-thumb': {
                backgroundColor: '#000 !important',
              },
              '& + .MuiSwitch-track': {
                backgroundColor: '#000 !important',
                opacity: '0.5 !important',
              }
            }
          },
          switchBase: {
            // Normal state override
            '&.Mui-disabled': {
              color: '#000 !important',
              // Checked state override
              '&.Mui-checked': {
                color: '#000 !important',
                '& + .MuiSwitch-track': {
                  backgroundColor: '#000 !important',
                }
              }
            }
          },
        }
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            margin: "16px 0",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
              '&.Mui-disabled': {
                  color: "white",
                  opacity: 0.5,
                },
              '&.MuiButton-outlined': {
                '&.Mui-disabled': {
                  color: "inherit",
                },
              },
            },
          },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
              width: '4px',
              height: '4px',
            },
            "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
              backgroundColor: "#9e9e9e", // medium grey
              borderRadius: '4px',
            },
            "&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track": {
              backgroundColor: "#D9D9D9", // main grey
            }
          },
        },
      },
      // MuiInputBase: {
      //     styleOverrides: {
      //       root: {
      //         fontSize: '16px',
      //         input: {
      //           padding: "8.5px 14px",
      //         }
      //       },
      //     },
      // },
      // MuiSelect: {
      //   styleOverrides: {
      //     select: {
      //       fontSize: '16px',
      //       padding: '8.5px 14px',
      //     },
      //   },
      // },
      // MuiFormHelperText: {
      //   styleOverrides: {
      //     root: {
      //       fontSize: '14px',
      //     },
      //   },
      // },
      MuiPaper: {
        styleOverrides: {
          root: {
            "&.MuiDataGrid-paper": {
              transform: "translateY(-105px) translateX(80px) !important",
              boxShadow: "0px 0px 14px 0px rgba(211, 211, 211, 0.4)",
            },
          },
        },
      },
      MuiDataGrid: {
        styleOverrides: {
          filterForm: {
            padding:2,
          },
        },
      },
    },
    shadows: [
      "none", // elevation 0
      "0px 0px 14px 0px rgba(211, 211, 211, 0.4)", // elevation 1 (your custom shadow)
      ...Array(23).fill("none") // fill the rest to avoid errors
    ],
    pageHeight: `calc(100vh - ${navbarHeight}px)`,
    sidebar :{sidebarWidth} ,
    navbar:{navbarHeight},
  });
  return customTheme;
};

export default themeCreator;
