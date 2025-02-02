import { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Avatar,
  CardActionArea,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Science,
  Bolt,
  Whatshot,
  ElectricalServices,
  Link as LinkIcon,
} from "@mui/icons-material";

import danialCell from "../assets/danial_cell.png";
import aluminiumCopper from "../assets/Aluminium-Copper.jpg";
import ironSilver from "../assets/Iron-Silver.png";
import pencilElectrolysis from "../assets/pencil.png";
import sodiumElectrolysis from "../assets/sodium.jpg";
import saltBridgeKCl from "../assets/salt.png"; // Reuse salt.png or another KCl image

// ✅ Styling
const iconStyle = { color: "#1565c0", minWidth: "40px" };
const listStyle = {
  backgroundColor: "#f8f9fa",
  padding: "10px",
  borderRadius: "8px",
  marginBottom: "10px",
  textAlign: "right",
};

// ✅ Data for Each Experiment (Right to Left)
const cellData = [
  {
    name: "خلية دانيال (Zn-Cu)",
    image: danialCell,
    content: [
      {
        icon: <Science sx={iconStyle} />,
        title: "الجزء النظري",
        details: "⚡ المصعد: الزنك (Zn) - الأكسدة\n✅ المهبط: النحاس (Cu) - الاختزال",
      },
      {
        icon: <ElectricalServices sx={iconStyle} />,
        title: "الإلكتروليتات",
        details:
          "📌 كبريتات الزنك (ZnSO₄)\n📌 كبريتات النحاس (CuSO₄)\n🛑 الجسر الملحي يساعد في التوازن الكهربائي",
      },
      {
        icon: <Bolt sx={iconStyle} />,
        title: "فرق الجهد القياسي",
        details: "🔋 الجهد القياسي = 1.10V",
      },
      {
        icon: <Whatshot sx={iconStyle} />,
        title: "التطبيقات",
        details:
          "✅ تستخدم في البطاريات.\n✅ دراسة التآكل.\n✅ الأساس للخلايا الفولتية الحديثة.",
      },
    ],
  },
  {
    name: "خلية الألمنيوم-النحاس (Al-Cu)",
    image: aluminiumCopper,
    content: [
      {
        icon: <Science sx={iconStyle} />,
        title: "الجزء النظري",
        details: "⚡ المصعد: الألمنيوم (Al)\n⚡ المهبط: النحاس (Cu)",
      },
      {
        icon: <ElectricalServices sx={iconStyle} />,
        title: "الإلكتروليتات",
        details: "📌 نترات الألمنيوم (Al(NO₃)₃)\n📌 كبريتات النحاس (CuSO₄)",
      },
      {
        icon: <Bolt sx={iconStyle} />,
        title: "فرق الجهد القياسي",
        details: "🔋 الجهد القياسي = 2.00V",
      },
      {
        icon: <Whatshot sx={iconStyle} />,
        title: "التطبيقات",
        details: "✅ بطاريات خفيفة الوزن.\n✅ تطبيقات الحماية البحرية.",
      },
    ],
  },
  {
    name: "خلية الحديد-الفضة (Fe-Ag)",
    image: ironSilver,
    content: [
      {
        icon: <Science sx={iconStyle} />,
        title: "الجزء النظري",
        details: "⚡ المصعد: الحديد (Fe)\n⚡ المهبط: الفضة (Ag)",
      },
      {
        icon: <ElectricalServices sx={iconStyle} />,
        title: "الإلكتروليتات",
        details: "📌 كبريتات الحديد (FeSO₄)\n📌 نترات الفضة (AgNO₃)",
      },
      {
        icon: <Bolt sx={iconStyle} />,
        title: "فرق الجهد القياسي",
        details: "🔋 الجهد القياسي = 1.24V",
      },
      {
        icon: <Whatshot sx={iconStyle} />,
        title: "التطبيقات",
        details:
          "✅ تستخدم في البطاريات عالية الكفاءة.\n✅ تستخدم أقطاب الفضة في المستشعرات الطبية.",
      },
    ],
  },
  {
    name: "التحليل الكهربائي باستخدام الرصاص (أقلام الرصاص)",
    image: pencilElectrolysis,
    content: [
      {
        icon: <Science sx={iconStyle} />,
        title: "الجزء النظري",
        details: "⚡ المصعد: الرصاص (Pb) - الأكسدة\n✅ المهبط: الرصاص (Pb) - الاختزال",
      },
      {
        icon: <ElectricalServices sx={iconStyle} />,
        title: "الإلكتروليتات",
        details:
          "📌 الماء (H₂O) مع شوائب أو إلكتروليت إضافي مثل Na₂SO₄ لزيادة التوصيل",
      },
      {
        icon: <Bolt sx={iconStyle} />,
        title: "فرق الجهد القياسي",
        details: "🔋 الجهد القياسي = 1.23V",
      },
      {
        icon: <Whatshot sx={iconStyle} />,
        title: "التطبيقات",
        details:
          "✅ تجربة علمية تحليلية.\n✅ تحليل الماء إلى هيدروجين وأكسجين.\n✅ فهم تآكل الأقطاب.",
      },
    ],
  },
  {
    name: "التحليل الكهربائي لمحلول كلوريد الصوديوم (المحلول الملحي)",
    image: sodiumElectrolysis,
    content: [
      {
        icon: <Science sx={iconStyle} />,
        title: "الجزء النظري",
        details: "⚡ المصعد: الجرافيت أو البلاتين\n✅ المهبط: الفولاذ المقاوم للصدأ أو البلاتين",
      },
      {
        icon: <ElectricalServices sx={iconStyle} />,
        title: "الإلكتروليتات",
        details: "📌 محلول كلوريد الصوديوم (NaCl) المذاب في الماء",
      },
      {
        icon: <Bolt sx={iconStyle} />,
        title: "فرق الجهد القياسي",
        details: "🔋 الجهد القياسي = 2.2V (ولكن عمليًا 2.5-4.0V)",
      },
      {
        icon: <Whatshot sx={iconStyle} />,
        title: "التطبيقات",
        details: "✅ إنتاج الكلور والهيدروجين.\n✅ إنتاج هيدروكسيد الصوديوم (NaOH).",
      },
    ],
  },
  // 🟢 REPLACED the old NaCl salt with KCl
  {
    name: "جسر الملح KCl (إعداد خلية ماسور - Massor Cell Setup)",
    image: saltBridgeKCl, // Reuse salt.png or use any KCl image
    content: [
      {
        icon: <Science sx={iconStyle} />,
        title: "الجزء النظري",
        details:
          `جسر الملح KCl (إعداد خلية ماسور - Massor Cell Setup)
          
  • نصف خليتين: قطبان معدنيان مختلفان في محلولي أيوناتهما.
  • جسر الملح: محلول مشبع من كلوريد البوتاسيوم (KCl) مذاب في هلام (أجار) أو مادة مسامية.
  
  وظيفة جسر الملح KCl:
  • يسمح بتدفق الأيونات للحفاظ على التوازن الكهربائي بين نصفي الخلية.
  • يمنع اختلاط المحلولين بشكل مباشر لكنه يسمح بتعادل الشحنات الكهربائية.
  • KCl مفضل على NaCl في بعض التطبيقات لأنه لا يشارك في التفاعلات الجانبية مع الأقطاب.`
      },
      {
        icon: <ElectricalServices sx={iconStyle} />,
        title: "التفاعلات",
        details:
          `في خلية جلفانية تحتوي على جسر ملح KCl:
  • عند المصعد (الأكسدة):
  • عند المهبط (الاختزال):
  
  دور أيونات K⁺ و Cl⁻:
  • K⁺ يتحرك نحو المهبط (لمعادلة الشحنة السالبة).
  • Cl⁻ يتحرك نحو المصعد (لمعادلة الشحنة الموجبة).`
      },
      {
        icon: <Bolt sx={iconStyle} />,
        title: "خصائص",
        details:
          `• يساعد الجسر الملحي في منع تراكم الشحنات الكهربائية داخل النظام.
  • يضمن استمرارية التفاعل بين نصفي الخلية دون اختلاط مباشر للمحلولين.`
      },
      {
        icon: <Whatshot sx={iconStyle} />,
        title: "التطبيقات",
        details:
          `✅ يستخدم في البطاريات والخلايا الكهروكيميائية.
  ✅ ضروري في القياسات الكهروكيميائية الدقيقة.
  ✅ يُفضل KCl بسبب تقليل التداخل مع أقطاب القياس.`
      }
    ],
  },

];

