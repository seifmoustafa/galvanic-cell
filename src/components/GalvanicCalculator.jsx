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

// Register Chart.js components
Chart.register(
      CategoryScale,
      LinearScale,
      LogarithmicScale,
      PointElement,
      LineElement,
      Title,
      Tooltip
);

// Faraday's constant (C/mol)
const F = 96485;

/**
 * Experiments array:
 *  - type: (galvanic, electrolysis, kcl_bridge)
 *  - xLabel: the label for the X-axis in Arabic
 *  - inputs: array of keys that the user must provide
 */
const experiments = [
      {
            name: "خلية دانيال (Zn-Cu)",
            type: "galvanic",
            anode: -0.76,
            cathode: 0.34,
            electrons: 2,
            inputs: ["anodeConc", "cathodeConc"], // concentrations
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
            // We'll treat "time" as (s), "voltage" as (V), "conductivity" as (S/m), etc.
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
            // ✅ Changed from "جسر الملح NaCl" to "جسر الملح KCl" 
            name: "جسر الملح KCl (خلية ماسور)",
            type: "kcl_bridge", // changed the 'type' to reflect KCl bridging
            resistanceFactor: 0.02,
            // We'll require kclConc instead of saltConc
            inputs: ["kclConc", "conductivity", "distance"],
            xLabel: "المسافة (cm)"
      }
];

