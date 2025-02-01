import { useState } from "react";
import {
      Box, Card, Typography, Grid, TextField, MenuItem, Button, Dialog, DialogTitle, DialogContent, Fade, Backdrop
} from "@mui/material";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, LogarithmicScale, PointElement, LineElement, Title, Tooltip } from "chart.js";

Chart.register(CategoryScale, LinearScale, LogarithmicScale, PointElement, LineElement, Title, Tooltip);

const F = 96485;

const experiments = [
      { name: "خلية دانيال (Zn-Cu)", type: "galvanic", anode: -0.76, cathode: 0.34, electrons: 2, inputs: ["anodeConc", "cathodeConc"] },
      { name: "خلية مغنيسيوم-نحاس (Mg-Cu)", type: "galvanic", anode: -2.37, cathode: 0.34, electrons: 2, inputs: ["anodeConc", "cathodeConc"] },
      { name: "خلية الحديد-الفضة (Fe-Ag)", type: "galvanic", anode: -0.44, cathode: 0.80, electrons: 2, inputs: ["anodeConc", "cathodeConc"] },
      { name: "تحليل الماء كهربائياً", type: "electrolysis", voltageRequired: 1.23, inputs: ["voltage", "conductivity", "impurityConc", "temperature"] },
      { name: "تحليل محلول كلوريد الصوديوم", type: "electrolysis", voltageRequired: 2.2, inputs: ["NaClConc", "voltage", "temperature", "time"] },
      { name: "جسر الملح NaCl", type: "salt_bridge", resistanceFactor: 0.02, inputs: ["saltConc", "conductivity", "distance"] }
];

