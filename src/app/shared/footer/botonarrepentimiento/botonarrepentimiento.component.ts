import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-botonarrepentimiento',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './botonarrepentimiento.component.html',
  styleUrl: './botonarrepentimiento.component.css'
})
export class BotonarrepentimientoComponent {

  nombre = '';
  email = '';
  numeroCompra = '';
  enviado = false;

  // errores
  errorNombre = false;
  errorEmail = false;
  errorNumero = false;

  enviarFormulario(event: Event) {
    event.preventDefault(); // evita recargar la página
    this.enviado = false;

    // resetear errores
    this.errorNombre = false;
    this.errorEmail = false;
    this.errorNumero = false;

    // validar uno por uno
    if (this.nombre.trim() === '') {
      this.errorNombre = true;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
    if (!emailValido) {
      this.errorEmail = true;
    }

    if (this.numeroCompra.trim() === '') {
      this.errorNumero = true;
    }

    // si hay errores => no enviar
    if (this.errorNombre || this.errorEmail || this.errorNumero) {
      return;
    }

    // si todo está OK
    this.enviado = true;
    console.log("Formulario enviado", this.nombre, this.email, this.numeroCompra);
  }
}
