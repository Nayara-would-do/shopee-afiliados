async function gerarConteudo() {
    const nome = document.getElementById('nome').value
    const preco = document.getElementById('preco').value
    const avaliacao = document.getElementById('avaliacao').value
    const descricao = document.getElementById('descricao').value
    const link = document.getElementById('link').value
  
    if (!nome || !preco || !descricao || !link) {
      alert('Preencha pelo menos o nome, preço, descrição e link!')
      return
    }
  
    document.getElementById('loading').style.display = 'block'
    document.getElementById('resultado').style.display = 'none'
  
    try {
      const response = await fetch('/api/gerar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, preco, avaliacao, descricao, link })
      })
  
      const data = await response.json()
  
      document.getElementById('loading').style.display = 'none'
      document.getElementById('resultado').style.display = 'block'
  
      document.getElementById('whatsapp').innerHTML = formatarWhatsapp(data.whatsapp)
      document.getElementById('reels').innerHTML = formatarTexto('Roteiro', data.reels)
      document.getElementById('instagram').innerHTML = formatarTexto('Legenda', data.instagram)
      document.getElementById('thumbnail').innerHTML = formatarTexto('Sugestão de Thumbnail', data.thumbnail)
  
      mostrarAba('whatsapp')
  
    } catch (error) {
      document.getElementById('loading').style.display = 'none'
      alert('Erro ao gerar conteúdo. Tente novamente!')
      console.error(error)
    }
  }
  
  function formatarWhatsapp(textos) {
    if (!textos) return ''
    return textos.map((texto, i) => {
      const titulos = ['🔥 Versão Urgência', '💛 Versão Emocional', 'ℹ️ Versão Informativa']
      return `
        <div class="caixa-texto">
          <h3>${titulos[i]}</h3>
          <p>${texto}</p>
          <button class="btn-copiar" onclick="copiar(this, '${escapar(texto)}')">📋 Copiar</button>
        </div>
      `
    }).join('')
  }
  
  function formatarTexto(titulo, texto) {
    if (!texto) return ''
    return `
      <div class="caixa-texto">
        <h3>${titulo}</h3>
        <p>${texto}</p>
        <button class="btn-copiar" onclick="copiar(this, '${escapar(texto)}')">📋 Copiar</button>
      </div>
    `
  }
  
  function escapar(texto) {
    return texto.replace(/'/g, "\\'").replace(/\n/g, '\\n')
  }
  
  function copiar(btn, texto) {
    const textoReal = texto.replace(/\\n/g, '\n')
    navigator.clipboard.writeText(textoReal)
    btn.innerText = '✅ Copiado!'
    setTimeout(() => btn.innerText = '📋 Copiar', 2000)
  }
  
  function mostrarAba(aba) {
    document.querySelectorAll('.conteudo-aba').forEach(el => el.style.display = 'none')
    document.querySelectorAll('.aba').forEach(el => el.classList.remove('ativa'))
    document.getElementById(aba).style.display = 'block'
    event.target.classList.add('ativa')
  }