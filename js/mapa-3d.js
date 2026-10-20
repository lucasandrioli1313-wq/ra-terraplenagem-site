(() => {
  'use strict';
  const origin = [-48.8464, -26.3044]; // Joinville
  const radiusKm = 200;
  const cities = [
    ['Joinville','SC',-26.3044,-48.8464],['Araquari','SC',-26.3706,-48.7211],['São Francisco do Sul','SC',-26.2433,-48.6381],['Garuva','SC',-26.0292,-48.8526],['Itapoá','SC',-26.1166,-48.6165],['Barra Velha','SC',-26.6329,-48.6846],['Balneário Barra do Sul','SC',-26.4566,-48.6111],['Jaraguá do Sul','SC',-26.4851,-49.0713],['Guaramirim','SC',-26.4742,-49.0027],['Massaranduba','SC',-26.6107,-49.0055],['Schroeder','SC',-26.4116,-49.0740],['Corupá','SC',-26.4263,-49.2434],['São Bento do Sul','SC',-26.2503,-49.3786],['Campo Alegre','SC',-26.1950,-49.2650],['Rio Negrinho','SC',-26.2543,-49.5187],['Mafra','SC',-26.1116,-49.8052],['Canoinhas','SC',-26.1772,-50.3900],['Itaiópolis','SC',-26.3390,-49.9067],['Papanduva','SC',-26.3713,-50.1428],['Blumenau','SC',-26.9155,-49.0709],['Pomerode','SC',-26.7405,-49.1766],['Timbó','SC',-26.8245,-49.2717],['Indaial','SC',-26.8976,-49.2314],['Gaspar','SC',-26.9314,-48.9583],['Itajaí','SC',-26.9101,-48.6705],['Navegantes','SC',-26.8987,-48.6549],['Balneário Camboriú','SC',-26.9926,-48.6352],['Itapema','SC',-27.0912,-48.6114],['Brusque','SC',-27.0987,-48.9107],['Balneário Piçarras','SC',-26.7649,-48.6705],['Penha','SC',-26.7756,-48.6469],['Rio do Sul','SC',-27.2142,-49.6431],['Tijucas','SC',-27.2426,-48.6335],['Florianópolis','SC',-27.5949,-48.5482],['São José','SC',-27.6136,-48.6366],['Palhoça','SC',-27.6455,-48.6677],
    ['Curitiba','PR',-25.4284,-49.2733],['São José dos Pinhais','PR',-25.5313,-49.2031],['Araucária','PR',-25.5928,-49.4040],['Fazenda Rio Grande','PR',-25.6611,-49.3078],['Pinhais','PR',-25.4448,-49.1927],['Piraquara','PR',-25.4422,-49.0630],['Colombo','PR',-25.2917,-49.2242],['Almirante Tamandaré','PR',-25.3253,-49.3103],['Campo Largo','PR',-25.4595,-49.5280],['Campo Magro','PR',-25.3684,-49.4500],['Quatro Barras','PR',-25.3650,-49.0764],['Campina Grande do Sul','PR',-25.3045,-49.0552],['Rio Branco do Sul','PR',-25.1901,-49.3147],['Mandirituba','PR',-25.7771,-49.3250],['Contenda','PR',-25.6787,-49.5357],['Lapa','PR',-25.7689,-49.7158],['Tijucas do Sul','PR',-25.9254,-49.1791],['Agudos do Sul','PR',-25.9899,-49.3341],['Piên','PR',-26.0988,-49.4339],['Rio Negro','PR',-26.1009,-49.7983],['Quitandinha','PR',-25.8732,-49.4974],['Paranaguá','PR',-25.5163,-48.5225],['Pontal do Paraná','PR',-25.6735,-48.5112],['Matinhos','PR',-25.8170,-48.5420],['Guaratuba','PR',-25.8817,-48.5741],['Morretes','PR',-25.4776,-48.8340],['Antonina','PR',-25.4286,-48.7117],['Ponta Grossa','PR',-25.0945,-50.1633],['Castro','PR',-24.7893,-50.0114]
  ];
  function distance(lat,lon){const R=6371,toRad=Math.PI/180;const a=Math.sin((lat-origin[1])*toRad/2)**2+Math.cos(origin[1]*toRad)*Math.cos(lat*toRad)*Math.sin((lon-origin[0])*toRad/2)**2;return 2*R*Math.asin(Math.min(1,Math.sqrt(a)));}
  const filtered = cities.filter(c=>distance(c[2],c[3])<=radiusKm).sort((a,b)=>a[0].localeCompare(b[0],'pt-BR'));
  const list=document.getElementById('cidadesAtendimento');
  if(list){['SC','PR'].forEach(uf=>{const group=document.createElement('div');group.className='city-group';const title=document.createElement('h4');title.textContent=uf==='SC'?'Santa Catarina':'Paraná';group.appendChild(title);const ul=document.createElement('ul');filtered.filter(c=>c[1]===uf).forEach(c=>{const li=document.createElement('li');li.textContent=c[0];ul.appendChild(li)});group.appendChild(ul);list.appendChild(group)})}
  const target=document.getElementById('mapaAtuacao3d');if(!target)return;
  if(typeof maplibregl==='undefined'){target.innerHTML='<div class="map3d-loading">Não foi possível carregar o mapa. Confira sua conexão com a internet.</div>';return;}
  function circleRing(){const points=[];const lat=origin[1]*Math.PI/180,lon=origin[0]*Math.PI/180,delta=radiusKm/6371;for(let i=0;i<=240;i++){const b=2*Math.PI*i/240;const lat2=Math.asin(Math.sin(lat)*Math.cos(delta)+Math.cos(lat)*Math.sin(delta)*Math.cos(b));const lon2=lon+Math.atan2(Math.sin(b)*Math.sin(delta)*Math.cos(lat),Math.cos(delta)-Math.sin(lat)*Math.sin(lat2));points.push([lon2*180/Math.PI,lat2*180/Math.PI]);}return points;}
  const ring=circleRing();
  const map=new maplibregl.Map({container:target,center:[-49.05,-25.85],zoom:7.15,pitch:62,bearing:-13,antialias:true,maxPitch:85,style:{version:8,sources:{satellite:{type:'raster',tiles:['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],tileSize:256,attribution:'Imagery © Esri, Maxar, Earthstar Geographics and contributors'},terrain:{type:'raster-dem',url:'https://demotiles.maplibre.org/terrain-tiles/tiles.json',tileSize:256}},layers:[{id:'satellite',type:'raster',source:'satellite'}]}});
  map.addControl(new maplibregl.NavigationControl({visualizePitch:true}),'top-right');
  map.on('load',()=>{
    const loading=target.querySelector('.map3d-loading');if(loading)loading.remove();
    try{map.setTerrain({source:'terrain',exaggeration:1.25});}catch(e){console.warn('Relevo indisponível',e)}
    map.addSource('atendimento',{type:'geojson',data:{type:'FeatureCollection',features:[{type:'Feature',properties:{},geometry:{type:'Polygon',coordinates:[ring]}}]}});
    map.addLayer({id:'atendimento-verde',type:'fill',source:'atendimento',paint:{'fill-color':'#22e675','fill-opacity':0.22}});
    map.addLayer({id:'atendimento-borda',type:'line',source:'atendimento',paint:{'line-color':'#52ff96','line-width':3,'line-opacity':0.95}});
    map.addSource('fora',{type:'geojson',data:{type:'Feature',geometry:{type:'Polygon',coordinates:[[[-180,-85],[180,-85],[180,85],[-180,85],[-180,-85]],ring.slice().reverse()]},properties:{}}});
    map.addLayer({id:'fora-escuro',type:'fill',source:'fora',paint:{'fill-color':'#05070a','fill-opacity':0.58}});
    new maplibregl.Marker({color:'#ef2828'}).setLngLat(origin).setPopup(new maplibregl.Popup({offset:20}).setHTML('<strong>Joinville / SC</strong><p>Base da R.A. Terraplenagem</p>')).addTo(map);
    filtered.filter(c=>c[0]==='Curitiba').forEach(c=>new maplibregl.Marker({color:'#45e889',scale:0.7}).setLngLat([c[3],c[2]]).setPopup(new maplibregl.Popup().setText('Curitiba / PR • Região de atendimento')).addTo(map));
  });
  map.on('error',e=>console.warn('Mapa:',e.error));
  document.getElementById('map3dReset')?.addEventListener('click',()=>map.flyTo({center:[-49.05,-25.85],zoom:7.15,pitch:62,bearing:-13,duration:1200}));
  let tilted=true;document.getElementById('map3dTilt')?.addEventListener('click',()=>{tilted=!tilted;map.easeTo({pitch:tilted?62:0,bearing:tilted?-13:0,duration:900})});
})();
