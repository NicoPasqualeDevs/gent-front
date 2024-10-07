/*
    concatArrays
    esta función recibe como argumento un arreglo que contiene arreglos de 
    cualquier tipo de datos (original_array). Luego retorna un arreglo que
    contiene todos los valores de todos los arreglos.  
*/

export const concatArrays = <T>(original_array: T[][]): T[] => {
  const result: T[] = [];
  for (let i = 0; i < original_array.length; i++) {
    for (let j = 0; j < original_array[i].length; j++) {
      result.push(original_array[i][j]);
    }
  }
  return result;
};

export default concatArrays;
