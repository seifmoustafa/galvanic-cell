import { useState } from "react";
import {
      Box,
      Card,
      Typography,
      Grid,
      TextField,
      MenuItem,
      Button,
      Dialog,
      DialogTitle,
      DialogContent,
      Fade,
      Backdrop
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
      Tooltip
} from "chart.js";

Chart.register(
      CategoryScale,
      LinearScale,
      LogarithmicScale,
      PointElement,
      LineElement,
      Title,
      Tooltip
);

const F = 96485;

const experiments = [
      {
            name: "خلية دانيال (Zn-Cu)",
            type: "galvanic",
            anode: -0.76,
            cathode: 0.34,
            electrons: 2,
            inputs: ["anodeConc", "cathodeConc"],
            xLabel: "التركيز (M)"
      },
      {
            name: "خلية مغنيسيوم-نحاس (Mg-Cu)",
            type: "galvanic",
            anode: -2.37,
            cathode: 0.34,
            electrons: 2,
            inputs: ["anodeConc", "cathodeConc"],
            xLabel: "التركيز (M)"
      },
      {
            name: "خلية الحديد-الفضة (Fe-Ag)",
            type: "galvanic",
            anode: -0.44,
            cathode: 0.80,
            electrons: 2,
            inputs: ["anodeConc", "cathodeConc"],
            xLabel: "التركيز (M)"
      },
      {
            name: "تحليل الماء كهربائياً",
            type: "electrolysis",
            voltageRequired: 1.23,
            inputs: ["voltage", "conductivity", "impurityConc", "temperature", "time"],
            xLabel: "الزمن (ث)"
      },
      {
            name: "تحليل محلول كلوريد الصوديوم",
            type: "electrolysis",
            voltageRequired: 2.2,
            inputs: ["NaClConc", "voltage", "temperature", "time"],
            xLabel: "الزمن (ث)"
      },
      {
            name: "جسر الملح NaCl",
            type: "salt_bridge",
            resistanceFactor: 0.02,
            inputs: ["saltConc", "conductivity", "distance"],
            xLabel: "المسافة (cm)"
      }
];

