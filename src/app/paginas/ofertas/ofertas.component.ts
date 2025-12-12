import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../servicio/product.service';
import { CarritoService } from '../../servicio/carrito.service';
import { FavoritosService } from '../../servicio/favoritos.service'; // <- agregado
import { Producto } from '../../model.ts/producto.model';

@Component({
  selector: 'app-ofertas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ofertas.component.html',
  styleUrls: ['./ofertas.component.css']
})
export class OfertasComponent implements OnInit {

  ofertas: Producto[] = [];

  constructor(
    private productService: ProductService,
    private carritoService: CarritoService,
    private favoritosService: FavoritosService
  ) {}

  ngOnInit(): void {
    this.cargarOfertas();
  }

  cargarOfertas() {
    this.productService.getOfertas().subscribe((productos: any[]) => {
      this.ofertas = productos.filter(p => p.categoria === 'ofertas');
    });
  }

  // --- AGREGAR AL CARRITO ---
  agregarAlCarrito(producto: Producto) {
    this.carritoService.agregarAlCarrito(producto).subscribe({
      next: (resp) => console.log('Agregado al carrito', resp),
      error: (err) => console.error(err)
    });
  }

  // --- AGREGAR A FAVORITOS ---
  agregarAFavoritos(producto: Producto) {
    this.favoritosService.agregarFavorito(producto).subscribe({
      next: () => console.log('Agregado a favoritos'),
      error: (err) => console.error(err)
    });
  }
}