const GalvanicTheory = () => {
  const [open, setOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);

  const handleOpen = (cell) => {
    setSelectedCell(cell);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCell(null);
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <Box sx={{ textAlign: "center", padding: "20px", direction: "rtl" }}>
        <Typography color="white" variant="h4" sx={{ fontWeight: "bold" }}>
          ⚡ الخلايا الجلفانية - التفسير النظري
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {cellData.map((cell, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <CardActionArea onClick={() => handleOpen(cell)}>
                <Avatar
                  src={cell.image}
                  sx={{ width: "120px", height: "120px", margin: "auto" }}
                />
                <Typography color="white" variant="h6">
                  {cell.name}
                </Typography>
              </CardActionArea>
            </Grid>
          ))}
        </Grid>
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="md"
          fullWidth
          dir="rtl"
        >
          {selectedCell && (
            <>
              <DialogTitle
                sx={{ textAlign: "center", backgroundColor: "#1565c0", color: "white" }}
              >
                {selectedCell.name}
              </DialogTitle>
              <DialogContent>
                {selectedCell.content.map((section, index) => (
                  <List key={index} sx={listStyle}>
                    <ListItemIcon>{section.icon}</ListItemIcon>
                    <ListItemText
                      primary={section.details}
                      sx={{ textAlign: "right" }}
                    />
                  </List>
                ))}
              </DialogContent>
            </>
          )}
        </Dialog>
      </Box>
    </div>
  );
};

export default GalvanicTheory;
