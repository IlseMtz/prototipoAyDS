import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Productos from '../../Productos.interface';
import { ProductsDataService } from '../../products-data.service';

declare const Swal: any;

@Component({
  selector: 'app-eliminar-editar',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './eliminar-editar.component.html',
  styleUrl: './eliminar-editar.component.css'
})
export class EliminarEditarComponent implements OnInit{
  producto: Productos[] = [];
  productosFiltrados: Productos[] = [];

  filtroCodigo: string = '';
  filtroNombre: string = '';

  productoSeleccionado: Productos | null = null;
  cantidadAEliminar: number = 1;
  reporteVentas: any = null;

  constructor(private products: ProductsDataService){

  }

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
      this.cantidadAEliminar = 1;
  }

  eliminar() {
    if (!this.productoSeleccionado) return;

    const producto = this.productoSeleccionado;

    if (this.cantidadAEliminar <= 0) {
      Swal.fire('Error', 'La cantidad a eliminar debe ser mayor a 0.', 'error');
      return;
    }

    if (this.cantidadAEliminar > producto.cantidad) {
      Swal.fire('Error', 'No puedes eliminar más de lo que hay en stock.', 'error');
      return;
    }

    const nuevaCantidad = producto.cantidad - this.cantidadAEliminar;

    if (nuevaCantidad === 0) {
      // Si la cantidad llega a 0, preguntar si desea eliminar el producto completamente
      Swal.fire({
        title: 'Eliminar producto',
        text: 'La cantidad será 0. ¿Desea eliminar este producto del inventario?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#567c8d',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result: any) => {
        if (result.isConfirmed) {
          this.products.eliminarProducto(producto.id!).then(() => {
            Swal.fire('Eliminado', 'Producto eliminado completamente.', 'success');
            this.productoSeleccionado = null;
          });
        }
      });
    } else {
      // Solo actualizar cantidad
      this.products.actualizarCantidad(producto.id!, nuevaCantidad).then(() => {
        Swal.fire('Actualizado', 'La cantidad del producto ha sido actualizada.', 'success');
        this.productoSeleccionado = null;

        // Alerta de stock bajo o alto
        if (nuevaCantidad <= 5) {
          Swal.fire('Alerta de Stock Bajo', `El producto "${producto.nombre}" tiene poco stock (${nuevaCantidad}).`, 'warning');
        } else if (nuevaCantidad >= 100) {
          Swal.fire('Alerta de Stock Alto', `El producto "${producto.nombre}" tiene stock alto (${nuevaCantidad}).`, 'info');
        }
      });
    }
  }

  cancelar() {
    this.productoSeleccionado = null;
    this.cantidadAEliminar = 1;
  }
}
