import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CargarScriptService {

  constructor() { }
  cargar(archivos:string[]){

    for(let archivo of archivos){
      let script= document.createElement("script");
      script.src =  "../../../../assets/script/"+archivo+".js";
      let body= document.getElementsByTagName("body")[0];
      console.log("hola");
      body.appendChild(script);
}

}
}
