<template>
    <div class="graph">
      <canvas ref="myChart"></canvas>
    </div>
  </template>
  
  <script>
  import Chart from 'chart.js/auto';
  import axios from 'axios';
  import { API_BASE_URL } from '@/config/configure';
  
  export default {
    data() {
      return {
        orderedItems: [],
        chart: null
      };
    },
    mounted() {
      this.fetchData();
    },
    methods: {
      async fetchData() {
        try {
          const response = await axios.get(`${API_BASE_URL}/orderedItems`);
          this.orderedItems = response.data;
          this.renderChart();
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      },
  
      renderChart() {
        const ctx = this.$refs.myChart.getContext('2d');
        if (this.chart) {
          this.chart.destroy(); // Destroy the previous chart instance
        }
  
        // Aggregate quantities for items with the same model
        const aggregatedData = this.aggregateData();
  
        this.chart = new Chart(ctx, {
          type: 'pie',
          data: {
            datasets: [{
              data: aggregatedData.map(item => item.value),
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9933'
              ]
            }],
            labels: aggregatedData.map(item => item.label),
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                callbacks: {
                  label: (context) => {
                    let label = context.label || '';
                    if (label) {
                      label += ': ';
                    }
                    const value = context.raw || 0;
                    const percent = ((value / context.dataset.data.reduce((a, b) => a + b, 0)) * 100).toFixed(2);
                    return label + percent + '%';
                  }
                }
              }
            }
          }
        });
      },
  
      aggregateData() {
        const aggregatedData = [];
        const map = new Map();
  
        // Aggregate quantities for items with the same model
        this.orderedItems.forEach(item => {
          const model = item.product?.model;
          const quantity = item.quantity;
  
          if (map.has(model)) {
            const index = map.get(model);
            aggregatedData[index].value += quantity;
          } else {
            map.set(model, aggregatedData.length);
            aggregatedData.push({
              label: model,
              value: quantity
            });
          }
        });
  
        return aggregatedData;
      }
    }
  };
  </script>
  
  <style scoped>

  </style>
  