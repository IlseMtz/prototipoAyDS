import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductsDataService } from '../../products-data.service';
import { firstValueFrom } from 'rxjs';

declare const Swal: any;

@Component({
  selector: 'app-registrar-entradas',
  standalone: true,
  imports: [CommonModule,RouterModule,ReactiveFormsModule],
  templateUrl: './registrar-entradas.component.html',
  styleUrl: './registrar-entradas.component.css'
})
export class RegistrarEntradasComponent implements OnInit{
entradaForm: FormGroup;

  constructor(private products: ProductsDataService, private fb: FormBuilder) {
    this.entradaForm = this.fb.group({
      nombre: ['', Validators.required],
      codigo: ['', Validators.required],
      cantidad: [null, [Validators.required, Validators.min(1)]],
      precio: [null, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    
  }

  async registrarEntrada() {
    if (this.entradaForm.valid) {
      const entrada = this.entradaForm.value;

      // Mostrar alerta de confirmación antes de registrar
      const confirmacion = await Swal.fire({
        title: '¿Confirmar registro?',
        html: `
          <p><strong>Nombre:</strong> ${entrada.nombre}</p>
          <p><strong>Código:</strong> ${entrada.codigo}</p>
          <p><strong>Cantidad:</strong> ${entrada.cantidad}</p>
          <p><strong>Precio:</strong> ${entrada.precio}</p>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, registrar',
        cancelButtonText: 'Cancelar'
      });

      if (confirmacion.isConfirmed) {
        // Obtener todos los productos
        const productos = await firstValueFrom(this.products.getProducts());

        // Buscar producto existente con mismo código, nombre y precio
        const productoExistente = productos.find(p =>
          p.codigo === entrada.codigo &&
          p.nombre === entrada.nombre &&
          p.precio === entrada.precio
        );

        if (productoExistente && productoExistente.id) {
          // Si existe, actualiza la cantidad
          const nuevaCantidad = productoExistente.cantidad + entrada.cantidad;
          await this.products.actualizarCantidad(productoExistente.id, nuevaCantidad);

          Swal.fire({
            icon: 'success',
            title: 'Producto actualizado',
            text: `La cantidad del producto "${entrada.nombre}" ha sido aumentada a ${nuevaCantidad}.`,
          });
        } else if (!productoExistente) {
          // Si no existe, lo agrega como nuevo
          const response = await this.products.addProducto(entrada);
          console.log('Producto agregado:', response);

          Swal.fire({
            icon: 'success',
            title: 'Producto registrado',
            text: `Nombre: ${entrada.nombre}, Código: ${entrada.codigo}, Cantidad: ${entrada.cantidad}`,
          });
        } else {
          // Producto encontrado pero sin ID (caso muy raro)
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar',
            text: 'No se pudo obtener el ID del producto existente.',
          });
        }

        this.entradaForm.reset();
      } else {
        // Si el usuario cancela
        Swal.fire({
          icon: 'info',
          title: 'Registro cancelado',
          text: 'No se realizó ninguna acción.',
        });
      }
    } else {
      this.entradaForm.markAllAsTouched();

      Swal.fire({
        icon: 'error',
        title: 'Formulario inválido',
        text: 'Por favor completa todos los campos correctamente.',
      });
    }
  }

}
