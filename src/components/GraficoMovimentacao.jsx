// GraficoMovimentacao.jsx
import { useEffect, useRef } from "react";
import { Chart, BarElement, BarController, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

Chart.register(BarElement, BarController, CategoryScale, LinearScale, Tooltip, Legend);

const dados = [
  { material: "Papel Sulfite A4", entradas: 450, saidas: 389 },
  { material: "Toner Impressora Laser", entradas: 290, saidas: 260 },
  { material: "Pincel 80", entradas: 210, saidas: 175 },
  { material: "Caneta Uniball", entradas: 270, saidas: 245 },
  { material: "Cartão Mensal", entradas: 185, saidas: 160 },
  { material: "Fita Adesiva Larga", entradas: 165, saidas: 140 },
  { material: "Gabarito de Material", entradas: 225, saidas: 205 },
  { material: "Grampo 26/6", entradas: 160, saidas: 135 },
  { material: "Cola Bastão", entradas: 145, saidas: 85 },
  { material: "Apontador de Lápis", entradas: 120, saidas: 95 },
];

function GraficoMovimentacao() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext("2d");

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: dados.map((d) => d.material),
        datasets: [
          {
            label: "Entradas",
            data: dados.map((d) => d.entradas),
            backgroundColor: "#e84118",
            borderRadius: 3,
            barPercentage: 0.7,
            categoryPercentage: 0.8,
          },
          {
            label: "Saídas",
            data: dados.map((d) => d.saidas),
            backgroundColor: "#fbc531",
            borderRadius: 3,
            barPercentage: 0.7,
            categoryPercentage: 0.8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            align: "start",
            labels: {
              boxWidth: 12,
              padding: 16,
              font: { size: 12 },
            },
          },
          tooltip: {
            callbacks: {
              title: (items) => items[0].label,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              font: { size: 10 },
              maxRotation: 30,
              minRotation: 15,
            },
          },
          y: {
            beginAtZero: true,
            grid: { color: "#f0f0f0" },
            ticks: { font: { size: 11 } },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", minHeight: 300 }}>
      <canvas ref={canvasRef} />
    </div>
  );
}

export default GraficoMovimentacao;