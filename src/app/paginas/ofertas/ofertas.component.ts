import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../servicio/product.service';

@Component({
  selector: 'app-ofertas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ofertas.component.html',
  styleUrls: ['./ofertas.component.css']
})
export class OfertasComponent implements OnInit {

  ofertas: any[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.cargarOfertas();
  }

  cargarOfertas() {
    this.productService.getOfertas().subscribe((productos: any[]) => {
      // FILTRAR SOLO LOS QUE TIENEN CATEGORIA = "ofertas"
      this.ofertas = productos.filter(p => p.categoria === 'ofertas');
    });
  }
  
}
