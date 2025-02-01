import { useState } from "react";
import {
      Box,
      Card,
      Typography,
      Grid,
      TextField,
      MenuItem,
      Button,
      Divider,
      Dialog,
      DialogTitle,
      DialogContent,
      Fade,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import {
      Chart,
      CategoryScale,
      LinearScale,
      LogarithmicScale,
      PointElement,
      LineElement,
      Title,
      Tooltip,
} from "chart.js";

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, LogarithmicScale, PointElement, LineElement, Title, Tooltip);

const F = 96485; // Faraday's constant

const galvanicCells = [
      {
            name: "Daniel Cell (Zn-Cu)",
            anode: { metal: "Zn", potential: -0.76 },
            cathode: { metal: "Cu", potential: 0.34 },
            electrons: 2,
      },
      {
            name: "Magnesium-Copper Cell (Mg-Cu)",
            anode: { metal: "Mg", potential: -2.37 },
            cathode: { metal: "Cu", potential: 0.34 },
            electrons: 2,
      },
      {
            name: "Iron-Silver Cell (Fe-Ag)",
            anode: { metal: "Fe", potential: -0.44 },
            cathode: { metal: "Ag", potential: 0.80 },
            electrons: 2,
      },
];

const GalvanicCalculator = () => {
      const [selectedCell, setSelectedCell] = useState(galvanicCells[0]);
      const [anodeConcentration, setAnodeConcentration] = useState(0.01);
      const [cathodeConcentration, setCathodeConcentration] = useState(1);
      const [results, setResults] = useState(null);
      const [graphData, setGraphData] = useState({ labels: [], datasets: [] });
      const [errorMessage, setErrorMessage] = useState(false);

      const calculateResults = () => {
            const { anode, cathode, electrons } = selectedCell;

            if (anodeConcentration <= 0 || cathodeConcentration <= 0) {
                  setErrorMessage(true); // Show error popup
                  setTimeout(() => setErrorMessage(false), 1500); // Auto-close after 1.5s
                  return;
            }

            // ✅ Standard Cell Potential Calculation
            const standardCellPotential = cathode.potential - anode.potential;

            // ✅ Nernst Equation Application
            const E_actual =
                  standardCellPotential -
                  (0.0591 / electrons) * Math.log10(anodeConcentration / cathodeConcentration);

            // ✅ Gibbs Free Energy Calculation
            const deltaG = -electrons * F * E_actual;
            const deltaG_kJ = deltaG / 1000;

            setResults({
                  standardCellPotential: standardCellPotential.toFixed(2),
                  actualVoltage: E_actual.toFixed(2),
                  gibbsFreeEnergy: deltaG_kJ.toFixed(2),
            });

            // ✅ Properly Scale X-Axis
            const minConcentration = Math.min(anodeConcentration, cathodeConcentration) / 10;
            const maxConcentration = Math.max(anodeConcentration, cathodeConcentration) * 10;

            let concentrations = [];
            let voltages = [];

            for (let i = 0; i <= 100; i++) {
                  const conc = minConcentration * Math.pow(10, (i / 100) * Math.log10(maxConcentration / minConcentration));
                  concentrations.push(conc);
                  voltages.push(
                        standardCellPotential - (0.0591 / electrons) * Math.log10(conc / anodeConcentration)
                  );
            }

            setGraphData({
                  labels: concentrations.map(val => val.toFixed(2)),
                  datasets: [
                        {
                              label: "Cell Voltage (V)",
                              data: voltages,
                              borderColor: "#1565c0",
                              borderWidth: 3,
                              pointBackgroundColor: "transparent",
                              pointRadius: 0,
                              fill: false,
                              tension: 0.4,
                        },
                  ],
            });
      };

      return (
            <Box sx={{ padding: 4 }}>
                  <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 3, textAlign: "center", color: "#1565c0" }}>
                        ⚡ Galvanic Cell Calculator
                  </Typography>

                  <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                              <Card sx={{ padding: 3, boxShadow: 3 }}>
                                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>Select Galvanic Cell</Typography>
                                    <TextField select fullWidth label="Galvanic Cell" value={selectedCell.name} onChange={(e) => setSelectedCell(galvanicCells.find(cell => cell.name === e.target.value))} sx={{ marginTop: 2 }}>
                                          {galvanicCells.map((cell, index) => (
                                                <MenuItem key={index} value={cell.name}>{cell.name}</MenuItem>
                                          ))}
                                    </TextField>
                              </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                              <Card sx={{ padding: 3, boxShadow: 3 }}>
                                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>Input Parameters</Typography>
                                    <TextField fullWidth type="number" label="Anode Concentration (M)" value={anodeConcentration} onChange={(e) => setAnodeConcentration(parseFloat(e.target.value))} sx={{ marginTop: 2 }} />
                                    <TextField fullWidth type="number" label="Cathode Concentration (M)" value={cathodeConcentration} onChange={(e) => setCathodeConcentration(parseFloat(e.target.value))} sx={{ marginTop: 2 }} />
                              </Card>
                        </Grid>
                  </Grid>

                  <Divider sx={{ marginY: 3 }} />

                  <Button variant="contained" color="primary" fullWidth onClick={calculateResults} sx={{ fontSize: "18px", padding: "12px" }}>
                        Calculate 🔢
                  </Button>

                  {results && (
                        <Card sx={{ padding: 3, marginTop: 3, boxShadow: 3 }}>
                              <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center" }}>Results</Typography>
                              <Typography>✅ <strong>Standard Cell Voltage:</strong> {results.standardCellPotential}V</Typography>
                              <Typography>✅ <strong>Actual Voltage:</strong> {results.actualVoltage}V</Typography>
                              <Typography>✅ <strong>Gibbs Free Energy (ΔG):</strong> {results.gibbsFreeEnergy} kJ</Typography>
                        </Card>
                  )}

                  {graphData.labels.length > 0 && (
                        <Card sx={{ padding: 3, marginTop: 3, boxShadow: 3 }}>
                              <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center" }}>Voltage vs. Concentration</Typography>
                              <Box sx={{ width: "100%", height: "300px" }}>
                                    <Line data={graphData} options={{
                                          responsive: true,
                                          maintainAspectRatio: false,
                                          plugins: {
                                                tooltip: {
                                                      enabled: true,
                                                      mode: "nearest",
                                                      intersect: false,
                                                      callbacks: {
                                                            label: function (tooltipItem) {
                                                                  return `Voltage: ${tooltipItem.raw.toFixed(3)}V`;
                                                            },
                                                            title: function (tooltipItems) {
                                                                  return `Concentration: ${tooltipItems[0].label} M`;
                                                            },
                                                      },
                                                },
                                          },
                                    }} />
                              </Box>
                        </Card>
                  )}

                  {/* Popup for Error Messages */}
                  <Dialog
                        open={errorMessage}
                        onClose={() => setErrorMessage(false)}
                        sx={{ backdropFilter: "blur(1px)" }} // Blurred background
                        TransitionComponent={Fade} // Smooth animation
                        transitionDuration={1000} // 1.5 seconds
                  >
                        <DialogTitle sx={{ textAlign: "center", color: "red", fontWeight: "bold" }}>⚠ Error</DialogTitle>
                        <DialogContent sx={{ textAlign: "center", fontSize: "18px" }}>
                              ❌ Concentration values must be greater than zero!
                        </DialogContent>
                  </Dialog>
            </Box>
      );
};

export default GalvanicCalculator;