const GalvanicCalculator = () => {
      // Default state: note we replaced saltConc with kclConc
      const [selectedExp, setSelectedExp] = useState(experiments[0]);
      const [inputs, setInputs] = useState({
            anodeConc: 0.01,  // (M)
            cathodeConc: 1,   // (M)
            voltage: 2,       // (V)
            time: 10,         // (s)
            kclConc: 1,       // (M) replaced saltConc
            conductivity: 1,  // (S/m)
            distance: 5,      // (cm)
            impurityConc: 0.01, // (?)
            NaClConc: 1,      // (M)
            temperature: 298  // (K)
      });

      const [results, setResults] = useState(null);
      const [graphData, setGraphData] = useState({ datasets: [] });
      const [errorMessage, setErrorMessage] = useState("");
      const [showGraph, setShowGraph] = useState(false);

      // Handle user input changes
      const handleInputChange = (field, value) => {
            setInputs((prev) => ({ ...prev, [field]: parseFloat(value) }));
      };

      const closeErrorPopup = () => {
            setErrorMessage("");
      };

      /**
       * Calculates the standard potential, actual voltage, and data points 
       * for each experiment type.
       * Also shows the new equation for KCl bridging:
       *   E(cell) = Rfactor * (kclConc / conductivity) * distance
       */
      const calculateResults = () => {
            try {
                  let standardCellPotential = 0;
                  let actualVoltage = 0;
                  let deltaG = 0;
                  let dataPoints = [];
                  const stepCount = 200;

                  if (selectedExp.type === "galvanic") {
                        if (inputs.anodeConc <= 0 || inputs.cathodeConc <= 0) {
                              throw new Error("⚠ قيم التركيز يجب أن تكون أكبر من الصفر!");
                        }
                        // E(cell)^0 = Ecathode - Eanode
                        standardCellPotential = selectedExp.cathode - selectedExp.anode;
                        // Actual voltage = E^0 - (0.0591 / n) * log10( anodeConc / cathodeConc )
                        actualVoltage =
                              standardCellPotential -
                              (0.0591 / selectedExp.electrons) *
                              Math.log10(inputs.anodeConc / inputs.cathodeConc);
                        deltaG = -selectedExp.electrons * F * actualVoltage;

                        // X-axis from ~0.. user concentrations
                        const maxConc = Math.max(inputs.anodeConc, inputs.cathodeConc);
                        const minC = 0.0001; // avoid log(0)
                        for (let i = 0; i <= stepCount; i++) {
                              const xVal = minC + (i / stepCount) * (maxConc - minC);
                              const yVal =
                                    standardCellPotential -
                                    (0.0591 / selectedExp.electrons) *
                                    Math.log10(xVal / inputs.anodeConc);
                              dataPoints.push({ x: xVal, y: yVal });
                        }
                  } else if (selectedExp.type === "electrolysis") {
                        // For time from 0.. inputs.time
                        if (inputs.voltage < selectedExp.voltageRequired) {
                              throw new Error(
                                    "⚠ يجب أن يكون الجهد أكبر من الحد الأدنى للتحليل الكهربائي!"
                              );
                        }
                        standardCellPotential = selectedExp.voltageRequired;
                        actualVoltage = inputs.voltage - standardCellPotential;
                        deltaG = actualVoltage * F;

                        const maxTime = inputs.time;
                        if (maxTime < 0) {
                              throw new Error("⚠ يجب أن يكون الوقت المدخل أكبر من الصفر!");
                        }
                        for (let i = 0; i <= stepCount; i++) {
                              const t = (i / stepCount) * maxTime;
                              const yVal = actualVoltage * t;
                              dataPoints.push({ x: t, y: yVal });
                        }
                  } else if (selectedExp.type === "kcl_bridge") {
                        // Our new KCl bridging approach
                        // E(cell) = Rfactor * (kclConc / conductivity) * distance
                        if (inputs.kclConc <= 0 || inputs.conductivity <= 0) {
                              throw new Error("⚠ يجب أن تكون قيم التوصيلية وتركيز KCl موجبة!");
                        }
                        const maxDist = inputs.distance;
                        if (maxDist < 0) {
                              throw new Error("⚠ يجب أن تكون المسافة المدخلة موجبة!");
                        }

                        // Standard potential for KCl bridging eq
                        // We'll treat it similarly
                        // E = Rfactor * (kclConc / conductivity) => "baseVoltage"
                        // Then actualVoltage = baseVoltage * dist
                        const baseVoltage =
                              selectedExp.resistanceFactor *
                              (inputs.kclConc / inputs.conductivity);

                        // If we want an "overall" measure:
                        standardCellPotential = baseVoltage; // some reference
                        // If we incorporate distance in the final eq:
                        // E(cell) = baseVoltage * dist

                        // Let's say actualVoltage = baseVoltage * distance at user input distance
                        actualVoltage = baseVoltage * maxDist;

                        // deltaG for 1 electron exchange? 
                        // Just demonstration:
                        deltaG = -F * actualVoltage;

                        // We'll sample from distance=0.. user distance
                        for (let i = 0; i <= stepCount; i++) {
                              const dist = (i / stepCount) * maxDist;
                              const yVal = baseVoltage * dist;
                              dataPoints.push({ x: dist, y: yVal });
                        }
                  }

                  setResults({
                        "جهد الخلية القياسي": standardCellPotential.toFixed(2) + " V",
                        "الجهد الفعلي": actualVoltage.toFixed(2) + " V",
                        // "طاقة جيبس الحرة (ΔG)": (deltaG / 1000).toFixed(2) + " kJ"
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

      // Axis Labels
      const xAxisLabel = selectedExp.xLabel || "X-Axis";
      const yAxisLabel = "الجهد (V)";

      // Chart Options
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

      // We'll show custom labels for each input with units
      // in place of field.replace(...) if we want
      const fieldLabels = {
            anodeConc: "تركيز الأنود (M)",
            cathodeConc: "تركيز الكاثود (M)",
            voltage: "الجهد المطبق (V)",
            time: "الوقت (ث)",
            kclConc: "تركيز KCl (M)",
            conductivity: "التوصيلية (S/m)",
            distance: "المسافة (cm)",
            impurityConc: "الشوائب (؟)",
            NaClConc: "تركيز NaCl (M)",
            temperature: "درجة الحرارة (K)"
      };

      return (
            <Box sx={{ padding: 4, direction: "rtl", marginTop: "20px" }}>
                  <Typography
                        variant="h4"
                        sx={{ fontWeight: "bold", textAlign: "center", color: "white" }}
                  >
                        ⚡ حساب الجهد الكهربائي للخلايا الجلفانية والتحليل الكهربائي
                  </Typography>

                  <Grid container spacing={3}>
                        {/* Select Experiment */}
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

                        {/* Input Parameters */}
                        <Grid item xs={12} md={6}>
                              <Card sx={{ padding: 3, boxShadow: 3, backgroundColor: "#f9f9f9" }}>
                                    <Typography variant="h6">إدخال القيم</Typography>
                                    {selectedExp.inputs.map((field) => (
                                          <TextField
                                                fullWidth
                                                key={field}
                                                type="number"
                                                sx={{ marginTop: 2 }}
                                                label={fieldLabels[field] || field}
                                                value={inputs[field]}
                                                onChange={(e) => handleInputChange(field, e.target.value)}
                                          />
                                    ))}
                              </Card>
                        </Grid>
                  </Grid>

                  {/* Calculate Results Button */}
                  <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={calculateResults}
                        sx={{ fontSize: "18px", padding: "12px", marginTop: 3 }}
                  >
                        احسب النتائج 🔢
                  </Button>

                  {/* Show Results Cards */}
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

                  {/* Graph */}
                  {showGraph && graphData.datasets.length > 0 && (
                        <Card sx={{ padding: 3, marginTop: 3, boxShadow: 3, width: "100%" }}>
                              <Box sx={{ width: "100%", height: "500px" }}>
                                    <Line data={graphData} options={chartOptions} />
                              </Box>
                        </Card>
                  )}

                  {/* Error Message Dialog */}
                  <Dialog open={!!errorMessage} TransitionComponent={Fade} onClose={closeErrorPopup}>
                        <Backdrop
                              open={!!errorMessage}
                              sx={{ zIndex: -1 }}
                              onClick={closeErrorPopup}
                        />
                        <DialogTitle sx={{ color: "red", textAlign: "center" }}>⚠ خطأ</DialogTitle>
                        <DialogContent sx={{ textAlign: "center" }}>
                              {errorMessage}
                        </DialogContent>
                  </Dialog>
            </Box>
      );
};

export default GalvanicCalculator;
