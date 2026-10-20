#!/usr/bin/env python3
"""Atualiza as galerias usando as imagens realmente existentes nas pastas."""
import json, pathlib, re
raiz=pathlib.Path(__file__).resolve().parents[1]
arquivo=raiz/'js/dados.js'
texto=arquivo.read_text(encoding='utf-8')
prefixo='window.SITE_DATA = '
pos=texto.find(prefixo)
if pos<0: raise SystemExit('Formato de js/dados.js não reconhecido')
dados=json.loads(texto[pos+len(prefixo):].strip().rstrip(';'))
exts={'.jpg','.jpeg','.png','.webp','.gif','.avif'}
for equipamento in dados['equipamentos']:
    pasta=raiz/'assets/equipamentos'/equipamento['id']
    equipamento['fotos']=[p.name for p in sorted(pasta.iterdir(),key=lambda p:p.name.lower()) if p.is_file() and p.suffix.lower() in exts] if pasta.exists() else []
    print(equipamento['nome'],len(equipamento['fotos']),'foto(s)')
pasta=raiz/'assets/obras'
dados['obras']=[{'arquivo':p.name,'legenda':'Obra realizada pela R.A. Terraplenagem'} for p in sorted(pasta.iterdir(),key=lambda p:p.name.lower()) if p.is_file() and p.suffix.lower() in exts] if pasta.exists() else []
arquivo.write_text('// Gerado automaticamente pelo script scripts/atualizar_fotos.py\nwindow.SITE_DATA = '+json.dumps(dados,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
print('Arquivo js/dados.js atualizado!')
