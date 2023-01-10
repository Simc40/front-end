export const maskCnh = (value: string) => {
    return value
      .replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
      .replace(/(\d{11})\d+$/, '$1') // captura 11 numeros seguidos e não deixa ser digitado mais nada
  }