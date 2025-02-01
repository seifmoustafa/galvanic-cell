import { Box } from "@mui/material";
import backgroundImage from "../assets/back.jpeg";
import schoolLogo from "../assets/school.png"; // Importing the school logo

const Header = () => {
      return (
            <Box
                  sx={{
                        width: "100%", // Full width for all screens
                        minHeight: { xs: "300px", sm: "400px", md: "550px", lg: "1600px" }, // Adjust height dynamically
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: "cover", // Ensures the full image is always visible
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative", // Allows stacking the logo inside the header
                        padding: "20px 0", // Add padding for spacing
                  }}
            >
                  {/* ✅ School Logo Positioned in Top Right */}
                  <Box
                        sx={{
                              position: "absolute",
                              top: { xs: "10px", sm: "20px" }, // Adjust top for small and larger screens
                              right: "20px", // Fixed right alignment
                              backgroundColor: "rgba(128, 128, 128, 0.6)", // Grey color with opacity
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
                                    height: "100px", // Adjusted height to fit better on mobile
                                    maxHeight: "100px", // Ensures consistent size
                              }}
                        />
                  </Box>

                  {/* ✅ Main Title */}
                  <Box 
                        sx={{
                              backgroundColor: "rgba(0, 0, 0, 0.6)", // Slightly darker overlay for readability
                              padding: { xs: "2px", md: "20px", lg: "40px", xl: "60px", xxl: "80px" }, // Adjust padding for different screens
                              borderRadius: "10px",
                              color: "white",
                              textAlign: "center",
                              width: { xs: "90%", sm: "80%", md: "60%" }, // Adjust width based on screen size
                              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)", // Subtle shadow effect
                        }}
                  >
                        <h1 style={{ fontSize: "2rem", fontWeight: "bold", margin: 0 }}>
                              Galvanic Cell
                        </h1>
                  </Box>
            </Box>
      );
};

export default Header;
