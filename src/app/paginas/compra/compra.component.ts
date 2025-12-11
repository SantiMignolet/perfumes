import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../servicio/carrito.service';
import { CompraService } from '../../servicio/compra.service';

@Component({
  selector: 'app-compra',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.css']
})
export class CompraComponent implements OnInit {

  // Lista de productos presentes en el carrito al momento de finalizar la compra.
  productos: any[] = [];

  // Datos adicionales que el usuario debe completar (pueden usarse más adelante en el futuro).
  datos = { direccion: '', telefono: '' };

  // Valores monetarios usados durante el resumen de compra.
  subtotal = 0;
  envio = 1000; // Costo fijo de envío.
  total = 0;

  // Mensajes informativos para el usuario (éxito o error).
  mensaje = '';

  // Indica si se está procesando la compra para evitar doble envío.
  cargando = false;

  constructor(
    // Servicio que administra los datos del carrito (observable reactivo carrito$).
    private carritoService: CarritoService,

    // Servicio encargado de comunicarse con el backend para registrar la compra.
    private CompraService: CompraService,

    // Router para navegar hacia el ticket luego de realizar la compra.
    private router: Router
  ) { }

  // Se ejecuta al iniciar el componente.
  ngOnInit(): void {

    // Se suscribe al carrito en tiempo real:
    // si se modifica el carrito en cualquier parte de la app,
    // este componente vuelve a calcular los totales.
    this.carritoService.carrito$.subscribe(items => {
      this.productos = items;
      this.calcularTotales();
    });
  }

  // Calcula subtotal, envío y total final.
  calcularTotales() {

    // Toma cada producto y multiplica precio_unitario * cantidad.
    this.subtotal = this.productos.reduce((acc, p) => {
      const precio = Number(p.precio_unitario) || 0;
      const cantidad = Number(p.cantidad) || 1;
      return acc + (precio * cantidad);
    }, 0);

    // Total = subtotal + costo de envío.
    this.total = Number(this.subtotal) + Number(this.envio);
  }

  // Ejecuta la operación principal: finalizar la compra.
  finalizarCompra() {

    // Verifica que haya productos en el carrito.
    if (this.productos.length === 0) {
      this.mensaje = 'El carrito está vacío';
      return;
    }

    // Datos adicionales del comprador (se envían al backend si se usan).
    const data = {
      direccion: this.datos.direccion,
      telefono: this.datos.telefono
    };

    // Marca estado de carga para bloquear UI si fuera necesario.
    this.cargando = true;

    // Llama al backend para crear la compra, generar ticket y vaciar el carrito.
    this.CompraService.finalizarCompra(data).subscribe({
      next: res => {

        // Mensaje informativo.
        this.mensaje = 'Compra realizada con éxito';

        // Vaciar carrito localmente y en backend.
        this.carritoService.vaciarCarrito().subscribe();

        // Navegar al ticket luego de 1 segundo (simula efecto visual).
        setTimeout(() => {
          this.router.navigate(['/ticket', res.id_compra]);
        }, 1000);
      },

      // Si hubo error en el proceso:
      error: err => {
        console.error(err);
        this.mensaje = 'Error al procesar compra.';
        this.cargando = false;
      }
    });
  }
}