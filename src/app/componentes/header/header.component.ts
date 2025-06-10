import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,NgIf,RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  rolUsuario: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    const usuario = localStorage.getItem('usuarioLogueado');
    if (usuario) {
      const usuarioParseado = JSON.parse(usuario);
      this.rolUsuario = usuarioParseado.rol;
    }
  }

  cerrarSesion() {
    localStorage.removeItem('usuarioLogueado');
    this.router.navigate(['/login']).then(() => {
      window.location.reload(); // Esto forza recarga y oculta el header
    });
  }
}
