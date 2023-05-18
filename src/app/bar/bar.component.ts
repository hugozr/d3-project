import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css']
})
export class BarComponent implements OnInit {
  ngOnInit() {
    this.drawChart();
  }

  private drawChart(): void {
    // Datos de ejemplo
    const data = [
      { category: 'A', value: 10 },
      { category: 'B', value: 20 },
      { category: 'C', value: 15 },
      { category: 'D', value: 5 },
      { category: 'E', value: 8 }
    ];

    // Configuración del gráfico
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Escala para el eje x
    const x = d3.scaleBand()
      .range([0, width])
      .padding(0.1);

    // Escala para el eje y
    const y = d3.scaleLinear()
      .range([height, 0]);

    // Crear el contenedor del gráfico
    const svg = d3.select('#chart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Asignar los datos al eje x y y
    x.domain(data.map(d => d.category));
    y.domain([0, d3.max(data, d => d.value)]);

    // Crear las barras del gráfico
    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.category))
      .attr('width', x.bandwidth())
      .attr('y', d => y(d.value))
      .attr('height', d => height - y(d.value));

    // Crear el eje x
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Crear el eje y
    svg.append('g')
      .call(d3.axisLeft(y));
  }
  constructor() { }

}
