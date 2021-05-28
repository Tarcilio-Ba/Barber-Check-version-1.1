
export const cpfMask = value => {
  return value
    .replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
    .replace(/(\d{3})(\d)/, '$1.$2') // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1') // captura 2 numeros seguidos de um traço e não deixa ser digitado mais nada
}

export const dataMask = value => {
  const data = value.toString()
  const dia = data.slice(8, 10)
  const mes = data.slice(5, 7)
  const ano = data.slice(0, 4)
  const dataCompleta = dia + '/' + mes + '/' + ano
  return dataCompleta
}

export const dataF = value => {
  const data = value.toString()
  const dia = data.slice(8, 10)
  const mes = data.slice(5, 7)
  const ano = data.slice(0, 4)
  const dataCompleta = ano + '-' + mes + '-' + dia
  return dataCompleta
}

export const dAF = () => {
  var data = new Date(),
    dia = data.getDate().toString(),
    diaF = (dia.length === 1) ? '0' + dia : dia,
    mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
    mesF = (mes.length === 1) ? '0' + mes : mes,
    anoF = data.getFullYear();
  return/*  anoF + "-" + mesF + "-" + diaF; */ diaF + "/" + mesF + "/" + anoF
}
export const dateFormat = () => {
  var data = new Date(),
    dia = data.getDate().toString(),
    diaF = (dia.length === 1) ? '0' + dia : dia,
    mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
    mesF = (mes.length === 1) ? '0' + mes : mes,
    anoF = data.getFullYear();
  return anoF + "-" + mesF + "-" + diaF;
}

export const convertDate = (data = Date(), format = true) => {
  var dia = data.getDate().toString(),
    diaF = (dia.length === 1) ? '0' + dia : dia,
    mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
    mesF = (mes.length === 1) ? '0' + mes : mes,
    anoF = data.getFullYear();

  if (!format) { return anoF + "-" + mesF + "-" + diaF }
  else { return diaF + "/" + mesF + "/" + anoF }
}

export const money = value => value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })