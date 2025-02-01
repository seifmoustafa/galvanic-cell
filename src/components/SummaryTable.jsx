import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";

const SummaryTable = () => {
      const data = [
            { cell: "خلية دانيال (Zn-Cu)", standardVoltage: "1.10V", actualVoltage: "1.13V" },
            { cell: "خلية الألمنيوم-النحاس (Al-Cu)", standardVoltage: "2.00V", actualVoltage: "2.01V" },
            { cell: "خلية الحديد-الفضة (Fe-Ag)", standardVoltage: "1.24V", actualVoltage: "1.27V" },
            { cell: "خلية المغنيسيوم-النحاس (Mg-Cu)", standardVoltage: "2.71V", actualVoltage: "2.72V" },
            { cell: "خلية النيكل-النحاس (Ni-Cu)", standardVoltage: "0.59V", actualVoltage: "0.62V" },
            { cell: "خلية الرصاص-النحاس (Pb-Cu)", standardVoltage: "0.92V", actualVoltage: "0.95V" },
      ];

      return (<div style={{ marginTop: "20px" }}>
            <Box sx={{
                  mt: 4,
                  p: 3,
                  backgroundColor: "#f8f1e3",
                  borderRadius: "12px",
                  boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
                  direction: "rtl"
            }}>
                  <Typography variant="h5" sx={{
                        textAlign: "center",
                        fontWeight: "bold",
                        color: "#0d47a1",
                        mb: 3,
                        textShadow: "1px 1px 2px rgba(0,0,0,0.2)"
                  }}>
                        🔹 **الملخص النهائي لحسابات الجهد الكهربائي للخلايا الجلفانية**
                  </Typography>
                  <TableContainer component={Paper} sx={{
                        borderRadius: "12px",
                        boxShadow: "0px 3px 10px rgba(0,0,0,0.1)"
                  }}>
                        <Table>
                              <TableHead sx={{ background: "linear-gradient(45deg, #0d47a1, #1976d2)" }}>
                                    <TableRow>
                                          <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center", fontSize: "16px" }}>
                                                نوع الخلية
                                          </TableCell>
                                          <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center", fontSize: "16px" }}>
                                                الجهد القياسي (V)
                                          </TableCell>
                                          <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center", fontSize: "16px" }}>
                                                الجهد تحت الظروف الحالية (V)
                                          </TableCell>
                                    </TableRow>
                              </TableHead>
                              <TableBody>
                                    {data.map((row, index) => (
                                          <TableRow key={index} sx={{
                                                backgroundColor: index % 2 === 0 ? "#ffffff" : "#f2f2f2",
                                                "&:hover": { backgroundColor: "#e3f2fd", transition: "0.3s ease-in-out" }
                                          }}>
                                                <TableCell sx={{ textAlign: "center", fontWeight: "bold", color: "#333" }}>{row.cell}</TableCell>
                                                <TableCell sx={{ textAlign: "center", color: "#0d47a1", fontWeight: "bold" }}>{row.standardVoltage}</TableCell>
                                                <TableCell sx={{ textAlign: "center", color: "#00897b", fontWeight: "bold" }}>{row.actualVoltage}</TableCell>
                                          </TableRow>
                                    ))}
                              </TableBody>
                        </Table>
                  </TableContainer>
            </Box></div>
      );
};

export default SummaryTable;
