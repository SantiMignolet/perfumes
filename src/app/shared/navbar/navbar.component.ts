import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { CarritoService } from '../../servicio/carrito.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../servicio/auth.service';

@Component({
selector: 'app-navbar',
standalone: true,
imports: [RouterLink, CommonModule, RouterModule],
templateUrl: './navbar.component.html',
styleUrls: ['./navbar.component.css'] // CORRECCIÓN: era styleUrl -> styleUrls
})
export class NavbarComponent implements OnInit {
cantidadProductos: number = 0;
isLogged: boolean = false;
rolUsuario: string | null = null;

constructor(
private carritoService: CarritoService,
private authService: AuthService
) {}

ngOnInit(): void {
// Saber si está logueado
this.isLogged = this.authService.isLoggedIn();


// Obtener usuario y rol
const usuario = this.authService.getUsuario();
this.rolUsuario = usuario?.rol ?? null;

// Actualizar cuando se loguea
this.authService.loginEvent.subscribe(() => {
  this.isLogged = this.authService.isLoggedIn();
  const user = this.authService.getUsuario();
  this.rolUsuario = user?.rol ?? null;
});

// Suscripción al carrito
this.carritoService.carrito$.subscribe({
  next: (productos) => {
    this.cantidadProductos = productos.reduce(
      (total, item) => total + item.cantidad,
      0
    );
  },
  error: (err) => {
    console.error('Error al obtener el carrito', err);
    this.cantidadProductos = 0;
  }
});

}

onCarritoClick() {
console.log('Carrito clicked');
}

// 🔥 CERRAR SESIÓN
logout() {
this.authService.logout();
this.isLogged = false;
this.rolUsuario = null;
window.location.reload();
}
}
