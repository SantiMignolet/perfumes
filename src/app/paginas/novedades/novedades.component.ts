import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../servicio/product.service';

@Component({
  selector: 'app-novedades',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './novedades.component.html',
  styleUrls: ['./novedades.component.css']
})
export class NovedadesComponent implements OnInit {

  novedades: any[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.cargarNovedades();
  }

  cargarNovedades() {
    this.productService.getNovedades().subscribe((productos: any[]) => {
   
      this.novedades = productos.filter(p => p.categoria === 'novedades');
    });
  }
  agregarAlCarrito(producto: any) {
    console.log('Agregar al carrito', producto);
  }

  agregarAFavoritos(producto: any) {
    console.log('Agregar a favoritos', producto);
  }
}

  

