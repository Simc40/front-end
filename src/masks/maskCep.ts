export const maskCep = (value: string) => {
    return value
      .replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
      .replace(/(\d{5})(\d)/, '$1-$2') // captura 2 grupos de numero o primeiro de 5 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
      .replace(/(\d{5})(\d{1,3})/, '$1-$2')
      .replace(/(-\d{3})\d+$/, '$1') // captura 3 numeros seguidos de um traço e não deixa ser digitado mais nada
  }