import { Routes } from '@angular/router';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { OfertasComponent } from './paginas/ofertas/ofertas.component';
import { ProductosComponent } from './paginas/productos/productos.component';
import { CarritoComponent } from './paginas/carrito/carrito.component';
import { CompraComponent } from './paginas/compra/compra.component';
import { FavoritosComponent } from './paginas/favoritos/favoritos.component';
import { InicioSesionComponent } from './auth/inicio-sesion/inicio-sesion.component';
import { RegistroComponent } from './auth/registro/registro.component';
import { AdminComponent } from './paginas/admin/admin.component';
import { NuestraempresaComponent } from './paginas/nuestraempresa/nuestraempresa.component';
import { NovedadesComponent } from './paginas/novedades/novedades.component';
import { BotonarrepentimientoComponent } from './shared/footer/botonarrepentimiento/botonarrepentimiento.component';
import { ReactiveFormsModule } from '@angular/forms';

export const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent },
  { path: 'ofertas', component: OfertasComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'compra', component: CompraComponent },
  { path: 'favorito', component: FavoritosComponent },
  { path: 'nuestraempresa', component: NuestraempresaComponent },
  { path: 'iniciosesion', component: InicioSesionComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'novedades', component: NovedadesComponent },
  {path:'botondearrepentimiento',component:BotonarrepentimientoComponent}


];
