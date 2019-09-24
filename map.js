//globals that update and are updated
var pr = 0 ;
var bpt = "";
var ept = "" ;
var rdname = '' ;
var nfc = 0 ;
var censustract = "" ;
var ru = 0 ;
var bufferzone = 0 ;
var population = 0 ;
var novehicle = "" ;
var ramp = 0 ;
var aadt = 0 ;


// //input is roadid, populates sidebar form // return aadt
function createMap() {

    mapboxgl.accessToken = 'pk.eyJ1Ijoic3RjaG9pIiwiYSI6ImNqd2pkNWN0NzAyNnE0YW8xeTl5a3VqMXQifQ.Rq3qT82-ysDHcMsHGTBiQg';


    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/stchoi/cjz8u2gky3dqn1cmxm71d6yus',
        center: [-83.84, 42.25],
        zoom: 14
    });

    map.addControl(new mapboxgl.NavigationControl());

    popup = new mapboxgl.Popup();

    map.on('click', ({point, lngLat}) =>{

        var features = map.queryRenderedFeatures(point, { layers: ['reducedallroads'] });
        console.log(features);
        var {properties: {PR, BPT, EPT, RDNAME, NFC, CENSUS_TRACT, RU, BUFFERZONE, POPULATION, NO_VEHICLE, RAMP, AADT}} = features[0];

        popup.setLngLat(lngLat).setHTML('<h6>' + RDNAME +'</h6><p>Functional Class: '+NFC+ '<br>Population: '+ POPULATION +'</p>').addTo(map);

        var filter = features.reduce(function(memo, feature) {
            memo.push(feature.properties.RDNAME);
            return memo;
        }, ['in', 'RDNAME']);

        map.setFilter("roads-highlighted", filter);
        // map.setPaintProperty('roads-highlighted', 'line-color', 'black');

        pr = PR ;
        bpt = BPT ;
        ept = EPT ;
        rdname = RDNAME ;
        nfc = NFC ;
        censustract = CENSUS_TRACT ;
        ru = RU ;
        bufferzone = BUFFERZONE ;
        population = POPULATION ;
        novehicle = NO_VEHICLE ;
        ramp = RAMP ;
        if (AADT){
            aadt = AADT;
        } else {
            aadt = 0;
        }

        updateVals();
    })

    map.on('load', () => {
      //https://docs.mapbox.com/mapbox-gl-js/api/#map#setpaintproperty
      // https://docs.mapbox.com/mapbox-gl-js/example/data-driven-circle-colors/
      //https://docs.mapbox.com/help/tutorials/mapbox-gl-js-expressions/
      //https://stackoverflow.com/questions/47951532/mapbox-gl-expressions
         map.setPaintProperty('reducedallroads', 'line-color', ['step',
              ['get', 'NFC'],
              '#0000FF', 2,
              '#FFFF00', 4,
              '#FF0000', 6,
             '#800080'
         ]);
         map.addSource('reducedallroads-highlight', {
            "type": "vector",
            "url": "mapbox://stchoi.8knoxxji"
        });
         map.addLayer({
            "id": "roads-highlighted",
            "type": "line",
            "source": "reducedallroads-highlight",
            "source-layer": "washtenaw_roads-5dftqu",
            "filter": ["in", "RDNAME", ""],
            "layout": {
                "line-cap" : "round"
            },
            "paint" : {
                "line-width" : 12,
                "line-opacity" : 0.4
            }
        }, 'road-label');
    });
    // https://bl.ocks.org/danswick/4906b495e0b206758f71
      map.on('mouseenter', 'reducedallroads', () => {
          map.getCanvas().style.cursor = 'pointer';
      });

      // Change it back to a pointer when it leaves.
      map.on('mouseleave', 'reducedallroads', () => {
          map.getCanvas().style.cursor = '';
        });
}

