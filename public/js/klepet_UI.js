function divElementEnostavniTekst(sporocilo) {
  var jeSmesko = sporocilo.indexOf('http://sandbox.lavbic.net/teaching/OIS/gradivo/') > -1;
  if (jeSmesko) {
    sporocilo = sporocilo.replace(/\</g, '&lt;').replace(/\>/g, '&gt;').replace('&lt;img', '<img').replace('png\' /&gt;', 'png\' />');
    return $('<div style="font-weight: bold"></div>').html(sporocilo);
  } else {
    return $('<div style="font-weight: bold;"></div>').text(sporocilo);
  }
}

function divElementHtmlTekst(sporocilo) {
  return $('<div></div>').html('<i>' + sporocilo + '</i>');
}

function procesirajVnosUporabnika(klepetApp, socket) {
  var sporocilo = $('#poslji-sporocilo').val();
  sporocilo = dodajSmeske(sporocilo);
  var sistemskoSporocilo;

  if (sporocilo.charAt(0) == '/') {
    sistemskoSporocilo = klepetApp.procesirajUkaz(sporocilo);
    if (sistemskoSporocilo) {
      $('#sporocila').append(divElementHtmlTekst(sistemskoSporocilo));
    }
  } else {
    sporocilo = filtirirajVulgarneBesede(sporocilo);
    klepetApp.posljiSporocilo(trenutniKanal, sporocilo);
    $('#sporocila').append(divElementEnostavniTekst(sporocilo));
    var blu=sporocilo.match(/https?:\/\/.*\.(?:png|jpg|gif)/g);
    var blu1=sporocilo.match(/(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/g);
    console.log(blu.length);
    console.log(blu);
    var bla="";
    bla=blu[0].split(" ");
    console.log(bla.length);
    for(var img in bla){
     var idiv=document.createElement('div');
     idiv.id='slika';
     var inimg=document.createElement('img');
     inimg.src=bla[img];
     inimg.width=200;
     idiv.appendChild(inimg);
     $('#sporocila').append(idiv);
     bla=blu1[0].split(" ");
    for(var link in bla){
      idvidea=bla[link].split("=");
      console.log(bla[1]);
      var idiv=document.createElement('div');
      idiv.id='vid';
      var inimg=document.createElement('iframe');
      inimg.src="https://www.youtube.com/embed/"+idvidea[1];
      inimg.setAttribute('allowfullscreen','');
      idiv.appendChild(inimg);
      $('#sporocila').append(idiv);
    }
    $('#sporocila').scrollTop($('#sporocila').prop('scrollHeight'));
  }

  $('#poslji-sporocilo').val('');
}

var socket = io.connect();
var trenutniVzdevek = "", trenutniKanal = "";

var vulgarneBesede = [];
$.get('/swearWords.txt', function(podatki) {
  vulgarneBesede = podatki.split('\r\n');
});

function filtirirajVulgarneBesede(vhod) {
  for (var i in vulgarneBesede) {
    vhod = vhod.replace(new RegExp('\\b' + vulgarneBesede[i] + '\\b', 'gi'), function() {
      var zamenjava = "";
      for (var j=0; j < vulgarneBesede[i].length; j++)
        zamenjava = zamenjava + "*";
      return zamenjava;
    });
  }
  return vhod;
}
//regex za youtube
//(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?

$(document).ready(function() {
  var klepetApp = new Klepet(socket);

  socket.on('vzdevekSpremembaOdgovor', function(rezultat) {
    var sporocilo;
    if (rezultat.uspesno) {
      trenutniVzdevek = rezultat.vzdevek;
      $('#kanal').text(trenutniVzdevek + " @ " + trenutniKanal);
      sporocilo = 'Prijavljen si kot ' + rezultat.vzdevek + '.';
    } else {
      sporocilo = rezultat.sporocilo;
    }
    $('#sporocila').append(divElementHtmlTekst(sporocilo));
  });

  socket.on('pridruzitevOdgovor', function(rezultat) {
    trenutniKanal = rezultat.kanal;
    $('#kanal').text(trenutniVzdevek + " @ " + trenutniKanal);
    $('#sporocila').append(divElementHtmlTekst('Sprememba kanala.'));
  });
  
  socket.on('dregljaj',function(dregljaj) {
     $('#vsebina').jrumble();
     $('#vsebina').trigger('startRumble');
     //$('#sporocila').append((divElementHtmlTekst("dregljaj")));
     setTimeout(function(){$('#vsebina').trigger('stopRumble');},1500);
  });
  
  socket.on('sporocilo', function (sporocilo) {
    var novElement = divElementEnostavniTekst(sporocilo.besedilo);
    $('#sporocila').append(novElement);
<<<<<<< HEAD
    var blu=sporocilo.besedilo.match(/https?:\/\/.*\.(?:png|jpg|gif)/g);
=======
     var blu=sporocilo.besedilo.match(/(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/g);
>>>>>>> youtube
    console.log(blu.length);
    console.log(blu);
    var bla="";
    bla=blu[0].split(" ");
<<<<<<< HEAD
    for(var img in bla){
      console.log(bla.length);
      console.log(bla);
      var idiv=document.createElement('div');
      idiv.id='slika';
      var inimg=document.createElement('img');
      inimg.src=bla[img];
      inimg.width=200;
      
      idiv.appendChild(inimg);
      $('#sporocila').append(idiv);
=======
    for(var link in bla){
    idvidea=bla[link].split("=");
    console.log(bla[1]);
     var idiv=document.createElement('div');
     idiv.id='vid';
     var inimg=document.createElement('iframe');
     inimg.src="https://www.youtube.com/embed/"+idvidea[1];
     inimg.setAttribute('allowfullscreen','');
     idiv.appendChild(inimg);
     $('#sporocila').append(idiv);
>>>>>>> youtube
    }
  });
  
  socket.on('kanali', function(kanali) {
    $('#seznam-kanalov').empty();

    for(var kanal in kanali) {
      kanal = kanal.substring(1, kanal.length);
      if (kanal != '') {
        $('#seznam-kanalov').append(divElementEnostavniTekst(kanal));
      }
    }

    $('#seznam-kanalov div').click(function() {
      klepetApp.procesirajUkaz('/pridruzitev ' + $(this).text());
      $('#poslji-sporocilo').focus();
    });
  });

  socket.on('uporabniki', function(uporabniki) {
    $('#seznam-uporabnikov').empty();
    for (var i=0; i < uporabniki.length; i++) {
      $('#seznam-uporabnikov').append(divElementEnostavniTekst(uporabniki[i]));
    }
    $('#seznam-uporabnikov div').click(function() {
      var msg=('/zasebno "' + $(this).text()+'" ');
      $('#poslji-sporocilo').val(msg);
      $('#poslji-sporocilo').focus();
    });
    
  });

  setInterval(function() {
    socket.emit('kanali');
    socket.emit('uporabniki', {kanal: trenutniKanal});
  }, 1000);

  $('#poslji-sporocilo').focus();

  $('#poslji-obrazec').submit(function() {
    procesirajVnosUporabnika(klepetApp, socket);
    return false;
  });
  
  
});

function dodajSmeske(vhodnoBesedilo) {
  var preslikovalnaTabela = {
    ";)": "wink.png",
    ":)": "smiley.png",
    "(y)": "like.png",
    ":*": "kiss.png",
    ":(": "sad.png"
  }
  for (var smesko in preslikovalnaTabela) {
    vhodnoBesedilo = vhodnoBesedilo.replace(smesko,
      "<img src='http://sandbox.lavbic.net/teaching/OIS/gradivo/" +
      preslikovalnaTabela[smesko] + "' />");
  }
  return vhodnoBesedilo;
}