const GalvanicCalculator = () => {
      const [selectedExp, setSelectedExp] = useState(experiments[0]);
      const [inputs, setInputs] = useState({
            anodeConc: 0.01, cathodeConc: 1, voltage: 2, time: 10,
            saltConc: 1, conductivity: 1, distance: 5, impurityConc: 0.01, NaClConc: 1, temperature: 298
      });
      const [results, setResults] = useState(null);
      const [graphData, setGraphData] = useState({ labels: [], datasets: [] });
      const [errorMessage, setErrorMessage] = useState("");

      const handleInputChange = (field, value) => {
            setInputs((prev) => ({ ...prev, [field]: parseFloat(value) }));
      };

      const closeErrorPopup = () => {
            setErrorMessage("");
      };

      const calculateResults = () => {
            try {
                  let standardCellPotential = 0;
                  let actualVoltage = 0;
                  let deltaG = 0;
                  let labels = [];
                  let dataPoints = [];

                  if (selectedExp.type === "galvanic") {
                        if (inputs.anodeConc <= 0 || inputs.cathodeConc <= 0) throw new Error("⚠ قيم التركيز يجب أن تكون أكبر من الصفر!");
                        standardCellPotential = selectedExp.cathode - selectedExp.anode;
                        actualVoltage = standardCellPotential - (0.0591 / selectedExp.electrons) * Math.log10(inputs.anodeConc / inputs.cathodeConc);
                        deltaG = -selectedExp.electrons * F * actualVoltage;

                        for (let i = 1; i <= 50; i++) {
                              let conc = 0.001 + i * 0.1;
                              labels.push(conc.toFixed(2));
                              dataPoints.push(standardCellPotential - (0.0591 / selectedExp.electrons) * Math.log10(conc / inputs.anodeConc));
                        }
                  } else if (selectedExp.type === "electrolysis") {
                        if (inputs.voltage < selectedExp.voltageRequired) throw new Error("⚠ يجب أن يكون الجهد أكبر من الحد الأدنى للتحليل الكهربائي!");
                        standardCellPotential = selectedExp.voltageRequired;
                        actualVoltage = inputs.voltage - standardCellPotential;
                        deltaG = actualVoltage * F;

                        for (let i = 0; i <= inputs.time; i++) {
                              labels.push(i);
                              dataPoints.push(actualVoltage * i);
                        }
                  } else if (selectedExp.type === "salt_bridge") {
                        if (inputs.saltConc <= 0 || inputs.conductivity <= 0) throw new Error("⚠ يجب أن تكون قيم التوصيلية والتركيز موجبة!");
                        standardCellPotential = selectedExp.resistanceFactor * (inputs.saltConc / inputs.conductivity);
                        actualVoltage = standardCellPotential;
                        deltaG = -F * actualVoltage;

                        for (let i = 1; i <= 50; i++) {
                              labels.push(i);
                              dataPoints.push(standardCellPotential * i);
                        }
                  }

                  setResults({
                        "الجهد القياسي للخلية": standardCellPotential.toFixed(2),
                        "الجهد الفعلي": actualVoltage.toFixed(2),
                        "طاقة جيبس الحرة (ΔG)": (deltaG / 1000).toFixed(2),
                  });

                  setGraphData({
                        labels: labels,
                        datasets: [
                              {
                                    label: "الجهد الكهربائي (V)",
                                    data: dataPoints,
                                    borderColor: "#1565c0",
                                    borderWidth: 3,
                                    pointRadius: 0,
                                    fill: false,
                                    tension: 0.3,
                              },
                        ],
                  });
            } catch (error) {
                  setErrorMessage(error.message);
            }
      };

      return (
            <Box sx={{ padding: 4, direction: "rtl" }}>
                  <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center", color: "#1565c0" }}>
                        ⚡ حساب الجهد الكهربائي للخلايا الجلفانية والتحليل الكهربائي
                  </Typography>

                  <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                              <Card sx={{ padding: 3, boxShadow: 3, backgroundColor: "#f9f9f9" }}>
                                    <Typography variant="h6">اختر التجربة</Typography>
                                    <TextField select fullWidth label="التجربة" value={selectedExp.name} onChange={(e) => setSelectedExp(experiments.find(exp => exp.name === e.target.value))}>
                                          {experiments.map((exp, index) => <MenuItem key={index} value={exp.name}>{exp.name}</MenuItem>)}
                                    </TextField>
                              </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                              <Card sx={{ padding: 3, boxShadow: 3, backgroundColor: "#f9f9f9" }}>
                                    <Typography variant="h6">إدخال القيم</Typography>
                                    {selectedExp.inputs.map((field) => (
                                          <TextField fullWidth key={field} type="number" sx={{ marginTop: 2 }} label={field.replace(/([A-Z])/g, " $1")} value={inputs[field]} onChange={(e) => handleInputChange(field, e.target.value)} />
                                    ))}
                              </Card>
                        </Grid>
                  </Grid>

                  <Button variant="contained" color="primary" fullWidth onClick={calculateResults} sx={{ fontSize: "18px", padding: "12px", marginTop: 3 }}>
                        احسب النتائج 🔢
                  </Button>
                  {results && (
                        <Grid container spacing={2} sx={{ marginTop: 3 }}>
                              {Object.entries(results).map(([key, value]) => (
                                    <Grid item xs={12} sm={4} key={key}>
                                          <Card sx={{ padding: 2, textAlign: "center", backgroundColor: "#e3f2fd", fontSize: "18px" }}>
                                                <Typography sx={{ fontWeight: "bold" }}>✅ {key}: {value}</Typography>
                                          </Card>
                                    </Grid>
                              ))}
                        </Grid>
                  )}
                  {graphData.labels.length > 0 && (
                        <Card sx={{ padding: 3, marginTop: 3, boxShadow: 3, width: "100%" }}>
                              <Box sx={{ width: "100%", height: "500px" }}>
                                    <Line data={graphData} options={{ responsive: true, maintainAspectRatio: false, plugins: { tooltip: { enabled: true } } }} />
                              </Box>
                        </Card>
                  )}
                  <Dialog open={!!errorMessage} TransitionComponent={Fade} onClose={closeErrorPopup}>
                        <Backdrop open={!!errorMessage} sx={{ zIndex: -1 }} onClick={closeErrorPopup} />
                        <DialogTitle sx={{ color: "red", textAlign: "center" }}>⚠ خطأ</DialogTitle>
                        <DialogContent sx={{ textAlign: "center" }}>{errorMessage}</DialogContent>
                  </Dialog>
            </Box>
      );
};

export default GalvanicCalculator;
