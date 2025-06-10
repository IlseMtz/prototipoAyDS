import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
declare const Swal: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  usuarios = [
    { nombre: 'Encargado1', clave: '1234', rol: 'encargado' },
    { nombre: 'Asesor1', clave: '5678', rol: 'asesor' }
  ];

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      nombre: ['', Validators.required],
      clave: ['', Validators.required],
      rol: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor completa todos los campos correctamente.'
      });
      return;
    }

    const { nombre, clave, rol } = this.loginForm.value;
    const usuario = this.usuarios.find(u => u.nombre === nombre && u.clave === clave && u.rol === rol);

    if (usuario) {
      localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
      Swal.fire({
        icon: 'success',
        title: '¡Login exitoso!',
        text: `Bienvenido ${usuario.nombre}`,
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        if (rol === 'encargado') {
          this.router.navigate(['/registrar-entradas']);
        } else if (rol === 'asesor') {
          this.router.navigate(['/modulo-ventas']);
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error de autenticación',
        text: 'Usuario, clave o rol incorrectos.'
      });
    }
  }
}
