import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductsDataService } from '../../products-data.service';

declare const Swal: any;

@Component({
  selector: 'app-registrar-salidas',
  standalone: true,
  imports: [CommonModule,RouterModule,ReactiveFormsModule],
  templateUrl: './registrar-salidas.component.html',
  styleUrl: './registrar-salidas.component.css'
})
export class RegistrarSalidasComponent implements OnInit{
  salidaForm: FormGroup;

  constructor(private products: ProductsDataService, private fb: FormBuilder){
    this.salidaForm = this.fb.group({
      codigo: ['', Validators.required],
      cantidad: [null, [Validators.required, Validators.min(1)]],
      motivo: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    
  }
  
  async registrarSalida() {
    if (this.salidaForm.invalid) {
      Swal.fire('Error', 'Formulario inválido.', 'error');
      return;
    }

    const { codigo, cantidad, motivo } = this.salidaForm.value;

    // Obtener producto por código desde el servicio
    const productoDoc = await this.products.getProductoPorCodigo(codigo);

    if (!productoDoc) {
      Swal.fire('Error', 'Producto no encontrado.', 'error');
      return;
    }

    const productoData: any = productoDoc.data();

    if (productoData.cantidad < cantidad) {
      Swal.fire('Error', 'Cantidad mayor al stock disponible.', 'error');
      return;
    }

    // Mostrar alerta de confirmación antes de registrar salida
    const confirmacion = await Swal.fire({
      title: '¿Confirmar salida?',
      html: `
        <p><strong>Código:</strong> ${codigo}</p>
        <p><strong>Cantidad:</strong> ${cantidad}</p>
        <p><strong>Motivo:</strong> ${motivo}</p>
        <p><strong>Stock actual:</strong> ${productoData.cantidad}</p>
        <p><strong>Stock después de salida:</strong> ${productoData.cantidad - cantidad}</p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, registrar salida',
      cancelButtonText: 'Cancelar'
    });

    if (confirmacion.isConfirmed) {
      // Actualizar stock usando el servicio
      const nuevaCantidad = productoData.cantidad - cantidad;
      await this.products.actualizarCantidad(productoDoc.id, nuevaCantidad);

      // Guardar movimiento en colección "salidas" usando el servicio
      const salida = {
        codigo,
        cantidad,
        motivo,
        fechaHora: new Date().toISOString()
      };
      await this.products.addSalida(salida);

      Swal.fire('Éxito', 'Salida registrada correctamente.', 'success');
      this.salidaForm.reset();
    } else {
      Swal.fire('Cancelado', 'No se realizó la salida.', 'info');
    }
  }

}
