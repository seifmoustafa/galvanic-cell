import { Box } from "@mui/material";
import backgroundImage from "../assets/back.jpeg";
import schoolLogo from "../assets/school.png"; // Importing the school logo

const Header = () => {
      return (
            <Box
                  sx={{
                        width: "100%", // Full width for all screens
                        minHeight: { xs: "250px", sm: "350px", md: "550px", lg: "1600px" }, // Adjust height dynamically
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: "cover", // Ensures the full image is always visible
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative", // Allows stacking the logo inside the header
                  }}
            >
                  {/* ✅ School Logo - Now Inside a Styled Box */}
                  <Box
                        sx={{
                              position: "absolute",
                              top: "15px", // Positioned near the top
                              right: "20px", // Adjusted for better spacing
                              backgroundColor: "rgba(128, 128, 128, 0.5)", // Grey color with opacity
                              padding: "8px", // Padding inside the box
                              borderRadius: "12px", // Rounded corners
                              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)", // Subtle shadow effect
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "auto",
                              height: "auto",
                        }}
                  >
                        <img
                              src={schoolLogo}
                              alt="School Logo"
                              style={{
                                    width: "auto",
                                    height: "130px", // ✅ Increased height to 130px
                                    maxHeight: "130px", // Ensures consistent size
                              }}
                        />
                  </Box>

                  {/* ✅ Main Title */}
                  <Box
                        sx={{
                              backgroundColor: "rgba(0, 0, 0, 0.6)", // Slightly darker overlay for readability
                              padding: { xs: "10px", md: "20px" },
                              borderRadius: "10px",
                              color: "white",
                              textAlign: "center",
                              width: { xs: "90%", sm: "70%", md: "50%" }, // Adjust width based on screen size
                              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)", // Subtle shadow effect
                        }}
                  >
                        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>Galvanic Cell</h1>
                  </Box>
            </Box>
      );
};

export default Header;
