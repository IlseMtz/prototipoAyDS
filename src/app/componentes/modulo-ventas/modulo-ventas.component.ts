import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Productos from '../../Productos.interface';
import { ProductsDataService } from '../../products-data.service';
import { ElementRef, ViewChild } from '@angular/core';
import html2pdf from 'html2pdf.js';

declare const Swal: any;

@Component({
  selector: 'app-modulo-ventas',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './modulo-ventas.component.html',
  styleUrl: './modulo-ventas.component.css'
})
export class ModuloVentasComponent implements OnInit{
  producto: Productos[] = [];
  productosFiltrados: Productos[] = [];
  
  filtroCodigo: string = '';
  filtroNombre: string = '';

  productoSeleccionado: Productos | null = null;
  cantidadAVender: number = 1;
  comprobanteVenta: any = null;
  
  constructor(private products: ProductsDataService){}
  
  ngOnInit(): void {
     this.products.getProducts().subscribe(productos => {
      this.producto = productos;
      this.productosFiltrados = [...productos]; // Copia inicial
    });
  }
  
  filtrar(): void {
    console.log('Filtrar ejecutado');
    this.productosFiltrados = this.producto.filter(p =>
      (this.filtroCodigo ? p.codigo.toString().includes(this.filtroCodigo) : true) &&
      (this.filtroNombre ? p.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase()) : true)
    );
    if (this.productosFiltrados.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Producto no encontrado',
        text: 'No se encontró ningún producto con los datos ingresados.',
        confirmButtonColor: '#567c8d'
      });
    }
  }
  
  limpiarFiltros(): void {
    this.filtroCodigo = '';
    this.filtroNombre = '';
    this.productosFiltrados = [...this.producto];
  }

  seleccionarProducto(producto: Productos) {
    this.productoSeleccionado = producto;
    this.cantidadAVender = 1;
  }

  cancelarVenta() {
    this.productoSeleccionado = null;
  }

  async registrarVenta() {
    if (!this.productoSeleccionado) return;

    const producto = this.productoSeleccionado;

    if (this.cantidadAVender <= 0) {
      Swal.fire('Cantidad inválida', 'La cantidad debe ser mayor a cero.', 'error');
      return;
    }

    if (this.cantidadAVender > producto.cantidad) {
      Swal.fire('Stock insuficiente', 'No hay suficiente inventario para esta venta.', 'warning');
      return;
    }

    try {
      const fecha = new Date();
      const total = producto.precio * this.cantidadAVender;

      const venta = {
        productoId: producto.id,
        nombre: producto.nombre,
        cantidadVendida: this.cantidadAVender,
        precioUnitario: producto.precio,
        total,
        fecha: fecha.toISOString()
      };

      // Registrar salida
      await this.products.addSalida(venta);

      // Actualizar cantidad
      const nuevaCantidad = producto.cantidad - this.cantidadAVender;
      await this.products.actualizarCantidad(producto.id!, nuevaCantidad);

      // Refrescar productos
      this.products.getProducts().subscribe(productos => {
        this.producto = productos;
        this.productosFiltrados = [...productos];
      });
      this.comprobanteVenta = venta;
      Swal.fire('Venta registrada', 'La venta se ha realizado correctamente.', 'success');
      this.productoSeleccionado = null;

    } catch (error) {
      console.error('Error al registrar venta:', error);
      Swal.fire('Error', 'Ocurrió un error al registrar la venta.', 'error');
    }
  }
  @ViewChild('comprobantePDF') comprobanteRef!: ElementRef;

  descargarPDF() {
    const options = {
      margin: 0.5,
      filename: `comprobante_venta_${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(this.comprobanteRef.nativeElement).set(options).save();
  }
}


