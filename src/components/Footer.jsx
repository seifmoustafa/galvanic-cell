import { Box, Typography, Link } from "@mui/material";

const Footer = () => {
      return (<div style={{ marginTop: "20px" }}>
            <Box
                  sx={{
                        // backgroundColor: "#1565c0",
                        color: "white",
                        textAlign: "center",
                        padding: "16px",
                        marginTop: "20px",
                        borderTop: "3px solid white",
                  }}
            >
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        🔬 Galvanic Cell Experiment - References
                  </Typography>

                  <Typography variant="body2" sx={{ marginTop: "8px" }}>
                        Here are some useful links to learn more about Galvanic Cells:
                  </Typography>

                  <Box sx={{ marginTop: "10px" }}>
                        <Link
                              href="https://chem.libretexts.org/Bookshelves/General_Chemistry/Map%3A_General_Chemistry_(Petrucci_et_al.)/18%3A_Electrochemistry/18.3%3A_Galvanic_Cells"
                              target="_blank"
                              sx={{ color: "white", display: "block", marginTop: "5px", fontWeight: "bold" }}
                        >
                              📖 LibreTexts: Galvanic Cells
                        </Link>

                        <Link
                              href="https://en.wikipedia.org/wiki/Galvanic_cell"
                              target="_blank"
                              sx={{ color: "white", display: "block", marginTop: "5px", fontWeight: "bold" }}
                        >
                              🌍 Wikipedia: Galvanic Cell
                        </Link>

                        <Link
                              href="https://www.khanacademy.org/science/chemistry/oxidation-reduction/redox-electrochemistry/v/galvanic-cells"
                              target="_blank"
                              sx={{ color: "white", display: "block", marginTop: "5px", fontWeight: "bold" }}
                        >
                              🎥 Khan Academy: Galvanic Cells
                        </Link>

                        <Link
                              href="https://www.sciencedirect.com/topics/earth-and-planetary-sciences/galvanic-cell"
                              target="_blank"
                              sx={{ color: "white", display: "block", marginTop: "5px", fontWeight: "bold" }}
                        >
                              🔬 ScienceDirect: Galvanic Cells
                        </Link>
                  </Box>

                  <Typography variant="body2" sx={{ marginTop: "10px", fontStyle: "italic" }}>
                        © {new Date().getFullYear()} Galvanic Cell Project - All rights reserved.
                  </Typography>
            </Box></div>
      );
};

export default Footer;
