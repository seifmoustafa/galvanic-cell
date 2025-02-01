import { Box, Card, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider } from "@mui/material";
import ScienceIcon from "@mui/icons-material/Science";
import BoltIcon from "@mui/icons-material/Bolt";
import FunctionsIcon from "@mui/icons-material/Functions";

const cellData = [
  {
    name: "Daniel Cell (Zn-Cu)",
    anode: "Zinc (Zn) → Oxidation",
    cathode: "Copper (Cu) → Reduction",
    electrolytes: "ZnSO₄ (Anode Half-Cell), CuSO₄ (Cathode Half-Cell)",
    standardPotential: "E° = 1.10V",
    applications: [
      "Used in early batteries.",
      "Basis for modern voltaic cells.",
      "Helps in corrosion studies.",
    ],
    calculation: {
      inputs: ["Zn²⁺ concentration: 1M", "Cu²⁺ concentration: 0.01M", "Temperature: 25°C"],
      equation: "E = 1.10 + 0.02955 = 1.13V",
      results: ["Reaction is spontaneous (E > 0)", "Voltage: 1.13V under given conditions"],
    },
  },
  {
    name: "Aluminium-Copper Cell (Al-Cu)",
    anode: "Aluminium (Al)",
    cathode: "Copper (Cu)",
    electrolytes: "Al(NO₃)₃ and CuSO₄",
    standardPotential: "E° = 2.00V",
    applications: [
      "Used in lightweight batteries.",
      "Potential application in marine corrosion control.",
    ],
    calculation: {
      inputs: ["Al³⁺ concentration: 0.1M", "Cu²⁺ concentration: 1M", "Temperature: 25°C"],
      equation: "E = 2.00 + 0.00985 = 2.01V",
      results: ["Voltage: 2.01V under these conditions.", "Stronger battery than Daniel Cell."],
    },
  },
  {
    name: "Iron-Silver Cell (Fe-Ag)",
    anode: "Iron (Fe)",
    cathode: "Silver (Ag)",
    electrolytes: "FeSO₄ and AgNO₃",
    standardPotential: "E° = 1.24V",
    applications: [
      "Used in high-end batteries.",
      "Silver electrodes are used in medical sensors.",
    ],
    calculation: {
      inputs: ["Fe²⁺ concentration: 1M", "Ag⁺ concentration: 0.01M", "Temperature: 25°C"],
      equation: "E = 1.24 + 0.02955 = 1.27V",
      results: ["Voltage: 1.27V under these conditions.", "Highly efficient due to silver’s high reduction potential."],
    },
  },
];

const summaryData = [
  { type: "Daniel Cell (Zn-Cu)", standardVoltage: "1.10V", actualVoltage: "1.13V" },
  { type: "Aluminium-Copper (Al-Cu)", standardVoltage: "2.00V", actualVoltage: "2.01V" },
  { type: "Iron-Silver (Fe-Ag)", standardVoltage: "1.24V", actualVoltage: "1.27V" },
  { type: "Magnesium-Copper (Mg-Cu)", standardVoltage: "2.71V", actualVoltage: "2.72V" },
  { type: "Nickel-Copper (Ni-Cu)", standardVoltage: "0.59V", actualVoltage: "0.62V" },
];

const GalvanicTheory = () => {
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 3, textAlign: "center", color: "#1565c0" }}>
        🔬 Theoretical Analysis of Galvanic Cells
      </Typography>

      <Grid container spacing={4}>
        {cellData.map((cell, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card sx={{ padding: 3, boxShadow: 4, borderRadius: "12px", backgroundColor: "#f5f5f5" }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1565c0", textAlign: "center" }}>
                {cell.name}
              </Typography>

              <Divider sx={{ marginY: 2 }} />

              {/* Electrodes */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <ScienceIcon sx={{ color: "#ff9800" }} />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Electrodes:
                </Typography>
              </Box>
              <Typography>Anode: {cell.anode}</Typography>
              <Typography>Cathode: {cell.cathode}</Typography>

              {/* Electrolytes */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginTop: 1 }}>
                <BoltIcon sx={{ color: "#4caf50" }} />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Electrolytes:
                </Typography>
              </Box>
              <Typography>{cell.electrolytes}</Typography>

              {/* Standard Cell Potential */}
              <Typography
                variant="h6"
                sx={{ marginTop: 2, fontWeight: "bold", color: "#d32f2f", textAlign: "center" }}
              >
                {cell.standardPotential}
              </Typography>

              {/* Applications */}
              <Typography variant="h6" sx={{ marginTop: 2, fontWeight: "bold" }}>
                ⚡ Applications:
              </Typography>
              <ul>
                {cell.applications.map((app, idx) => (
                  <li key={idx}>
                    <Typography>{app}</Typography>
                  </li>
                ))}
              </ul>

              {/* Calculation Part */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginTop: 2 }}>
                <FunctionsIcon sx={{ color: "#0288d1" }} />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Calculation Part:
                </Typography>
              </Box>
              <Typography>User Inputs:</Typography>
              <ul>
                {cell.calculation.inputs.map((input, idx) => (
                  <li key={idx}>
                    <Typography>{input}</Typography>
                  </li>
                ))}
              </ul>
              <Typography sx={{ fontStyle: "italic", color: "#0288d1", textAlign: "center", fontWeight: "bold" }}>
                {cell.calculation.equation}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Summary Table */}
      <Typography variant="h4" sx={{ fontWeight: "bold", marginTop: 5, textAlign: "center" }}>
        📊 Final Summary
      </Typography>

      <TableContainer component={Paper} sx={{ marginTop: 2, borderRadius: "12px", overflow: "hidden" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#1565c0" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Cell Type</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Standard Voltage (V)</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Voltage Under Given Conditions (V)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {summaryData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.standardVoltage}</TableCell>
                <TableCell>{row.actualVoltage}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GalvanicTheory;