const GalvanicCalculator = () => {
      const [selectedExp, setSelectedExp] = useState(experiments[0]);
      const [inputs, setInputs] = useState({
            anodeConc: 0.01,
            cathodeConc: 1,
            voltage: 2,
            time: 10,
            saltConc: 1,
            conductivity: 1,
            distance: 5,
            impurityConc: 0.01,
            NaClConc: 1,
            temperature: 298
      });

      const [results, setResults] = useState(null);
      const [graphData, setGraphData] = useState({ datasets: [] });
      const [errorMessage, setErrorMessage] = useState("");
      const [showGraph, setShowGraph] = useState(false);

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
                  let dataPoints = [];
                  const stepCount = 200;

                  if (selectedExp.type === "galvanic") {
                        if (inputs.anodeConc <= 0 || inputs.cathodeConc <= 0)
                              throw new Error("⚠ قيم التركيز يجب أن تكون أكبر من الصفر!");

                        standardCellPotential = selectedExp.cathode - selectedExp.anode;
                        actualVoltage =
                              standardCellPotential -
                              (0.0591 / selectedExp.electrons) *
                              Math.log10(inputs.anodeConc / inputs.cathodeConc);
                        deltaG = -selectedExp.electrons * F * actualVoltage;

                        // We'll sample from 0.. up to user concentration
                        const maxConc = Math.max(inputs.anodeConc, inputs.cathodeConc);
                        const minC = 0.0001;
                        for (let i = 0; i <= stepCount; i++) {
                              const xVal = minC + (i / stepCount) * (maxConc - minC);
                              const yVal =
                                    standardCellPotential -
                                    (0.0591 / selectedExp.electrons) *
                                    Math.log10(xVal / inputs.anodeConc);
                              dataPoints.push({ x: xVal, y: yVal });
                        }
                  } else if (selectedExp.type === "electrolysis") {
                        // Especially for "تحليل الماء كهربائياً" or any other electrolysis
                        if (inputs.voltage < selectedExp.voltageRequired)
                              throw new Error("⚠ يجب أن يكون الجهد أكبر من الحد الأدنى للتحليل الكهربائي!");

                        standardCellPotential = selectedExp.voltageRequired;
                        actualVoltage = inputs.voltage - standardCellPotential;
                        deltaG = actualVoltage * F;

                        // 🟢 Here: time from 0.. user input
                        const maxTime = inputs.time;
                        if (maxTime < 0)
                              throw new Error("⚠ يجب أن يكون الوقت أكبر من الصفر!");

                        for (let i = 0; i <= stepCount; i++) {
                              const t = (i / stepCount) * maxTime;
                              const yVal = actualVoltage * t;
                              dataPoints.push({ x: t, y: yVal });
                        }
                  } else if (selectedExp.type === "salt_bridge") {
                        if (inputs.saltConc <= 0 || inputs.conductivity <= 0)
                              throw new Error("⚠ يجب أن تكون قيم التوصيلية والتركيز موجبة!");

                        standardCellPotential =
                              selectedExp.resistanceFactor *
                              (inputs.saltConc / inputs.conductivity);
                        actualVoltage = standardCellPotential;
                        deltaG = -F * actualVoltage;

                        // distance from 0.. user distance
                        const maxDist = inputs.distance;
                        for (let i = 0; i <= stepCount; i++) {
                              const dist = (i / stepCount) * maxDist;
                              dataPoints.push({ x: dist, y: standardCellPotential * dist });
                        }
                  }

                  setResults({
                        "جهد الخلية القياسي": standardCellPotential.toFixed(2) + " V",
                        "الجهد الفعلي": actualVoltage.toFixed(2) + " V",
                        "طاقة جيبس الحرة (ΔG)": (deltaG / 1000).toFixed(2) + " kJ"
                  });

                  setGraphData({
                        datasets: [
                              {
                                    label: "الجهد الكهربائي (V)",
                                    data: dataPoints,
                                    borderColor: "#1565c0",
                                    borderWidth: 3,
                                    pointRadius: 0,
                                    pointHoverRadius: 10,
                                    tension: 0.4,
                                    fill: false
                              }
                        ]
                  });

                  setShowGraph(false);
            } catch (error) {
                  setErrorMessage(error.message);
            }
      };

      const toggleGraph = () => {
            setShowGraph((prev) => !prev);
      };

      const xAxisLabel = selectedExp.xLabel || "X-Axis";
      const yAxisLabel = "الجهد (V)";

      const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                  mode: "index",
                  intersect: false
            },
            plugins: {
                  tooltip: {
                        enabled: true,
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        titleColor: "#333",
                        bodyColor: "#333",
                        borderColor: "#1565c0",
                        borderWidth: 1,
                        displayColors: false,
                        callbacks: {
                              title: function (tooltipItems) {
                                    const xVal = tooltipItems[0].parsed.x.toFixed(3);
                                    return `${xAxisLabel}: ${xVal}`;
                              },
                              label: function (tooltipItem) {
                                    const yVal = tooltipItem.parsed.y.toFixed(3);
                                    return `الجهد: ${yVal} V`;
                              }
                        }
                  }
            },
            scales: {
                  x: {
                        type: "linear",
                        title: {
                              display: true,
                              text: xAxisLabel,
                              color: "#000",
                              font: {
                                    size: 16,
                                    weight: "bold"
                              }
                        },
                        ticks: {
                              color: "#000"
                        },
                        grid: {
                              color: "rgba(0,0,0,0.1)"
                        },
                        beginAtZero: true
                  },
                  y: {
                        type: "linear",
                        title: {
                              display: true,
                              text: yAxisLabel,
                              color: "#000",
                              font: {
                                    size: 16,
                                    weight: "bold"
                              }
                        },
                        ticks: {
                              color: "#000"
                        },
                        grid: {
                              color: "rgba(0,0,0,0.1)"
                        },
                        beginAtZero: true
                  }
            }
      };

      return (
            <Box sx={{ padding: 4, direction: "rtl", marginTop: "20px" }}>
                  <Typography
                        variant="h4"
                        sx={{ fontWeight: "bold", textAlign: "center", color: "white" }}
                  >
                        ⚡ حساب الجهد الكهربائي للخلايا الجلفانية والتحليل الكهربائي
                  </Typography>

                  {/* Inputs Section */}
                  <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                              <Card sx={{ padding: 3, boxShadow: 3, backgroundColor: "#f9f9f9" }}>
                                    <Typography variant="h6">اختر التجربة</Typography>
                                    <TextField
                                          select
                                          fullWidth
                                          label="التجربة"
                                          value={selectedExp.name}
                                          onChange={(e) => {
                                                e.preventDefault();
                                                const newExp = experiments.find(
                                                      (exp) => exp.name === e.target.value
                                                );
                                                setSelectedExp(newExp);
                                          }}
                                          onClick={(e) => e.stopPropagation()}
                                          onFocus={(e) => e.stopPropagation()}
                                    >
                                          {experiments.map((exp, index) => (
                                                <MenuItem key={index} value={exp.name}>
                                                      {exp.name}
                                                </MenuItem>
                                          ))}
                                    </TextField>
                              </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                              <Card sx={{ padding: 3, boxShadow: 3, backgroundColor: "#f9f9f9" }}>
                                    <Typography variant="h6">إدخال القيم</Typography>
                                    {selectedExp.inputs.map((field) => (
                                          <TextField
                                                fullWidth
                                                key={field}
                                                type="number"
                                                sx={{ marginTop: 2 }}
                                                label={field.replace(/([A-Z])/g, " $1")}
                                                value={inputs[field]}
                                                onChange={(e) => handleInputChange(field, e.target.value)}
                                          />
                                    ))}
                              </Card>
                        </Grid>
                  </Grid>

                  {/* Calculate Button */}
                  <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={calculateResults}
                        sx={{ fontSize: "18px", padding: "12px", marginTop: 3 }}
                  >
                        احسب النتائج 🔢
                  </Button>

                  {/* Results */}
                  {results && (
                        <Grid container spacing={2} sx={{ marginTop: 3 }}>
                              {Object.entries(results).map(([key, value]) => (
                                    <Grid item xs={12} sm={6} key={key}>
                                          <Card
                                                sx={{
                                                      padding: 2,
                                                      textAlign: "center",
                                                      backgroundColor: "#e3f2fd",
                                                      fontSize: "18px"
                                                }}
                                          >
                                                <Typography sx={{ fontWeight: "bold" }}>
                                                      ✅ {key}: {value}
                                                </Typography>
                                          </Card>
                                    </Grid>
                              ))}
                        </Grid>
                  )}

                  {/* Toggle Graph */}
                  {results && (
                        <Button
                              variant="outlined"
                              color="secondary"
                              fullWidth
                              onClick={() => setShowGraph((prev) => !prev)}
                              sx={{ fontSize: "18px", padding: "12px", marginTop: 2, color: "white" }}
                        >
                              {showGraph ? "إخفاء الرسم البياني" : "إظهار الرسم البياني"}
                        </Button>
                  )}

                  {/* The Graph */}
                  {showGraph && graphData.datasets.length > 0 && (
                        <Card sx={{ padding: 3, marginTop: 3, boxShadow: 3, width: "100%" }}>
                              <Box sx={{ width: "100%", height: "500px" }}>
                                    <Line data={graphData} options={chartOptions} />
                              </Box>
                        </Card>
                  )}

                  {/* Error Dialog */}
                  <Dialog open={!!errorMessage} TransitionComponent={Fade} onClose={closeErrorPopup}>
                        <Backdrop
                              open={!!errorMessage}
                              sx={{ zIndex: -1 }}
                              onClick={closeErrorPopup}
                        />
                        <DialogTitle sx={{ color: "red", textAlign: "center" }}>
                              ⚠ خطأ
                        </DialogTitle>
                        <DialogContent sx={{ textAlign: "center" }}>{errorMessage}</DialogContent>
                  </Dialog>
            </Box>
      );
};

export default GalvanicCalculator;
