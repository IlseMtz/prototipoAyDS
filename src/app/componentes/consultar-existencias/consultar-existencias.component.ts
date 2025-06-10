import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductsDataService } from '../../products-data.service';
import Productos from '../../Productos.interface';
declare const Swal: any;

@Component({
  selector: 'app-consultar-existencias',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './consultar-existencias.component.html',
  styleUrl: './consultar-existencias.component.css'
})
export class ConsultarExistenciasComponent implements OnInit {
  
  producto: Productos[] = [];
  productosFiltrados: Productos[] = [];

  filtroCodigo: string = '';
  filtroNombre: string = '';

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
}
