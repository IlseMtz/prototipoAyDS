import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductsDataService } from '../../products-data.service';
import html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';

declare const Swal: any;

@Component({
  selector: 'app-modulo-reportes',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './modulo-reportes.component.html',
  styleUrl: './modulo-reportes.component.css'
})
export class ModuloReportesComponent implements OnInit {
  fechaInicio!: string;
  fechaFin!: string;
  ventas: any[] = [];
  productos: any[] = [];

  @ViewChild('reportePDF', { static: false }) reportePDF!: ElementRef;

  constructor(private productsDataService: ProductsDataService) {}

  ngOnInit() {
    this.productsDataService.getProducts().subscribe(productos => {
      this.productos = productos;
      this.alertaStock();
    });
  }

  async generarReporte() {
    if (!this.fechaInicio || !this.fechaFin) {
      Swal.fire('Error', 'Selecciona ambas fechas.', 'warning');
      return;
    }

    const inicio = new Date(this.fechaInicio);
    const fin = new Date(this.fechaFin);

    // Ajustar fin para incluir todo el día completo
    const finAjustada = new Date(fin);
    finAjustada.setHours(23, 59, 59, 999);

    try {
      const ventas = await this.productsDataService.getVentasPorFecha(inicio, finAjustada);
      this.ventas = ventas;

      if (ventas.length === 0) {
        Swal.fire('Sin datos', 'No hay ventas en este periodo.', 'info');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Error al generar reporte.', 'error');
    }
  }

  editarVenta(venta: any) {
    Swal.fire({
      title: 'Editar venta',
      html: `
        <input id="cantidad" type="number" value="${venta.cantidadVendida}" class="swal2-input" placeholder="Cantidad">
        <input id="precio" type="number" value="${venta.precioUnitario}" class="swal2-input" placeholder="Precio unitario">
      `,
      focusConfirm: false,
      preConfirm: () => {
        return {
          cantidadVendida: parseInt((document.getElementById('cantidad') as HTMLInputElement).value),
          precioUnitario: parseFloat((document.getElementById('precio') as HTMLInputElement).value)
        };
      }
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const nuevosDatos = result.value;
        const total = nuevosDatos.cantidadVendida * nuevosDatos.precioUnitario;
        // Actualizar Firestore
        await this.productsDataService.actualizarVenta(venta.id, {
          cantidadVendida: nuevosDatos.cantidadVendida,
          precioUnitario: nuevosDatos.precioUnitario,
          total
        });
        this.generarReporte();
        Swal.fire('Actualizado', 'Venta actualizada con éxito.', 'success');
      }
    });
  }

  async eliminarVenta(id: string) {
    try {
      await this.productsDataService.eliminarVenta(id);
      this.ventas = this.ventas.filter(v => v.id !== id);
      Swal.fire('Eliminado', 'Venta eliminada.', 'success');
    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar.', 'error');
    }
  }

  alertaStock() {
    const bajo = this.productos.filter(p => p.cantidad <= 5);
    const alto = this.productos.filter(p => p.cantidad >= 100);

    if (bajo.length > 0) {
      Swal.fire('Stock Bajo', 'Productos con bajo stock:\n' + bajo.map(p => `${p.nombre} (${p.cantidad})`).join('\n'), 'warning');
    }
    if (alto.length > 0) {
      Swal.fire('Stock Alto', 'Productos con alto stock:\n' + alto.map(p => `${p.nombre} (${p.cantidad})`).join('\n'), 'info');
    }
  }

  exportarPDF() {
    const opciones = {
      margin: 0.5,
      filename: 'reporte_ventas.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    html2pdf().from(this.reportePDF.nativeElement).set(opciones).save();
  }

  exportarExcel() {
    const worksheet = XLSX.utils.json_to_sheet(this.ventas);
    const workbook = { Sheets: { 'ReporteVentas': worksheet }, SheetNames: ['ReporteVentas'] };
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'reporte_ventas.xlsx';
    link.click();
  }
}

