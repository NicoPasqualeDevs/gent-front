/*
    chuckArray 
    esta funcion devuelve un arrelgo de arreglos de elementos de una cantidad
    determinada (chuck_value), basado en el contenido de un arreglo pasado por
    parametros (original_array).

    uso principal en las vista donde se utiliza <Paginacion/>, para dividir las listas
    de datos, en porciones a mostrar en las diferentes secciones.

*/

export const chuckArray = <T>(original_array: T[], chuck_value = 5): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < original_array.length; i += chuck_value) {
    result.push(original_array.slice(i, i + 5));
  }
  return result;
};

export default chuckArray;