function updateVals(){
    console.log('got to updateVals');
    valSemcogAADT = document.querySelector("#valSemcogAADT");
    valEstimAADT = document.querySelector("#valEstimAADT")
    inp_NFC = document.querySelector("#inputfieldNFC");
    inp_RAMP = document.querySelector("#inputfieldRAMP");
    inp_RU = document.querySelector("#inputfieldRU");
    inp_BUFFERZONE = document.querySelector("#inputfieldBUFFERZONE");
    inp_POPULATION = document.querySelector("#inputfieldPOPULATION");
    inp_NOVEHICLE = document.querySelector("#inputfieldNOVEHICLE");
    inp_RDNAME = document.querySelector("#valRDNAME");

    valSemcogAADT.innerHTML = aadt;
    inp_NFC.value = nfc;
    inp_RAMP.value = ramp;
    inp_RU.value= ru;
    inp_BUFFERZONE.value = bufferzone;
    inp_POPULATION.value = population;
    inp_NOVEHICLE.value = novehicle;
    inp_RDNAME.innerHTML = rdname;
  }

function updateFromSearch(object){
    console.log('got to updatefromsearch')
    aadt = object.properties.AADT;
    nfc = object.properties.NFC;
    ramp = object.properties.RAMP;
    ru = object.properties.RU;
    bufferzone =  object.properties.BUFFERZONE;
    population = object.properties.POPULATION;
    novehicle = object.properties.NO_VEHICLE;
    pr = object.properties.PR ;
    bpt = object.properties.BPT ;
    ept = object.properties.EPT ;
    rdname = object.properties.RDNAME ;
    censustract = object.properties.CENSUS_TRACT ;

    updateVals();
}

function listenForVals(){
    event.preventDefault();
    // valSemcogAADT = document.querySelector("#valSemcogAADT").value;
    val_NFC = document.querySelector("#inputfieldNFC").value;
    val_RAMP = document.querySelector("#inputfieldRAMP").value;
    val_RU = document.querySelector("#inputfieldRU").value;
    val_BUFFERZONE = document.querySelector("#inputfieldBUFFERZONE").value;
    val_POPULATION = document.querySelector("#inputfieldPOPULATION").value;
    val_NOVEHICLE = document.querySelector("#inputfieldNOVEHICLE").value;
    val_RDNAME = document.querySelector("#valRDNAME").innerHTML;
    
    map.queryRenderedFeatures({layers : ['reducedallroads']}).map(j => j)
                                                             .forEach( obj => {
                                                                  if ( obj.properties.RDNAME === val_RDNAME ){
                                                                      console.log("match");
                                                                      selectOnMap(obj);
                                                                      updateFromSearch(obj);
                                                                  }
                                                            });
}

function selectOnMap(road){
      popup.setLngLat(road.geometry.coordinates[0]).setHTML('<h6>' + road.properties.RDNAME +'</h6><p>Functional Class: '+ road.properties.NFC + '<br>Population: '+ road.properties.POPULATION +'</p>');

      map.setFilter("roads-highlighted",  ['==', ['get', 'RDNAME'], road.properties.RDNAME]);
      map.setPaintProperty('roads-highlighted', 'line-color', 'black');

}

function calculateNewAADT(){
    console.log("calculate");
    event.preventDefault();
    valEstimAADT = document.querySelector("#valEstimAADT");
    val_NFC = parseInt(document.querySelector("#inputfieldNFC").value);
    val_RAMP = parseInt(document.querySelector("#inputfieldRAMP").value);
    val_RU = parseInt(document.querySelector("#inputfieldRU").value);
    val_BUFFERZONE = parseInt(document.querySelector("#inputfieldBUFFERZONE").value);
    val_POPULATION = parseInt(document.querySelector("#inputfieldPOPULATION").value);
    val_NOVEHICLE = parseInt(document.querySelector("#inputfieldNOVEHICLE").value);

    function coefficientNFC(){
        if (val_NFC == 2){
            console.log("nfc is 2");
            return 3.939
        } else if (val_NFC == 3){
            console.log("nfc is 3");
            return -115.222
        } else if (val_NFC == 4){
            console.log("nfc is 4");
            return -156.401
        } else if (val_NFC == 5){
            console.log("nfc is 5");
            return -178.466
        } else {
            console.log("nfc is not 2, 3, 4, or 5");
            return 0
        };
    };

    estimaadt = Math.pow((251.461 + coefficientNFC() -178.466*val_RAMP -3.902*val_NOVEHICLE + 11.151*val_RU), 2)

    valEstimAADT.innerHTML = estimaadt;
    // val_AADT.innerHTML = "we did it"
}