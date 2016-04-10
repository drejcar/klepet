var Klepet = function(socket) {
  this.socket = socket;
};

Klepet.prototype.posljiSporocilo = function(kanal, besedilo) {
  var sporocilo = {
    kanal: kanal,
    besedilo: besedilo
  };
  this.socket.emit('sporocilo', sporocilo);
  var bla=sporocilo.besedilo.match(/https?:\/\/.*\.(?:png|jpg|gif)/g);
  console.log(bla);
  for(var img in bla){
     var idiv=document.createElement('div');
     idiv.id='slika';
     var inimg=document.createElement('img');
     inimg.src=bla[img];
     inimg.width=200;
  //   inimg.height=110;
     //inimg.longdesc=img;
     idiv.appendChild(inimg);
     var slikca={
       kanal:kanal,
       besedilo:idiv
     };
     //document.body.appendChild(idiv);
     //document.getElementById('#sporocila').innerHTML+=inimg;
     this.socket.emit('sporocilo',idiv);
     //document.body.getElementById('#vsebina').getElementById('#sporocila').appendChild(idiv);
     //var slikelement="<div id='slika'> <img src='img'></div>";
     //$('#sporocila').appendChild(slikelement.);
  }
};

Klepet.prototype.spremeniKanal = function(kanal) {
  this.socket.emit('pridruzitevZahteva', {
    novKanal: kanal
  });
};

Klepet.prototype.procesirajUkaz = function(ukaz) {
  var besede = ukaz.split(' ');
  ukaz = besede[0].substring(1, besede[0].length).toLowerCase();
  var sporocilo = false;

  switch(ukaz) {
    case 'pridruzitev':
      besede.shift();
      var kanal = besede.join(' ');
      this.spremeniKanal(kanal);
      break;
    case 'vzdevek':
      besede.shift();
      var vzdevek = besede.join(' ');
      this.socket.emit('vzdevekSpremembaZahteva', vzdevek);
      break;
    case 'zasebno':
      besede.shift();
      var besedilo = besede.join(' ');
      var parametri = besedilo.split('\"');
      if (parametri) {
        this.socket.emit('sporocilo', { vzdevek: parametri[1], besedilo: parametri[3] });
        sporocilo = '(zasebno za ' + parametri[1] + '): ' + parametri[3];
      } else {
        sporocilo = 'Neznan ukaz';
      }
      break;
    default:
      sporocilo = 'Neznan ukaz.';
      break;
  };

  return sporocilo;
};
