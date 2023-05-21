import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { DataService } from '../data.service';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css']
})
export class BarComponent implements OnInit {
  w = 800;
  h = 600;
  data: any;
  constructor(private dataService: DataService) { }
  ngOnInit() {
    this.getDataFromAPI()
      .then(() => this.draw())
      .catch(error => console.error('Error:', error));
  }
  draw(): Promise<any> {
    return new Promise<void>((resolve, reject) => {
      this.drawChart();
      resolve(); // Opcionalmente, puedes pasar algún valor a resolve()
    });
  }
  private drawChart(): void {
    // Datos de ejemplo

    const data1 = this.data.data;
    // Configuración del gráfico
    const margin = { top: 60, right: 20, bottom: 60, left: 80 };
    const width = this.w - margin.left - margin.right;
    const height = this.h - margin.top - margin.bottom;

    // Escala para el eje x
    const x = d3.scaleBand()
      .range([0, width])
      .padding(0.1);

    // Escala para el eje y
    const y = d3.scaleLinear()
      .range([height, 0]);


    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    // Crear el contenedor del gráfico
    const svg = d3.select('#chart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const chartTitle = svg.append('text')
      .attr('class', 'chart-title')
      .style('font-family', 'Arial')
      .style('font-size', '32px')
      .attr('id', 'title')
      .attr('x', width / 2)
      .attr('y', - margin.top / 2)
      .style('text-anchor', 'middle')
      .text('United States GDP');

    // Asignar los datos al eje x y y

    x.domain(data1.map(d => d[0]));
    y.domain([0, d3.max(data1, d => d[1] * 1)]);
    // Crear las barras del gráfico
    svg.selectAll('.bar')
      .data(data1)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('data-date', (d) => d[0])
      .attr('data-gdp', (d) => d[1])
      .attr('x', d => x(d[0]))
      .attr('width', x.bandwidth())
      .attr('y', d => y(d[1]))
      .attr('height', d => height - y(d[1]))
      .style('fill', '#2196F3')
      .on('mouseover', (event, d) => {
        // Mostrar el tooltip al pasar el ratón sobre una barra
        d3.select('#tooltip')
          .attr('data-date', d[0])
          .attr('data-gdp', d[1])
          .style('display', 'block')
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px')
          .text(`${d[0]}: ${d[1]} billion`);
      })
      .on('mouseout', () => {
        // Ocultar el tooltip al salir del área de la barra
        d3.select('#tooltip')
          .style('display', 'none');
      });

    // Crear el eje x
    const minDate = new Date(d3.min(data1, d => d[0]));
    const maxDate = new Date(d3.max(data1, d => d[0]));

    const xScale = d3.scaleTime()
      .domain([minDate, maxDate]) // Reemplaza minDate y maxDate con tus fechas mínima y máxima
      .range([0, width]);

    const xAxis = d3.axisBottom(xScale)
      .tickFormat(d3.timeFormat('%Y'))
      .tickValues(d3.timeYear.range(minDate, maxDate, 5)); // Mostrar una etiqueta por año

    const xAxisTitle = svg.append('text')
      .attr('id', 'x-axis-title')
      .style('font-family', 'Arial')
      .style('font-size', '16px')
      .attr('x', width / 2)
      .attr('y', height + 40)
      .style('text-anchor', 'middle')
      .style('font-size', '18px')
      .text('Years & quarters');

    svg.append('g')
      .attr('id', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis);

    const yAxisTitle = svg.append('text')
      .attr('id', 'y-axis-title')
      .style('font-family', 'Arial')
      .style('font-size', '16px')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -margin.left + 30)
      .style('text-anchor', 'middle')
      .style('font-size', '18px')
      .text('Gross Domestic Product');

    // Crear el eje y
    svg.append('g')
      .attr('id', 'y-axis')
      .call(d3.axisLeft(y));
  }
  getDataFromAPI(): Promise<any> {
    return new Promise<void>(async (resolve, reject) => {
      this.data = await this.dataService.getData().toPromise();
      resolve(); // Opcionalmente, puedes pasar algún valor a resolve()
    });
  }
}
