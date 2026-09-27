import { useEffect, useRef } from "react";
import { Chart, BarElement, BarController, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

Chart.register(BarElement, BarController, CategoryScale, LinearScale, Tooltip, Legend);

function GraficoMovimentacao({ dados }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!dados || dados.length === 0) return;

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
            backgroundColor: "#094D92",
            borderRadius: 3,
            barPercentage: 0.7,
            categoryPercentage: 0.8,
          },
          {
            label: "Saídas",
            data: dados.map((d) => d.saidas),
            backgroundColor: "#96031A",
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
  }, [dados]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", minHeight: 300 }}>
      <canvas ref={canvasRef} />
    </div>
  );
}

export default GraficoMovimentacao;