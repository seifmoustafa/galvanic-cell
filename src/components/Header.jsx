import { Box, Card, Typography } from "@mui/material";
import backgroundImage from "../assets/background.png";

const Header = () => {
      return (
            <Box
                  sx={{
                        position: "relative",
                        width: "100%",
                        height: "1060px", // Adjusts to the image height
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: "100% 100%", // Stretches the image to fit fully
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "40px 0", // Adds spacing for better aesthetics

                  }}
            >
                  {/* Gradient Overlay for better text visibility */}
                  <Box
                        sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              background: "linear-gradient( rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.2) )",
                        }}
                  />

                  {/* Title Card */}
                  <Card
                        sx={{
                              position: "relative",
                              backgroundColor: "rgba(255, 255, 255, 0.2)",
                              backdropFilter: "blur(8px)",
                              padding: "20px 40px",
                              borderRadius: "12px",
                              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                              textAlign: "center",
                        }}
                  >
                        <Typography variant="h2" sx={{ fontWeight: "bold", color: "white" }}>
                              Galvanic Cel
                        </Typography>
                  </Card>
            </Box>
      );
};

export default Header;
