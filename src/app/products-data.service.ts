import { Injectable } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import Productos from './Productos.interface';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductsDataService {

  constructor(private firestore: Firestore) { }

  addProducto(producto: Productos){
    const productoRef = collection(this.firestore, 'productos');
    return addDoc(productoRef, producto);
  }

  addSalida(salida: any) {
    const salidaRef = collection(this.firestore, 'salidas');
    return addDoc(salidaRef, salida);
  }

   async getProductoPorCodigo(codigo: string) {
    const productosRef = collection(this.firestore, 'productos');
    const q = query(productosRef, where('codigo', '==', codigo));
    const result = await getDocs(q);
    return result.empty ? null : result.docs[0];
  }

  async actualizarCantidad(id: string, cantidad: number) {
    return updateDoc(doc(this.firestore, 'productos', id), { cantidad });
  }

  getProducts():Observable<Productos[]>{
    const productoRef = collection(this.firestore,'productos');
    return collectionData(productoRef,{idField:'id'}) as Observable<Productos[]>;
  }

  eliminarProducto(id: string) {
    const productoDocRef = doc(this.firestore, 'productos', id);
    return deleteDoc(productoDocRef);
  }

  // Editar ventas
  async actualizarVenta(id: string, datos: any) {
    return updateDoc(doc(this.firestore, 'salidas', id), datos);
  }

  // Eliminar ventas
  eliminarVenta(id: string) {
    return deleteDoc(doc(this.firestore, 'salidas', id));
  }

  async getVentasPorFecha(inicio: Date, fin: Date): Promise<any[]> {
    const ventasRef = collection(this.firestore, 'salidas');
    const q = query(ventasRef, 
      where('fecha', '>=', inicio.toISOString()), 
      where('fecha', '<=', fin.toISOString())
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

}
