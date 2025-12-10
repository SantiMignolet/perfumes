import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../servicio/auth.service';

@Component({
  selector: 'app-inicio-sesion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.css']
})
export class InicioSesionComponent {

  // Objeto que almacena las credenciales que el usuario ingresará en el formulario.
  // Se enlaza con ngModel en la plantilla.
  usuario = {
    email: '',
    password: ''
  };

  // Variable para mostrar mensajes de error en la vista.
  error: string = '';

  constructor(
    // Servicio encargado de manejar autenticación y comunicación con el backend.
    private authService: AuthService,

    // Router para redireccionar luego de iniciar sesión.
    private router: Router
  ) {}

  // Método llamado al enviar el formulario de inicio de sesión.
  iniciarSesion(): void {

    // Validación básica: ambos campos deben estar completos.
    if (!this.usuario.email || !this.usuario.password) {
      this.error = 'Por favor ingrese sus credenciales.';
      return;
    }

    // Llama al servicio de autenticación y espera la respuesta del backend.
    this.authService.login(this.usuario).subscribe({

      // Si la petición es exitosa:
      next: (res) => {
        // Limpiamos posibles errores previos.
        this.error = '';

        // Aviso rápido para el usuario (puede reemplazarse por un toast).
        alert('Inicio de sesión exitoso');

        // Redirige a la página de productos.
        this.router.navigate(['/productos']);
      },

      // Si ocurre un error (credenciales incorrectas o fallo del servidor):
      error: (err) => {
        console.error('Error al iniciar sesión', err);

        // Mensaje destinado a mostrarse en la interfaz.
        this.error = 'Credenciales incorrectas o error en el servidor.';
      }
    });
  }
}

