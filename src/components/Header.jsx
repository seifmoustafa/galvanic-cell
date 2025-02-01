import { Box } from "@mui/material";
import backgroundImage from "../assets/background.png";

const Header = () => {
      return (
            <Box
                  sx={{
                        width: "100%", // Full width for all screens
                        minHeight: { xs: "250px", sm: "350px", md: "550px", lg: "1060px" }, // Adjust height dynamically
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: "contain", // Ensures the full image is always visible
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                  }}
            >
                  <Box
                        sx={{
                              backgroundColor: "rgba(0, 0, 0, 0.6)", // Slightly darker overlay for readability
                              padding: { xs: "10px", md: "20px" },
                              borderRadius: "10px",
                              color: "white",
                              textAlign: "center",
                              width: { xs: "90%", sm: "70%", md: "50%" }, // Adjust width based on screen size
                        }}
                  >
                        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>Galvanic Cell</h1>
                  </Box>
            </Box>
      );
};

export default Header;
